import { Component, Input, ViewChild } from '@angular/core';
import { CharacterDetails } from '../../../../protos/sro/character/character';
import { CharacterService } from '../../../services/backend/character.service';
import { CommonModule } from '@angular/common';
import { timeAge, timeStringFromSeconds } from '../../../helpers/time';


@Component({
  selector: 'app-characters-table',
  imports: [
    CommonModule,
  ],
  templateUrl: './characters-table.component.html',
})
export class CharactersTableComponent {
  @Input() data: Map<string, CharacterDetails> = new Map<string, CharacterDetails>();


  constructor(
    protected _characterService: CharacterService,
  ) {
  }

  ngOnInit() {
  }

  timeAge(unixTime: number): string {
    return timeAge(new Date(Number(unixTime) * 1000));
  }

  getCharacters(): CharacterDetails[] {
    return this.data ? Array.from(this.data.values()) : [];
  }

  prettyTime(seconds: number) {
    return timeStringFromSeconds(Number(seconds), true, false);
  }
}
