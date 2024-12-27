import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { MapService } from '../../../../../services/backend/map.service';
import { NotificationService } from '../../../../../services/ui/notification.service';
import { AlertComponent } from '../../../../../components/alert/alert.component';
import { MapFormComponent } from '../../../../../components/maps/map-form/map-form.component';
import { EditMapRequest, Map as GSMap } from '../../../../../../protos/sro/gameserver/map';

@Component({
  selector: 'app-edit-map',
  imports: [
    MapFormComponent,
  ],
  templateUrl: './edit.component.html',
})
export class EditMapComponent {
  map: GSMap = inject<GSMap>(ROUTER_OUTLET_DATA);
  id: string;

  pendingSave = false;

  constructor(
    protected _mapsService: MapService,
    protected _mapService: MapService,
    protected _notificationService: NotificationService,
    protected _route: ActivatedRoute,
    protected _router: Router,
  ) {
    this.id = this._route.parent?.snapshot.params['id'] as string;
    if (this.id === undefined) {
      throw new Error('Map ID is required');
    }
  }

  ngOnInit() {
    this._mapsService.getMap(this.id).then((map) => {
      this.map = map;
    });
  }

  onSubmit(map: GSMap) {
    if (this.pendingSave) {
      return;
    }

    this.pendingSave = true;
    const request = EditMapRequest.create();
    request.targetId = this.id;
    request.optionalName = { oneofKind: 'name', name: map.name }
    request.optionalMapPath = { oneofKind: 'mapPath', mapPath: map.mapPath }

    this._mapsService.editMap(request).then((map) => {
      this.map = map;
      this._notificationService.open(AlertComponent, {
        data: {
          message: 'Map update successful!',
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
