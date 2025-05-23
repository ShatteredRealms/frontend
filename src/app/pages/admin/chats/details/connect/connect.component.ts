import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ChatMessage } from '../../../../../../protos/sro/chat/chat';
import { ChatService } from '../../../../../services/backend/chat.service';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from '../../../../../services/backend/character.service';
import { Character } from '../../../../../../protos/sro/character/character';
import { NotificationRef } from '../../../../../services/ui/notification';
import { ChatMessageComponent } from '../../../../../components/chat/chat-message/chat-message.component';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '../../../../../components/select/select.component';
import { OptionComponent } from '../../../../../components/option/option.component';

interface ChatChannelHistory {
  message?: ChatMessage;
  info?: string;
  warning?: string;
  error?: string;
}

@Component({
  selector: 'app-chat-connect',
  imports: [
    ChatMessageComponent,
    FormsModule,
    SelectComponent,
    OptionComponent,
  ],
  templateUrl: './connect.component.html',
})
export class ChatConnectComponent {
  @ViewChild('chatMessages') chatMessages: ElementRef;
  @ViewChild('resumeScrollingButton') resumeScrollingButton: ElementRef;

  message: string = '';
  chatHistory: ChatChannelHistory[] = [];
  id: string = '';
  character: Character | undefined = undefined;
  selectedCharacterId: string = '';
  characters: Map<string, Character> = new Map();

  prevMsgCount: number = 0;
  pauseScrolling: boolean = false;
  prevScrollTop: number = 0;

  warnMessage: NotificationRef;

  connected: boolean = false;

  constructor(
    protected _chatService: ChatService,
    protected _characterService: CharacterService,
    protected _route: ActivatedRoute,
  ) {
    this.id = this._route.parent?.snapshot.params['id'] as string;
    if (this.id === undefined) {
      throw new Error('Chat ID is required');
    }
  }

  ngOnInit() {
    this._characterService.getCharacters().then((characters) => {
      this.characters = characters;
      this.chatHistory.push({ info: "Select character to connect" });
    });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (!this.pauseScrolling) {
      this._scrollBottom();
      return
    }

    if (this.chatMessages.nativeElement.scrollTop == 0) {
      this._scrollBottom();
      return
    }

    if (this._isScrolledBottom()) {
      this._scrollBottom();
    }
  }

  ngAfterViewInit() {
    this.chatMessages.nativeElement.addEventListener('scroll', () => {
      const currentScroll = this.chatMessages.nativeElement.scrollTop;
      if (this.prevScrollTop > currentScroll) {
        this.pauseScrolling = true;
      } else if (this.pauseScrolling && this._isScrolledBottom()) {
        this._scrollBottom();
      }
      this.prevScrollTop = currentScroll;
    });
  }

  connect() {
    if (this.character === undefined) {
      this.chatHistory.push({ error: 'No character selected. Please select a character.' });
    }

    this.chatHistory.push({ info: `Connecting to chat as ${this.getCharacterName()}` });
    this.connected = true;
    this._chatService.connectChatChannel(this.character!.id, this.id).subscribe({
      next: (session) => {
        if (session.message) {
          this.chatHistory.push({ message: session.message });
        } else if (session.info) {
          this.chatHistory.push({ info: session.info });
        } else if (session.error) {
          this.chatHistory.push({ error: session.error });
        } else if (session.warning) {
          this.chatHistory.push({ warning: session.warning });
        }
      },
      error: (error) => {
        this.chatHistory.push({ error: `Connecting to chat: ${error}` });
        this.connected = false;
      },
      complete: () => {
        this.connected = false;
      },
    });
  }

  ngAfterViewChecked() {
    if (this.prevMsgCount !== this.chatHistory.length) {
      this.prevMsgCount = this.chatHistory.length;
      if (!this.pauseScrolling) {
        this._scrollBottom();
      }
    }
  }

  private _scrollBottom() {
    this.pauseScrolling = false;
    this.chatMessages.nativeElement.scrollTo({ behavior: 'smooth', top: this.chatMessages.nativeElement.scrollHeight });
  }

  sendMessage() {
    if (this.message === '') {
      return;
    }

    if (this.character === undefined) {
      this.chatHistory.push({ error: 'No character selected. Please select a characeter.' });
      return;
    }
    const chatMessage = ChatMessage.create();
    chatMessage.content = this.message;
    chatMessage.senderCharacterId = this.character.id;
    this._chatService.sendChatMessage(this.id, chatMessage).then(() => {
      this.message = '';
    }).catch((error) => {
      this.chatHistory.push({ error: `Sending message: ${error}` });
    }).finally(() => {
    });
  }

  disconnectChat() {
    if (this.connected) {
      this.chatHistory.push({ info: `Disconnecting from chat as ${this.getCharacterName()}` });
      this._chatService.disconnectChatChannel(this.character!.id, this.id)
      this.connected = false;
    }
  }

  characterChange(characterId: string) {
    if (characterId) {
      const character = this.characters.get(characterId);
      if (character) {
        if (this.character === character) {
          return;
        }

        this.disconnectChat();
        this.character = character;
        this.connect();
        return;
      }

      this.chatHistory.push({ error: `Character not found: ${characterId}` });
      return
    }

    this.disconnectChat();
    this.character = undefined;
    return;
  }

  getCharacterName(): string {
    if (this.character?.name !== '') {
      return this.character!.name;
    }
    return `Unknown (${this.character.id})`;
  }

  resumeScrolling() {
    this.pauseScrolling = false;
    this._scrollBottom();
  }

  private _isScrolledBottom(): boolean {
    return this.chatMessages.nativeElement.scrollTop >= this.chatMessages.nativeElement.scrollHeight - this.chatMessages.nativeElement.clientHeight - 75
  }
}
