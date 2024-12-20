import { ChangeDetectionStrategy, Component, effect, input, model, output } from '@angular/core';
import { Dimension } from '../../../../protos/sro/gameserver/dimension';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MapService } from '../../../services/backend/map.service';
import { DimensionService } from '../../../services/backend/dimension.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dimension-form',
  imports: [
    RouterLink,
    ReactiveFormsModule,
  ],
  templateUrl: './dimension-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DimensionFormComponent {
  dimension = input.required<Dimension>();
  onSubmit = output<Dimension>();
  pendingSave = model(false);

  form: FormGroup;
  loading = {
    maps: true,
    dimension: true,
    form: true,
  };
  maps: any[] = [];


  constructor(
    protected _mapService: MapService,
    protected _dimensionService: DimensionService,
  ) {
    effect(() => {
      if (this.loading.form) {
        this.setupForm(this.dimension);
      }
    });
  }

  ngOnInit() {
    this._mapService.getMaps().then((maps) => {
      const formArray = this.form.get('maps') as FormArray;
      maps.forEach((map) => {
        const m = { ...map, selected: false }
        this.maps.push(m);
        formArray.push(new FormControl(m));
      });
      this.loading.maps = false;
      this.onLoadingFinished();
    });
  }

  setupForm(dimension: any) {
    this.form = new FormGroup({
      name: new FormControl(dimension().name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(64),
        Validators.pattern(/^[a-zA-Z0-9_]+$/),
      ]),
      location: new FormControl(dimension().location, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(64),
      ]),
      version: new FormControl(dimension().version, [
        Validators.required,
      ]),
      maps: new FormArray([]),
    });
    this.loading.dimension = false;
    this.onLoadingFinished();
  }

  onLoadingFinished() {
    if (this.loading.maps || this.loading.dimension || !this.loading.form) {
      return;
    }
    this.maps.forEach((map) => {
      map.selected = this.dimension()!.mapIds.includes(map.id);
      (this.form.get('maps') as FormArray).push(new FormControl(map));
    });
    this.loading.form = false;
  }

  onFormSubmit(form: FormGroup) {
    if (this.pendingSave()) {
      return;
    }

    const dimension = Dimension.create();
    dimension.name = form.get('name')?.value;
    dimension.location = form.get('location')?.value;
    dimension.version = form.get('version')?.value;
    dimension.mapIds = this.maps.filter(map => map.selected).map(map => map.id);
    this.onSubmit.emit(dimension);
  }

  isLoading() {
    return this.loading.maps || this.loading.dimension || this.loading.form;
  }

  toggleAll(event: any) {
    this.form.get('maps')?.value.forEach((map: any) => {
      map.selected = event.checked;
    })
  }

  isAllSelected() {
    return this.maps.every(map => map.selected);
  }

  mapSelectionChange(event: any, map: any) {
    this.form.get('maps')?.value.forEach((m: any) => {
      if (m.id === map.id) {
        m.selected = event.checked;
      }
    })
  }
}
