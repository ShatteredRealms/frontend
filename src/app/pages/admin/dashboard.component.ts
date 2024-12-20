import { Component } from '@angular/core';
import { CharactersTableComponent } from '../../components/characters/characters-table/characters-table.component';
import { CharacterDetails } from '../../../protos/sro/character/character';
import { CharacterService } from '../../services/backend/character.service';
import { timeStringFromSeconds } from '../../helpers/time';
import { NotificationService } from '../../services/ui/notification.service';
import { FetchType } from '../../services/backend/fetch';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowPath } from '@ng-icons/heroicons/outline';
import { NotificationRef } from '../../services/ui/notification';
import { AlertComponent } from '../../components/alert/alert.component';


@Component({
  selector: 'app-dashboard',
  imports: [
    CharactersTableComponent,
    NgIconComponent,
  ],
  providers: [
    provideIcons({ heroArrowPath }),
  ],
  templateUrl: './dashboard.component.html',
})
export class AdminDashboardComponent {
  characters: Map<string, CharacterDetails> = new Map<string, CharacterDetails>();

  private _refresh: NotificationRef;

  constructor(
    protected _characterService: CharacterService,
    protected _notificationService: NotificationService,
  ) {
  }

  ngOnInit() {
    this._characterService.getCharacters().then((resp) => {
      this.characters = resp;
    });
  }

  totalTimePlayed() {
    let total = 0;
    this.characters.forEach((char) => {
      total += char.playTime;
    });
    const out = timeStringFromSeconds(Number(total), false, false).split(' ');
    return {
      time: out[0],
      unit: out[1],
    };
  }

  forceRefresh() {
    this._refresh = this._notificationService.open(AlertComponent, {
      data: {
        message: 'Refreshing character list...',
        type: 'info',
      },
      autohide: false,
    });
    this._characterService.getCharacters(FetchType.SERVER).then((resp) => {
      this._refresh.close();
      this._refresh = this._notificationService.open(AlertComponent, {
        data: {
          message: 'Refreshed character list',
          type: 'success',
        },
      });
      this.characters = resp;
    }).catch(() => this._refresh.close());
  }
}
