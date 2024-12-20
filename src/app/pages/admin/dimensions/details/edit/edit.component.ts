import { Component, inject } from '@angular/core';
import { Dimension, EditDimensionRequest } from '../../../../../../protos/sro/gameserver/dimension';
import { DimensionService } from '../../../../../services/backend/dimension.service';
import { ActivatedRoute, Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { MapService } from '../../../../../services/backend/map.service';
import { NotificationService } from '../../../../../services/ui/notification.service';
import { AlertComponent } from '../../../../../components/alert/alert.component';
import { DimensionFormComponent } from '../../../../../components/dimensions/dimension-form/dimension-form.component';

@Component({
  selector: 'app-edit-dimension',
  imports: [
    DimensionFormComponent,
  ],
  templateUrl: './edit.component.html',
})
export class EditDimensionComponent {
  dimension: Dimension = inject<Dimension>(ROUTER_OUTLET_DATA);
  id: string;

  pendingSave = false;

  constructor(
    protected _dimensionsService: DimensionService,
    protected _mapService: MapService,
    protected _notificationService: NotificationService,
    protected _route: ActivatedRoute,
    protected _router: Router,
  ) {
    this.id = this._route.parent?.snapshot.params['id'] as string;
    if (this.id === undefined) {
      throw new Error('Dimension ID is required');
    }
  }

  ngOnInit() {
    this._dimensionsService.getDimension(this.id).then((dimension) => {
      this.dimension = dimension;
    });
  }

  onSubmit(dimension: Dimension) {
    if (this.pendingSave) {
      return;
    }

    this.pendingSave = true;
    const request = EditDimensionRequest.create();
    request.targetId = this.id;
    request.optionalName = { oneofKind: 'name', name: dimension.name }
    request.optionalLocation = { oneofKind: 'location', location: dimension.location }
    request.optionalVersion = { oneofKind: 'version', version: dimension.version }
    request.mapIds = dimension.mapIds
    request.editMaps = true;

    this._dimensionsService.editDimension(request).then((dimension) => {
      this.dimension = dimension;
      this._notificationService.open(AlertComponent, {
        data: {
          message: 'Dimension update successful!',
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
