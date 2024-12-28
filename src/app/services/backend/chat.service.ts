import { Injectable } from '@angular/core';
import { createGrpcWebTransport } from './util';
import { MapCached } from './cacheable';
import { ChatChannel, ChatChannels, ChatMessage, RequestSetCharacterSetChatChannelAuth, UpdateChatChannelRequest } from '../../../protos/sro/chat/chat';
import { ChatServiceClient } from '../../../protos/sro/chat/chat.client';
import { KeycloakService } from '../../auth/keycloak.service';
import { NotificationService } from '../ui/notification.service';
import { environment } from '../../../environments/environment';
import { AlertComponent } from '../../components/alert/alert.component';
import { FetchType } from './fetch';
import { Subject, Observable } from 'rxjs';

interface ChatSession {
  channelId: string;
  characterId: string;
  _messages$: Subject<ChatSessionMessage>;
}

interface ChatSessionMessage {
  message?: ChatMessage;
  info?: string;
  warning?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private instance: ChatServiceClient;

  private chatCache: MapCached<ChatChannel>;

  private connectedChats: ChatSession[] = [];

  constructor(
    protected _keycloak: KeycloakService,
    protected _notificationService: NotificationService,
  ) {
    this.instance = new ChatServiceClient(
      createGrpcWebTransport(environment.CHAT_GRPC_URL, this._keycloak),
    );
    this.chatCache = new MapCached(
      'chats',
      'id',
      this._getChat.bind(this),
      this._getChats.bind(this),
    );
  }

  sendChatMessage(channelId: string, chatMessage: ChatMessage): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.instance.sendChatChannelMessage({ channelId, chatMessage });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  disconnectChatChannel(characterId: string, channelId: string): boolean {
    return this.disconnectSession(this._getSession(characterId, channelId));
  }

  disconnectSession(session: ChatSession | undefined): boolean {
    if (session) {
      session._messages$.complete();
      return this.connectedChats.splice(this.connectedChats.indexOf(session), 1).length == 1;
    }
    return false
  }

  connectChatChannel(characterId: string, channelId: string, autoRetry: boolean = true): Observable<ChatSessionMessage> {
    const session = this._getSession(characterId, channelId);
    if (session) {
      return session._messages$.asObservable();
    }

    const newSession: ChatSession = {
      channelId,
      characterId,
      _messages$: new Subject<ChatSessionMessage>(),
    };
    this._readMessages(newSession, autoRetry);

    return newSession._messages$.asObservable();
  }

  private _getSession(characterId: string, channelId: string): ChatSession | undefined {
    return this.connectedChats.find((session) => session.characterId === characterId && session.channelId === channelId);
  }

  private async _readMessages(session: ChatSession, autoRetry: boolean) {
    try {
      const call = this.instance.connectChatChannel({ characterId: session.characterId, channelId: session.channelId })
      for await (const message of call.responses) {
        session._messages$.next({ message });
      }

      session._messages$.next({ warning: 'Chat disconnected' });

      const status = await call.status;
      session._messages$.next({ info: `Chat disconnected: ${status.code}` });
      if (status.code !== "Ok") {
        session._messages$.next({ error: `${status.code}: ${status.detail}` });
      }
    } catch (e: any) {
      if (autoRetry) {
        if (e.code === 'PERMISSION_DENIED') {
          session._messages$.next({ error: 'You do not have permission to access this chat' });
          this.disconnectSession(session);
          return
        }

        if (e.code === 'UNAUTHENTICATED') {
          session._messages$.next({ error: 'You are not authenticated' });
          this.disconnectSession(session);
          return
        }
      }
      session._messages$.next({ error: `Chat connection: ${e}` });
    }

    if (autoRetry) {
      session._messages$.next({ info: 'Reconnecting...' });
      if (this.connectedChats.includes(session)) {
        setTimeout(() => this._readMessages(session, autoRetry), 1000);
      }
      return
    }

    this.disconnectSession(session);
  }

  setAuthorizedChatChannels(characterId: string, chatIds: string[]): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const request = RequestSetCharacterSetChatChannelAuth.create();
        request.characterId = characterId;
        request.ids = chatIds;
        await this.instance.setCharacterChatChannelAuth(request);
        this._showSuccess('Chat channels updated');
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  getAuthorizedChats(characterId: string): Promise<ChatChannels> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.instance.getAuthorizedChatChannels({ id: characterId });
        resolve(response.response);
      } catch (e) {
        reject(e);
      }
    });
  }

  createChatChannel(chat: ChatChannel): Promise<ChatChannel> {
    return new Promise(async (resolve, reject) => {
      try {
        const finished = await this.instance.createChatChannel(chat);
        this.chatCache.save(finished.response);
        this._showSuccess('Chat created');
        resolve(finished.response);
      } catch (e) {
        reject(e);
      }
    });
  }

  editChat(request: UpdateChatChannelRequest): Promise<ChatChannel> {
    return new Promise(async (resolve, reject) => {
      try {
        const finished = await this.instance.editChatChannel(request);
        this.chatCache.save(finished.response);
        this._showSuccess('Chat updated');
        resolve(finished.response);
      } catch (e) {
        reject(e);
      }
    });
  }

  deleteChat(chatId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.instance.deleteChatChannel({ id: chatId });
        this.chatCache.remove(chatId);
        this._showSuccess('Chat deleted');
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  private _showError(message: string) {
    this._notificationService.open(AlertComponent, {
      data: {
        message: message,
        type: 'error',
      },
      autohide: false,
    });
  }

  private _showSuccess(message: string) {
    this._notificationService.open(AlertComponent, {
      data: {
        message: message,
        type: 'success',
      },
      autohide: false,
    });
  }

  getChats(fetchType = FetchType.AUTO): Promise<Map<string, ChatChannel>> {
    return this.chatCache.getAll(fetchType);
  }

  getChat(chatId: string, fetchType = FetchType.AUTO): Promise<ChatChannel> {
    return this.chatCache.get(chatId, fetchType);
  }

  private _getChats(): Promise<ChatChannel[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const finished = await this.instance.getChatChannels({});
        resolve(finished.response.channels);
      } catch (e) {
        reject(e);
      }
    });
  }

  private _getChat(chatId: string): Promise<ChatChannel> {
    return new Promise(async (resolve, reject) => {
      try {
        const finished = await this.instance.getChatChannel({ id: chatId });
        resolve(finished.response);
      } catch (e) {
        reject(e);
      }
    });
  }
}
