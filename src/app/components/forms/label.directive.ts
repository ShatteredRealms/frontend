import { Directive } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[appLabel]',
  exportAs: 'appLabel',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class LabelDirective {
  constructor() { }
}
