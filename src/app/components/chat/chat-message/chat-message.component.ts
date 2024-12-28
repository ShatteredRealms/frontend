import { Component, Input } from '@angular/core';
import { ChatMessage } from '../../../../protos/sro/chat/chat';
import { CharacterService } from '../../../services/backend/character.service';
import { CharacterDetails } from '../../../../protos/sro/character/character';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-chat-message',
  imports: [
  ],
  templateUrl: './chat-message.component.html',
})
export class ChatMessageComponent {
  @Input() message: ChatMessage;
  receivedTime: Date;
  showMenu: boolean = false;
  characters: Map<string, CharacterDetails> = new Map();

  constructor(
    protected _characterService: CharacterService,
  ) {
    this.receivedTime = new Date();
    fromEvent(document, 'click').subscribe((event: any) => {
      if (event.target.id !== 'dropdownMenuIconButton') {
        this.hideDropdown()
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
    return this.receivedTime.toLocaleTimeString();
  }

  toggleDropdown() {
    this.showMenu = !this.showMenu;
  }

  hideDropdown() {
    console.log('hide');
    this.showMenu = false;
  }
}
