import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CheckboxChange } from "../checkbox/checkbox.directive";
import { Table } from "./table";

@Component({
  template: ''
})
export abstract class SelectableTable<T> extends Table<T> {
  @Input() selectable = false;
  @Input()
  get startingSelections(): Set<T> {
    return this._startingSelections;
  }
  set startingSelections(value: Set<T>) {
    this._startingSelections = value;
    if (value) {
      for (const row of value) {
        this.select(row);
      }
    }
  }

  private _startingSelections: Set<T> = new Set();
  selections: Set<T> = new Set();

  @Output() selectionChange: EventEmitter<Set<T>> = new EventEmitter();

  allRowsSelected(): boolean {
    const selectionsLength = this.selections.size;
    const dataLength = this.dataSource.length;
    return selectionsLength === dataLength;
  }

  someRowsSelected(): boolean {
    return this.selections.size > 0 && !this.allRowsSelected();
  }

  toggleSelection(event: CheckboxChange, value: T): void {
    if (event.checked) {
      this.select(value);
    } else {
      this.deselect(value);
    }
  }

  toggleAll(event: CheckboxChange): void {
    if (event.checked) {
      this.dataSource.forEach((row: T) => {
        this.select(row);
      });
    } else {
      this.dataSource.forEach((row: T) => {
        this.deselect(row);
      });
    }
  }

  select(value: T): void {
    if (!this.selections.has(value)) {
      this.selections.add(value);
      this.selectionChange.emit(this.selections);
    }
  }

  deselect(value: T): void {
    if (this.selections.has(value)) {
      this.selections.delete(value);
      this.selectionChange.emit(this.selections);
    }
  }
}
