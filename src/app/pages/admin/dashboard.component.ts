import { Component } from '@angular/core';
import { CharactersTableComponent } from '../../components/characters/characters-table/characters-table.component';
import { Character } from '../../../protos/sro/character/character';
import { CharacterService } from '../../services/backend/character.service';
import { timeStringFromSeconds } from '../../helpers/time';
import { NotificationService } from '../../services/ui/notification.service';
import { FetchType } from '../../services/backend/fetch';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroArrowPath } from '@ng-icons/heroicons/outline';
import { NotificationRef } from '../../services/ui/notification';
import { AlertComponent } from '../../components/alert/alert.component';
import { DimensionService } from '../../services/backend/dimension.service';
import { Dimension } from '../../../protos/sro/gameserver/dimension';
import { RouterLink } from '@angular/router';
import { GameServerDataService } from '../../services/backend/gameserverdata.service';


@Component({
  selector: 'app-dashboard',
  imports: [
    CharactersTableComponent,
    NgIconComponent,
    RouterLink,
  ],
  providers: [
    provideIcons({ heroArrowPath }),
  ],
  templateUrl: './dashboard.component.html',
})
export class AdminDashboardComponent {
  characters: Map<string, Character> = new Map<string, Character>();
  dimensions: Map<string, Dimension> = new Map<string, Dimension>();
  numberOfGameServers: number = -2;

  private _refresh: NotificationRef;

  constructor(
    protected _characterService: CharacterService,
    protected _notificationService: NotificationService,
    protected _dimensionService: DimensionService,
    protected _gameServerDataService: GameServerDataService,
  ) {
  }

  ngOnInit() {
    this._characterService.getCharacters().then((resp) => {
      this.characters = resp;
    });
    this._dimensionService.getDimensions().then((resp) => {
      this.dimensions = resp;
    });
    this._gameServerDataService.getGameServerCount().then((count) => {
      this.numberOfGameServers = count;
      console.log('Game Server Count:', count);
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
