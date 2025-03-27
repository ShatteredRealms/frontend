import { Component, Input } from '@angular/core';
import { ChatMessage } from '../../../../protos/sro/chat/chat';
import { CharacterService } from '../../../services/backend/character.service';
import { Character } from '../../../../protos/sro/character/character';
import { fromEvent } from 'rxjs';
import { ChatService } from '../../../services/backend/chat.service';
import { NotificationService } from '../../../services/ui/notification.service';
import { AlertComponent } from '../../alert/alert.component';

@Component({
  selector: 'app-chat-message',
  imports: [
  ],
  templateUrl: './chat-message.component.html',
})
export class ChatMessageComponent {
  @Input() message: ChatMessage;
  @Input() channelId: string;
  showMenu: boolean = false;
  characters: Map<string, Character> = new Map();

  constructor(
    protected _characterService: CharacterService,
    protected _chatService: ChatService,
    protected _notificationService: NotificationService,
  ) {
    fromEvent(document, 'click').subscribe((event: any) => {
      if (this.showMenu) {
        if (!event.target.closest('#dropdownMenuIconButton')) {
          this.hideDropdown()
        }
      }
    });
  }

  ngOnInit() {
    this._characterService.getCharacters().then((characters) => {
      this.characters = characters;
    });
  }

  getCharacterName(characterId: string): string {
    if (characterId === '') {
      return 'System';
    }

    const character = this.characters.get(characterId);
    if (character) {
      return character.name;
    }
    return `Unknown (${characterId})`;
  }

  getReceivedTime(): string {
    return new Date(this.message.sentTimeMs).toLocaleTimeString();
  }

  toggleDropdown() {
    this.showMenu = !this.showMenu;
  }

  hideDropdown() {
    this.showMenu = false;
  }

  timeout(duration: number) {
    console.log('timeout')
    this._chatService.banCharacter({
      characterId: this.message.senderCharacterId,
      channelId: this.channelId,
      duration: duration,
    }).then(() => {
      this._notificationService.open(AlertComponent, {
        data: {
          message: `User '${this.getCharacterName(this.message.senderCharacterId)}' banned for ${duration > 0 ? `${duration}s` : 'permanently'}`,
          type: 'success',
          persist: true,
        },
        position: 'top-center',
        autohide: true,
      });
    }).catch((e) => {
      this._notificationService.open(AlertComponent, {
        data: {
          message: `Error banning user: ${e}`,
          type: 'error',
          persist: true,
        },
        position: 'top-center',
        autohide: true,
      });
    });
  }
}
