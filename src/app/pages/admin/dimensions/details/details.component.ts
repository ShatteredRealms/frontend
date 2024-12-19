import { Component, Input } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DimensionService } from '../../../../services/backend/dimension.service';
import { Dimension } from '../../../../../protos/sro/gameserver/dimension';

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

  dimension: Dimension | undefined;

  constructor(
    protected _dimensionsService: DimensionService,
  ) { }

  ngOnInit() {
    this._dimensionsService.getDimension(this.id).then((dimension) => {
      this.dimension = dimension;
    });
  }
}
