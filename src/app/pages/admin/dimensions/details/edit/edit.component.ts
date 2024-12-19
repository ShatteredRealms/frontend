import { Component } from '@angular/core';
import { Dimension } from '../../../../../../protos/sro/gameserver/dimension';
import { DimensionService } from '../../../../../services/backend/dimension.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MapService } from '../../../../../services/backend/map.service';

@Component({
  selector: 'app-edit-dimension',
  imports: [
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './edit.component.html',
})
export class EditDimensionComponent {
  dimension: Dimension | undefined;
  id: string;

  dimensionForm: FormGroup;

  maps: any[] = [];

  constructor(
    protected _dimensionsService: DimensionService,
    protected _mapService: MapService,
    protected _route: ActivatedRoute,
  ) {
    this.id = this._route.parent?.snapshot.params['id'] as string;
    if (this.id === undefined) {
      throw new Error('Dimension ID is required');
    }
  }

  ngOnInit() {
    this._dimensionsService.getDimension(this.id).then((dimension) => {
      this.dimension = dimension;
      console.log('dimension', dimension);
      this.dimensionForm = new FormGroup({
        name: new FormControl(dimension.name, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(64),
          Validators.pattern(/^[a-zA-Z0-9_]+$/),
        ]),
        location: new FormControl(dimension.location, [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(64),
        ]),
        version: new FormControl(dimension.version, [
          Validators.required,
        ]),
        maps: new FormArray([]),
      });
      this._loadMaps();
    });
  }

  private _loadMaps() {
    this._mapService.getMaps().then((maps) => {
      const formArray = this.dimensionForm.get('maps') as FormArray;
      maps.forEach((map) => {
        const m = { ...map, selected: this.dimension!.mapIds.includes(map.id) }
        this.maps.push(m);
        formArray.push(new FormControl(m));
      });
    });

  }

  onSubmit(form: FormGroup) {
    console.log('submit', form.value.maps[0].selected);
  }

  toggleAll(event: any) {
    this.maps.forEach(map => map.selected = event.target.checked);
    this.dimensionForm.get('maps')?.setValue(this.maps);
  }

  isAllSelected() {
    return this.maps.every(map => map.selected);
  }

  mapSelectionChange(event: any, map: any) {
    map.selected = event.target.checked;
    this.dimensionForm.get('maps')?.setValue(this.maps);
  }
}
