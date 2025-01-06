import { Component } from '@angular/core';
import { CharacterService } from '../../../../services/backend/character.service';
import { MapService } from '../../../../services/backend/map.service';
import { NotificationService } from '../../../../services/ui/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from '../../../../components/alert/alert.component';
import { CharacterFormComponent } from '../../../../components/characters/character-form/character-form.component';
import { Character } from '../../../../../protos/sro/character/character';

@Component({
  selector: 'app-new-character',
  imports: [
    CharacterFormComponent,
  ],
  templateUrl: './new.component.html',
})
export class NewCharacterComponent {
  pendingSave = false;

  constructor(
    protected _charactersService: CharacterService,
    protected _mapService: MapService,
    protected _notificationService: NotificationService,
    protected _route: ActivatedRoute,
    protected _router: Router,
  ) {
  }

  onSubmit(character: Character) {
    if (this.pendingSave) {
      return;
    }

    this.pendingSave = true;
    this._charactersService.createCharacter(character).then((character) => {
      this._notificationService.open(AlertComponent, {
        data: {
          message: `Character ${character.name} (${character.id}) created!`,
          type: 'success',
          persist: true,
        },
        position: 'top-center',
        autohide: true,
      });
      this._router.navigate(['../'], { relativeTo: this._route });
    }).catch((e) => {
      this._notificationService.open(AlertComponent, {
        data: {
          message: `${e.code}: ${e.message}`,
          type: 'error',
          persist: true,
        },
        position: 'top-center',
        autohide: false,
      });
    }).finally(() => {
      this.pendingSave = false;
    })
  }
}
