import { Component, OnInit, ElementRef, ChangeDetectorRef, Optional, Inject } from '@angular/core';
import { OPTION_GROUP, OPTION_PARENT, OptionComponent, OptionGroup, OptionParent } from '../option/option.component';

@Component({
  selector: 'app-select-all-option',
  template: `
    <span class="select-option-text" ngClass="{'active', active}">
      @if (_multiple) {
      <input
        class="form-check-input"
        type="checkbox"
        [checked]="selected"
        [disabled]="disabled"
      />
      }
      <ng-content></ng-content>
    </span>
    <ng-content select=".select-option-icon-container"></ng-content>
  `,
})
export class SelectAllOptionComponent extends OptionComponent implements OnInit {
  _multiple = true;
  _optionHeight: number = 100;

  constructor(
    _el: ElementRef,
    _cdRef: ChangeDetectorRef,
    @Optional() @Inject(OPTION_PARENT) _parent: OptionParent,
    @Optional() @Inject(OPTION_GROUP) group: OptionGroup
  ) {
    super(_el, _cdRef, _parent, group);
  }

  ngOnInit(): void {
    if (this._parent && this._parent.visibleOptions && this._parent.optionHeight) {
      this._optionHeight = this._parent.optionHeight;
    }
  }
}
