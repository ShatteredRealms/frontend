import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CharacterDetails } from '../../../../protos/sro/character/character';
import { CharacterService } from '../../../services/backend/character.service';
import { CharactersTableComponent } from '../../../components/characters/characters-table/characters-table.component';

@Component({
  selector: 'app-characters',
  imports: [
    RouterLink,
    RouterOutlet,
    CharactersTableComponent,
  ],
  templateUrl: './characters.component.html',
})
export class AdminCharactersComponent {
  characters: Map<string, CharacterDetails> = new Map();

  constructor(
    private _charactersService: CharacterService,
  ) { }

  ngOnInit() {
    this._charactersService.getCharacters().then((characters) => {
      this.characters = characters;
    });
  }
}
