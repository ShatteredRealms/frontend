import { Injectable } from '@angular/core';
import { createGrpcWebTransport } from './util';
import { MapCached } from './cacheable';
import { ChatChannel, UpdateChatChannelRequest } from '../../../protos/sro/chat/chat';
import { ChatServiceClient } from '../../../protos/sro/chat/chat.client';
import { KeycloakService } from '../../auth/keycloak.service';
import { NotificationService } from '../ui/notification.service';
import { environment } from '../../../environments/environment';
import { AlertComponent } from '../../components/alert/alert.component';
import { FetchType } from './fetch';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private instance: ChatServiceClient;

  private chatCache: MapCached<ChatChannel>;

  constructor(
    protected keycloak: KeycloakService,
    protected _notificationService: NotificationService,
  ) {
    this.instance = new ChatServiceClient(
      createGrpcWebTransport(environment.CHAT_GRPC_URL, keycloak),
    );
    this.chatCache = new MapCached(
      'chats',
      'id',
      this._getChat.bind(this),
      this._getChats.bind(this),
    );
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
