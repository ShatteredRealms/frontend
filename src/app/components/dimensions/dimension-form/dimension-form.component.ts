import { ChangeDetectionStrategy, Component, effect, input, model, output } from '@angular/core';
import { Dimension } from '../../../../protos/sro/gameserver/dimension';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MapService } from '../../../services/backend/map.service';
import { DimensionService } from '../../../services/backend/dimension.service';
import { RouterLink } from '@angular/router';
import { Map as GSMap } from '../../../../protos/sro/gameserver/map';
import { CommonModule } from '@angular/common';

type MapForm = GSMap & { selected: boolean };

@Component({
  selector: 'app-dimension-form',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './dimension-form.component.html',
})
export class DimensionFormComponent {
  dimension = input<Dimension>(Dimension.create());
  onSubmit = output<Dimension>();
  pendingSave = model(false);

  form: FormGroup;
  loadingMaps = true;

  get maps() {
    return this.form.get('maps') as FormArray;
  }
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

      this.maps.value.forEach((map: FormControl<MapForm>) => {
        map.value.selected = this.dimension().mapIds.includes(map.value.id);
      });
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
      maps: new FormArray([]),
    });

    this._mapService.getMaps().then((maps) => {
      maps.forEach((map) => {
        const m: MapForm = { ...map, selected: false }
        this.maps.value.push(new FormControl(m));
      });
      this.loadingMaps = false;
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
    dimension.mapIds = this.maps.value.filter((map: FormControl<MapForm>) => map.value.selected).map((map: FormControl<MapForm>) => map.value.id);
    this.onSubmit.emit(dimension);
  }

  toggleAll(event: any) {
    this.maps.value.forEach((map: FormControl<MapForm>) => {
      map.value.selected = event.checked;
    })
  }

  isAllSelected() {
    return this.maps.value.every((map: FormControl<MapForm>) => map.value.selected);
  }

  isSelected(index: number) {
    return this.maps.value[index].value.selected;
  }

  mapSelectionChange(event: any, index: number) {
    this.maps.value[index].value.selected = event.checked;
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
}
