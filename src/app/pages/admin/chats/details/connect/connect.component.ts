import { Component, ElementRef, ViewChild } from '@angular/core';
import { ChatMessage } from '../../../../../../protos/sro/chat/chat';
import { ChatService } from '../../../../../services/backend/chat.service';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from '../../../../../services/backend/character.service';
import { CharacterDetails } from '../../../../../../protos/sro/character/character';
import { NotificationRef } from '../../../../../services/ui/notification';
import { ChatMessageComponent } from '../../../../../components/chat/chat-message/chat-message.component';
import { FormsModule } from '@angular/forms';
import { SelectComponent } from '../../../../../components/select/select.component';
import { OptionComponent } from '../../../../../components/option/option.component';

interface ChatChannelHistory {
  message?: ChatMessage;
  info?: string;
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

  message: string = '';
  chatHistory: ChatChannelHistory[] = [];
  id: string = '';
  character: CharacterDetails | undefined = undefined;
  characters: Map<string, CharacterDetails> = new Map();

  prevMsgCount: number = 0;
  wasScrolledBottom: boolean = true;

  warnMessage: NotificationRef;

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

  connect() {
    if (this.character === undefined) {
      this.chatHistory.push({ error: 'No character selected. Please select a character.' });
    }

    this.chatHistory.push({ info: `Connecting to chat as ${this.character!.characterId}` });
    this._chatService.connectChatChannel(this.character!.characterId, this.id).subscribe({
      next: (message) => {
        this.wasScrolledBottom = this.chatMessages.nativeElement.scrollTop + this.chatMessages.nativeElement.clientHeight >= this.chatMessages.nativeElement.scrollHeight;
        this.chatHistory.push({ message });
      },
      error: (error) => {
        this.chatHistory.push({ error: `Connecting to chat: ${error}` });
      },
    });
  }

  ngAfterViewChecked() {
    if (this.prevMsgCount !== this.chatHistory.length) {
      this.prevMsgCount = this.chatHistory.length;
      if (this.wasScrolledBottom) {
        this.chatMessages.nativeElement.scrollTo({ behavior: 'smooth', top: this.chatMessages.nativeElement.scrollHeight });
      }
    }
  }

  sendMessage() {
    if (this.message === '') {
      return;
    }

    if (this.character === undefined) {
      console.log('sendMessage', 'no character');
      this.chatHistory.push({ error: 'No character selected. Please select a characeter.' });
      return;
    }
    const chatMessage = ChatMessage.create();
    chatMessage.content = this.message;
    chatMessage.senderCharacterId = this.character.characterId;

    this._chatService.sendChatMessage(this.id, chatMessage).then(() => {
      this.message = '';
    }).catch((error) => {
      this.chatHistory.push({ error: `Sending message: ${error}` });
    });
  }

  disconnectChat() {
    if (this.character?.characterId) {
      this.chatHistory.push({ info: `Disconnecting from chat as ${this.character.characterId}` });
      this._chatService.disconnectChatChannel(this.character.characterId, this.id)
    }
  }

  characterChange(characterId: string) {
    console.log('characterChange', characterId, this.character);
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
}
