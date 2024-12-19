import { Component, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DimensionService } from '../../../services/backend/dimension.service';
import { Dimension } from '../../../../protos/sro/gameserver/dimension';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dimensions',
  imports: [
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './dimensions.component.html',
})
export class AdminDimensionsComponent {
  dimensions: Map<string, Dimension> = new Map<string, Dimension>();
  constructor(
    private _dimensionsService: DimensionService,
  ) { }

  ngOnInit() {
    this._dimensionsService.getDimensions().then((dimensions) => {
      this.dimensions = dimensions;
    });
  }
}
