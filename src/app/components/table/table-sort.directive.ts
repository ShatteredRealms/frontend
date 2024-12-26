import { Directive, EventEmitter, Output } from '@angular/core';
import { TableSortHeaderDirective } from './table-sort-header.component';

export type SortDirection = 'asc' | 'desc' | 'none';

export interface SortChange {
  name: string;
  direction: SortDirection;
}

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[appTableSort]',
  exportAs: 'appTableSort',
})
export class TableSortDirective {
  headers = new Map<string, TableSortHeaderDirective>();

  active: TableSortHeaderDirective;

  @Output() sortChange: EventEmitter<SortChange> = new EventEmitter<SortChange>();

  sort(header: TableSortHeaderDirective): void {
    this.active = header;

    this.headers.forEach((sortHeader) => {
      if (sortHeader.name !== header.name) {
        sortHeader.direction = 'none';
      }
    });

    this.sortChange.emit({ name: header.name, direction: header.direction });
  }

  addHeader(name: string, header: TableSortHeaderDirective): void {
    this.headers.set(name, header);
  }

  removeHeader(name: string): void {
    this.headers.delete(name);
  }
}
