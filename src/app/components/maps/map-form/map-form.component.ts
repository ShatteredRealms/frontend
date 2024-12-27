import { CommonModule } from '@angular/common';
import { Component, effect, input, model, output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Map as GSMap } from '../../../../protos/sro/gameserver/map';



@Component({
  selector: 'app-map-form',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './map-form.component.html',
})
export class MapFormComponent {
  map = input<GSMap>(GSMap.create());
  onSubmit = output<GSMap>();
  pendingSave = model(false);

  form: FormGroup;
  loadingMaps = true;

  get name(): AbstractControl<string> | null {
    return this.form.get('name');
  }

  get mapPath(): AbstractControl<string> | null {
    return this.form.get('mapPath');
  }

  constructor(
  ) {
    effect(() => {
      this.form.get('name')?.setValue(this.map().name);
      this.form.get('mapPath')?.setValue(this.map().mapPath);
    });
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(this.map().name, [
        Validators.required,
      ]),
      mapPath: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  onFormSubmit(form: FormGroup) {
    if (this.pendingSave()) {
      return;
    }

    const map = GSMap.create();
    map.name = form.value.name;
    map.mapPath = form.value.mapPath;

    this.onSubmit.emit(map);
  }

  isFormInvalid(fc: AbstractControl<string> | null): boolean {
    if (fc) {
      return fc.invalid && (fc.dirty || fc.touched);
    }

    return true;
  }
}
