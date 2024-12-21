import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { DimensionService } from '../../../../services/backend/dimension.service';
import { Dimension } from '../../../../../protos/sro/gameserver/dimension';
import { ModalService } from '../../../../services/ui/modal.service';
import { ModalComponent } from '../../../../components/modal/modal.component';
import { NotificationService } from '../../../../services/ui/notification.service';
import { AlertComponent } from '../../../../components/alert/alert.component';

@Component({
  selector: 'app-dimension-details',
  imports: [
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './details.component.html',
})
export class DimensionDetailsComponent {
  @Input() id!: string;

  @Input() dimension: Dimension | undefined;

  constructor(
    protected _dimensionsService: DimensionService,
    protected _modalService: ModalService,
    protected _notificationService: NotificationService,
    protected _router: Router,
    protected _route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (!this.dimension) {
      this._dimensionsService.getDimension(this.id).then((dimension) => {
        this.dimension = dimension;
      });
    }
  }

  async deleteDimension() {
    this._modalService.open(ModalComponent, {
      data: {
        title: 'Delete Dimension',
        message: 'Are you sure you want to delete this dimension?',
        submitText: 'Delete',
        isWarning: true,
      },
    }).onClose.subscribe((result: any) => {
      if (result) {
        this._dimensionsService.deleteDimension(this.id).then(() => {
          this._router.navigate(['../'], { relativeTo: this._route }).finally(() => {
            this._notificationService.open(AlertComponent, {
              data: {
                message: 'The dimension has been deleted successfully.',
                type: 'success',
              },
            });
          });
        }).catch((error) => {
          this._notificationService.open(AlertComponent, {
            data: {
              message: `Failed to delete the dimension. ${error.code} + ${error.message}`,
              type: 'error',
            },
          });
        });
      }
    });
  }
}
