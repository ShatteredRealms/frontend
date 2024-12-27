import { Component } from '@angular/core';
import { MapService } from '../../../../services/backend/map.service';
import { NotificationService } from '../../../../services/ui/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from '../../../../components/alert/alert.component';
import { Map as GSMap } from '../../../../../protos/sro/gameserver/map';
import { MapFormComponent } from '../../../../components/maps/map-form/map-form.component';

@Component({
  selector: 'app-new-map',
  imports: [
    MapFormComponent,
  ],
  templateUrl: './new.component.html',
})
export class NewMapComponent {
  pendingSave = false;

  constructor(
    protected _mapsService: MapService,
    protected _notificationService: NotificationService,
    protected _route: ActivatedRoute,
    protected _router: Router,
  ) {
  }

  onSubmit(map: GSMap) {
    if (this.pendingSave) {
      return;
    }

    this.pendingSave = true;
    this._mapsService.createMap(map).then((map) => {
      this._notificationService.open(AlertComponent, {
        data: {
          message: `Map channel ${map.name} (${map.id}) created!`,
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
