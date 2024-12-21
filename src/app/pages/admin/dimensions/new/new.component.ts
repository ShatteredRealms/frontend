import { Component } from '@angular/core';
import { DimensionService } from '../../../../services/backend/dimension.service';
import { MapService } from '../../../../services/backend/map.service';
import { NotificationService } from '../../../../services/ui/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Dimension } from '../../../../../protos/sro/gameserver/dimension';
import { AlertComponent } from '../../../../components/alert/alert.component';
import { DimensionFormComponent } from '../../../../components/dimensions/dimension-form/dimension-form.component';

@Component({
  selector: 'app-new-dimension',
  imports: [
    DimensionFormComponent,
  ],
  templateUrl: './new.component.html',
})
export class NewDimensionComponent {
  pendingSave = false;

  constructor(
    protected _dimensionsService: DimensionService,
    protected _mapService: MapService,
    protected _notificationService: NotificationService,
    protected _route: ActivatedRoute,
    protected _router: Router,
  ) {
  }

  onSubmit(dimension: Dimension) {
    if (this.pendingSave) {
      return;
    }

    this.pendingSave = true;
    this._dimensionsService.createDimension(dimension).then((dimension) => {
      this._notificationService.open(AlertComponent, {
        data: {
          message: `Dimension ${dimension.name} (${dimension.id}) created!`,
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
