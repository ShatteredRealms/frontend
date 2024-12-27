import { Component, Input } from '@angular/core';
import { MapService } from '../../../../services/backend/map.service';
import { ModalService } from '../../../../services/ui/modal.service';
import { NotificationService } from '../../../../services/ui/notification.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ModalComponent } from '../../../../components/modal/modal.component';
import { AlertComponent } from '../../../../components/alert/alert.component';
import { Map as GSMap } from '../../../../../protos/sro/gameserver/map';
import { UserService } from '../../../../services/backend/user.service';
import { Dimension } from '../../../../../protos/sro/gameserver/dimension';
import { DimensionService } from '../../../../services/backend/dimension.service';

@Component({
  selector: 'app-map-details',
  imports: [
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './details.component.html',
})
export class MapChannelComponent {
  @Input() id!: string;

  @Input() map: GSMap | undefined;
  dimension: Dimension | undefined;

  constructor(
    protected _mapsService: MapService,
    protected _userSerivce: UserService,
    protected _dimensionService: DimensionService,
    protected _modalService: ModalService,
    protected _notificationService: NotificationService,
    protected _router: Router,
    protected _route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (!this.map) {
      this._mapsService.getMap(this.id).then((map) => {
        this.map = map;
      });
    }
  }

  async deleteMap() {
    this._modalService.open(ModalComponent, {
      data: {
        title: 'Delete Map',
        message: 'Are you sure you want to delete this map?',
        submitText: 'Delete',
        isWarning: true,
      },
    }).onClose.subscribe((result: any) => {
      if (result) {
        this._mapsService.deleteMap(this.id).then(() => {
          this._router.navigate(['../'], { relativeTo: this._route }).finally(() => {
            this._notificationService.open(AlertComponent, {
              data: {
                message: 'The map has been deleted successfully.',
                type: 'success',
              },
            });
          });
        }).catch((error) => {
          this._notificationService.open(AlertComponent, {
            data: {
              message: `Failed to delete the map. ${error.code} + ${error.message}`,
              type: 'error',
            },
          });
        });
      }
    });
  }
}
