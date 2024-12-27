import { Component, effect, input, model, output } from '@angular/core';
import { Dimension } from '../../../../protos/sro/gameserver/dimension';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MapService } from '../../../services/backend/map.service';
import { DimensionService } from '../../../services/backend/dimension.service';
import { RouterLink } from '@angular/router';
import { Map as GSMap } from '../../../../protos/sro/gameserver/map';
import { CommonModule } from '@angular/common';
import { MapsTableComponent } from '../../maps/maps-table/maps-table.component';

@Component({
  selector: 'app-dimension-form',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    MapsTableComponent,
  ],
  templateUrl: './dimension-form.component.html',
})
export class DimensionFormComponent {
  dimension = input<Dimension>(Dimension.create());
  onSubmit = output<Dimension>();
  pendingSave = model(false);

  form: FormGroup;
  loadingMaps = true;
  maps: Map<string, GSMap>;
  selectedMaps: Set<GSMap> = new Set();
  startingMaps: Set<GSMap>;

  get name(): AbstractControl<string> | null {
    return this.form.get('name');
  }
  get location(): AbstractControl<string> | null {
    return this.form.get('location');
  }
  get version(): AbstractControl<string> | null {
    return this.form.get('version');
  }

  constructor(
    protected _mapService: MapService,
    protected _dimensionService: DimensionService,
  ) {
    effect(() => {
      this.form.get('name')?.setValue(this.dimension().name);
      this.form.get('location')?.setValue(this.dimension().location);
      this.form.get('version')?.setValue(this.dimension().version);

      if (!this.dimension().id) {
        return;
      }

      if (this.maps) {
        this._setupStartingMaps();
      }
    });
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(this.dimension().name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(64),
        Validators.pattern(/^[ a-zA-Z0-9_-]+$/),
      ]),
      location: new FormControl(this.dimension().location, [
        Validators.required,
      ]),
      version: new FormControl(this.dimension().version, [
        Validators.required,
      ]),
    });

    this._mapService.getMaps().then((maps) => {
      this.maps = maps;
      this.loadingMaps = false;

      if (this.dimension().mapIds) {
        this._setupStartingMaps();
      }
    });
  }

  private _setupStartingMaps() {
    if (!this.maps) {
      return;
    }

    if (!this.dimension().mapIds) {
      return;
    }

    if (this.startingMaps) {
      return;
    }

    this.startingMaps = new Set();
    this.maps.forEach((map) => {
      if (this.dimension().mapIds.includes(map.id)) {
        this.startingMaps.add(map);
      }
    });
  }

  onFormSubmit(form: FormGroup) {
    if (this.pendingSave()) {
      return;
    }

    const dimension = Dimension.create();
    dimension.name = form.get('name')?.value;
    dimension.location = form.get('location')?.value;
    dimension.version = form.get('version')?.value;
    dimension.mapIds = [...this.selectedMaps].map((map) => map.id);
    this.onSubmit.emit(dimension);
  }

  isNameInvalid() {
    if (this.name) {
      return this.name.invalid && (this.name.dirty || this.name.touched);
    }
    return false;
  }

  isLocationInvalid() {
    if (this.location) {
      return this.location.invalid && (this.location.dirty || this.location.touched);
    }
    return false;
  }

  isVersionInvalid() {
    if (this.version) {
      return this.version.invalid && (this.version.dirty || this.version.touched);
    }

    return false;
  }

  selectedMapsChanged(maps: Set<GSMap>) {
    this.selectedMaps = maps;
  }
}
