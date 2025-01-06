import { CommonModule } from '@angular/common';
import { Component, effect, input, model, output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ChatService } from '../../../services/backend/chat.service';
import { DimensionService } from '../../../services/backend/dimension.service';
import { UserService } from '../../../services/backend/user.service';
import { Dimension } from '../../../../protos/sro/gameserver/dimension';
import { FormControlComponent } from "../../forms/form-control.component";
import { OptionComponent } from '../../option/option.component';
import { SelectComponent } from '../../select/select.component';
import { Character } from '../../../../protos/sro/character/character';
import { ChatChannel } from '../../../../protos/sro/chat/chat';



@Component({
  selector: 'app-chat-channel-form',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    FormControlComponent,
    OptionComponent,
    SelectComponent,
  ],
  templateUrl: './chat-channel-form.component.html',
})
export class ChatChannelFormComponent {
  chat = input<ChatChannel>(ChatChannel.create());
  onSubmit = output<ChatChannel>();
  pendingSave = model(false);

  form: FormGroup;
  loadingMaps = true;

  dimensions: Map<string, Dimension> = new Map();
  characters: Map<string, Character> = new Map();

  loading = {
    dimensions: true,
    characters: true,
  };

  get name(): AbstractControl<string> | null {
    return this.form.get('name');
  }

  get dimensionId(): AbstractControl<string> | null {
    return this.form.get('dimensionId');
  }

  constructor(
    protected _chatService: ChatService,
    protected _dimensionService: DimensionService,
    protected _userService: UserService,
  ) {
    effect(() => {
      this.form.get('name')?.setValue(this.chat().name);
      this.form.get('dimensionId')?.setValue(this.chat().dimensionId);
    });
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(this.chat().name, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(64),
        Validators.pattern(/^[ a-zA-Z0-9_-]+$/),
      ]),
      dimensionId: new FormControl('', [
      ]),
    });

    this._dimensionService.getDimensions().then((dimensions) => {
      this.dimensions = dimensions;
      this.loading.dimensions = false;
    });
  }

  onFormSubmit(form: FormGroup) {
    if (this.pendingSave()) {
      return;
    }

    const chat = ChatChannel.create();
    chat.name = form.value.name;
    chat.dimensionId = form.value.dimensionId;

    this.onSubmit.emit(chat);
  }

  isFormInvalid(fc: AbstractControl<string> | null): boolean {
    if (fc) {
      return fc.invalid && (fc.dirty || fc.touched);
    }

    return true;
  }
}
