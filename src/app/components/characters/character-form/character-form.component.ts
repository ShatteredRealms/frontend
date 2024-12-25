import { CommonModule } from '@angular/common';
import { Component, effect, input, model, output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CharacterDetails } from '../../../../protos/sro/character/character';
import { CharacterService } from '../../../services/backend/character.service';
import { DimensionService } from '../../../services/backend/dimension.service';
import { UserService } from '../../../services/backend/user.service';
import { Dimension } from '../../../../protos/sro/gameserver/dimension';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { FormControlComponent } from "../../forms/form-control.component";
import { OptionComponent } from '../../option/option.component';
import { SelectComponent } from '../../select/select.component';



@Component({
  selector: 'app-character-form',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    FormControlComponent,
    OptionComponent,
    SelectComponent,
  ],
  templateUrl: './character-form.component.html',
})
export class CharacterFormComponent {
  character = input<CharacterDetails>(CharacterDetails.create());
  onSubmit = output<CharacterDetails>();
  pendingSave = model(false);

  form: FormGroup;
  loadingMaps = true;

  dimensions: Map<string, Dimension> = new Map();
  users: Map<string, UserRepresentation> = new Map();
  genders = [
    {
      label: "Male",
      value: "male",
    },
    {
      label: "Female",
      value: "female",
    },
  ];
  realms = [
    {
      label: "Human",
      value: "human",
    },
    {
      label: "Cyborg",
      value: "cyborg",
    },
  ];

  loading = {
    dimensions: true,
    users: true,
  };

  get name(): AbstractControl<string> | null {
    return this.form.get('name');
  }

  get gender(): AbstractControl<string> | null {
    return this.form.get('gender');
  }

  get realm(): AbstractControl<string> | null {
    return this.form.get('realm');
  }

  get dimensionId(): AbstractControl<string> | null {
    return this.form.get('dimensionId');
  }

  get ownerId(): AbstractControl<string> | null {
    return this.form.get('ownerId');
  }

  constructor(
    protected _characterService: CharacterService,
    protected _dimensionService: DimensionService,
    protected _userService: UserService,
  ) {
    effect(() => {
      this.form.get('name')?.setValue(this.character().name);
      this.form.get('gender')?.setValue(this.character().gender);
      this.form.get('realm')?.setValue(this.character().realm);
      this.form.get('dimensionId')?.setValue(this.character().dimensionId);
      this.form.get('ownerId')?.setValue(this.character().ownerId);
    });
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(this.character().name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(64),
        Validators.pattern(/^[ a-zA-Z0-9_-]+$/),
      ]),
      gender: new FormControl('', [
        Validators.required,
      ]),
      realm: new FormControl('', [
        Validators.required,
      ]),
      dimensionId: new FormControl('', [
        Validators.required,
      ]),
      ownerId: new FormControl('', [
        Validators.required,
      ]),
    });

    this._dimensionService.getDimensions().then((dimensions) => {
      this.dimensions = dimensions;
      this.loading.dimensions = false;
    });
    this._userService.getUsers().then((users) => {
      this.users = users;
      this.loading.users = false;
    });
  }

  onFormSubmit(form: FormGroup) {
    if (this.pendingSave()) {
      return;
    }

    const character = CharacterDetails.create();
    character.name = form.value.name;
    character.ownerId = form.value.ownerId;
    character.dimensionId = form.value.dimensionId;
    character.realm = form.value.realm;
    character.gender = form.value.gender;

    console.log(character);

    this.onSubmit.emit(character);
  }

  isFormInvalid(fc: AbstractControl<string> | null): boolean {
    if (fc) {
      return fc.invalid && (fc.dirty || fc.touched);
    }

    return true;
  }
}
