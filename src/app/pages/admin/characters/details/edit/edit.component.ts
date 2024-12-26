import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CharacterDetails, EditCharacterRequest } from '../../../../../../protos/sro/character/character';
import { ActivatedRoute, Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { CharacterService } from '../../../../../services/backend/character.service';
import { MapService } from '../../../../../services/backend/map.service';
import { NotificationService } from '../../../../../services/ui/notification.service';
import { AlertComponent } from '../../../../../components/alert/alert.component';
import { CharacterFormComponent } from '../../../../../components/characters/character-form/character-form.component';

@Component({
  selector: 'app-edit-character',
  imports: [
    CharacterFormComponent,
  ],
  templateUrl: './edit.component.html',
})
export class EditCharacterComponent {
  character: CharacterDetails = inject<CharacterDetails>(ROUTER_OUTLET_DATA);
  id: string;

  pendingSave = false;

  constructor(
    protected _charactersService: CharacterService,
    protected _mapService: MapService,
    protected _notificationService: NotificationService,
    protected _route: ActivatedRoute,
    protected _router: Router,
  ) {
    this.id = this._route.parent?.snapshot.params['id'] as string;
    if (this.id === undefined) {
      throw new Error('Character ID is required');
    }
  }

  ngOnInit() {
    this._charactersService.getCharacter(this.id).then((character) => {
      this.character = character;
    });
  }

  onSubmit(character: CharacterDetails) {
    if (this.pendingSave) {
      return;
    }

    this.pendingSave = true;
    const request = EditCharacterRequest.create();
    request.characterId = this.id;
    request.optionalRealm = { oneofKind: 'realm', realm: character.realm }
    request.optionalGender = { oneofKind: 'gender', gender: character.gender }
    request.optionalNewName = { oneofKind: 'newName', newName: character.name }
    request.optionalDimension = { oneofKind: 'dimensionId', dimensionId: character.dimensionId }
    request.optionalOwnerId = { oneofKind: 'ownerId', ownerId: character.ownerId }

    this._charactersService.editCharacter(request).then((character) => {
      this.character = character;
      this._notificationService.open(AlertComponent, {
        data: {
          message: 'Character update successful!',
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
