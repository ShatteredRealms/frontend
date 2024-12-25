import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, HostListener, Inject, InjectionToken, Input, Optional, Output } from '@angular/core';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Observable, Subject } from 'rxjs';

export interface OptionParent {
  optionHeight: number;
  multiple: boolean;
  visibleOptions: number;
}

export interface OptionGroup {
  disabled?: boolean;
}

export const OPTION_PARENT = new InjectionToken<OptionParent>('OPTION_PARENT');
export const OPTION_GROUP = new InjectionToken<OptionGroup>('OPTION_GROUP');

@Component({
  selector: 'app-option',
  imports: [],
  templateUrl: './option.component.html',
})
export class OptionComponent {
  @Input() value: any;

  hidden = false;

  @Input()
  get label(): string {
    return this._label || this._el.nativeElement.textContent;
  }
  set label(newValue: string) {
    this._label = newValue;
  }
  private _label: string;

  get labelFilter(): string {
    return this._label.toLowerCase() + this._el.nativeElement.textContent.toLowerCase();
  }

  @HostBinding('class.hidden')
  get isHidden(): boolean {
    return this.hidden;
  }

  @HostBinding('class.disabled')
  @Input()
  get disabled(): boolean {
    return this._disabled || this.group?.disabled!;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
  }
  private _disabled = false;

  @Output() readonly selectionChange = new EventEmitter<OptionComponent>();

  _optionHeight: number;

  private _selected = false;
  private _active = false;
  private _previousLabelValue = '';
  _multiple = false;

  clicked = false;

  readonly _labelChange = new Subject<void>();
  clickSource: Subject<OptionComponent> = new Subject<OptionComponent>();
  click$: Observable<OptionComponent> = this.clickSource.asObservable();

  constructor(
    private _el: ElementRef,
    private _cdRef: ChangeDetectorRef,
    @Optional() @Inject(OPTION_PARENT) public _parent: OptionParent,
    @Optional() @Inject(OPTION_GROUP) public group: OptionGroup
  ) {
    this.clicked = false;
  }

  @HostBinding('class.option')
  option = true;

  @HostBinding('class.active')
  get active(): boolean {
    return this._active;
  }

  @HostBinding('class.selected')
  get selected(): boolean {
    return this._selected;
  }

  @HostBinding('style.height.px')
  get optionHeight(): number {
    return this._optionHeight;
  }

  @HostBinding('attr.role')
  get role(): string {
    return 'option';
  }

  @HostBinding('attr.aria-disabled')
  get isDisabled(): boolean {
    return this.disabled ? true : false;
  }

  @HostBinding('attr.aria-selected')
  get isSelected(): boolean {
    return this.selected;
  }

  @HostListener('click')
  onClick(): void {
    this.clickSource.next(this);
  }

  getLabel(): string {
    return this._el.nativeElement.textContent;
  }

  get offsetHeight(): number {
    return this._el.nativeElement.offsetHeight;
  }

  ngOnInit(): void {
    if (this._parent && this._parent.optionHeight) {
      this._optionHeight = this._parent.optionHeight;
    }

    if (this._parent && this._parent.multiple) {
      this._multiple = true;
    }
  }

  ngAfterViewChecked(): void {
    // We need to let parent component know about dynamic label changes, so it can trigger
    // change detection and update value displayed in input. We only need to do that for
    // selected options, because other options will be hidden inside the dropdown, and their
    // labels will be updated automatically when dropdown is opened.
    if (this._selected) {
      const label = this.getLabel();

      if (label !== this._previousLabelValue) {
        this._previousLabelValue = label;
        this._labelChange.next();
      }
    }
  }

  ngOnDestroy(): void {
    this._labelChange.complete();
  }

  select(): void {
    if (!this._selected) {
      this._selected = this._multiple ? !this._selected : true;
      this.selectionChange.emit(this);
      this._cdRef.markForCheck();
    }
  }

  deselect(): void {
    if (this._selected) {
      this._selected = false;
      this.selectionChange.emit(this);
      this._cdRef.markForCheck();
    }
  }

  setActiveStyles(): void {
    if (!this._active) {
      this._active = true;
      this._cdRef.markForCheck();
    }
  }

  setInactiveStyles(): void {
    if (this._active) {
      this._active = false;
      this._cdRef.markForCheck();
    }
  }

  static ngAcceptInputType_disabled: BooleanInput;
}
