import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Map as GSMap } from '../../../../protos/sro/gameserver/map';
import { MapService } from '../../../services/backend/map.service';
import { MapsTableComponent } from '../../../components/maps/maps-table/maps-table.component';

@Component({
  selector: 'app-maps',
  imports: [
    RouterLink,
    RouterOutlet,
    MapsTableComponent,
  ],
  templateUrl: './maps.component.html',
})
export class AdminMapsComponent {
  maps: Map<string, GSMap> = new Map();

  constructor(
    private _mapsService: MapService,
  ) { }

  ngOnInit() {
    this._mapsService.getMaps().then((maps) => {
      this.maps = maps;
    });
  }
}
