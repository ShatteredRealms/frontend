import { ChangeDetectionStrategy, Component, HostBinding, Inject, Input, Optional } from "@angular/core";
import { OPTION_GROUP, OPTION_PARENT, OptionParent } from "./option.component";

@Component({
  selector: 'app-option-group',
  templateUrl: './option-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: OPTION_GROUP,
      useExisting: OptionGroupComponent,
    },
  ],
})
export class OptionGroupComponent {
  @HostBinding('class.option-group')
  optionGroup = true;
  _optionHeight = 48;

  @Input() label: string;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = value;
  }
  private _disabled = false;

  constructor(@Optional() @Inject(OPTION_PARENT) private _parent: OptionParent) { }

  ngOnInit(): void {
    if (this._parent && this._parent.visibleOptions && this._parent.optionHeight) {
      this._optionHeight = this._parent.optionHeight;
    }
  }
}
