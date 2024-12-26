import {
  Component,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TableSortDirective, SortDirection } from './table-sort.directive';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[appTableSortHeader]',
  templateUrl: './table-sort-header.component.html',
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class TableSortHeaderDirective {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('appTableSortHeader')
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = this._toCamelCase(value);
  }
  private _name: string;

  direction: SortDirection = 'none';

  get rotate(): string {
    if (this.direction === 'none' || this.direction === 'asc') {
      return 'rotate(0deg)';
    } else {
      return 'rotate(180deg)';
    }
  }

  get active(): boolean {
    return this.direction === 'asc' || this.direction === 'desc'
  }

  @HostBinding('style.cursor') cursor = 'pointer';

  @HostListener('click')
  onClick(): void {
    this.direction = this._getSortingDirection();

    this._sort.sort(this);
  }

  constructor(
    @Inject(forwardRef(() => TableSortDirective)) private _sort: TableSortDirective
  ) { }

  private _toCamelCase(str: string): string {
    return str
      .replace(/\s(.)/g, (a) => {
        return a.toUpperCase();
      })
      .replace(/\s/g, '')
      .replace(/^(.)/, (b) => {
        return b.toLowerCase();
      });
  }

  private _getSortingDirection(): SortDirection {
    if (this.direction === 'none') {
      return 'asc';
    }

    if (this.direction === 'asc') {
      return 'desc';
    }

    return 'none';
  }

  ngOnInit(): void {
    this._sort.addHeader(this.name, this);
  }

  ngOnDestroy(): void {
    this._sort.removeHeader(this.name);
  }

}
