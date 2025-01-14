import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { OptionComponent } from '../option/option.component';
import { SelectComponent } from '../select/select.component';
import { FormControlComponent } from '../forms/form-control.component';

export interface PaginationChange {
  page: number;
  entries: number;
  total: number;
}

@Component({
  selector: 'app-table-pagination',
  templateUrl: './table-pagination.component.html',
  exportAs: 'appPagination',
  imports: [
    CommonModule,
    OptionComponent,
    SelectComponent,
    FormControlComponent,
  ],
})
export class TablePaginationComponent implements OnInit {
  @Input()
  set entries(value: number) {
    this._entries = value;

    if (this._isInitialized) {
      this._updateEntriesOptions();
    }
  }
  get entries(): number {
    return this._entries;
  }
  @Input()
  set prevButtonDisabled(value: boolean) {
    this._prevButtonDisabled = coerceBooleanProperty(value);
  }
  get prevButtonDisabled(): boolean {
    return this._prevButtonDisabled;
  }
  @Input()
  set nextButtonDisabled(value: boolean) {
    this._nextButtonDisabled = coerceBooleanProperty(value);
  }
  get nextButtonDisabled(): boolean {
    return this._nextButtonDisabled;
  }
  @Input()
  set entriesOptions(value: number[]) {
    this._entriesOptions = value;

    if (this._isInitialized) {
      this._updateEntriesOptions();
    }
  }
  get entriesOptions(): number[] {
    return this._entriesOptions;
  }
  @Input()
  set total(value: number) {
    this._total = value;
  }
  get total(): number {
    return this._total;
  }

  @Input() rowsPerPageText = 'Rows per page';
  @Input() ofText = 'of';

  set page(value: number) {
    this._page = value;
  }
  get page(): number {
    return this._page;
  }

  private _entries = 10;
  private _prevButtonDisabled = false;
  private _nextButtonDisabled = false;
  private _entriesOptions = [10, 25, 50, 200];
  private _total = 0;
  private _page = 0;

  private _isInitialized = false;

  public firstVisibleItem = 1;
  public lastVisibleItem = 0;
  public activePageNumber = 1;

  @Output() paginationChange = new EventEmitter<PaginationChange>();

  constructor() { }

  ngOnInit(): void {
    this._isInitialized = true;
    this._updateEntriesOptions();
  }

  getPaginationRangeText(): string {
    const startIndex = this.page * this.entries;
    const endIndex = Math.min(startIndex + this.entries, this.total);

    return `${this._total ? startIndex + 1 : 0} – ${endIndex} ${this.ofText} ${this.total}`;
  }

  getPaginationRangeStart(): number {
    return this._total ? this.page * this.entries + 1 : 0;
  }

  getPaginationRangeEnd(): number {
    return Math.min(this.page * this.entries + this.entries, this.total)
  }

  isPreviousPageDisabled(): boolean {
    return this.page === 0;
  }

  isNextPageDisabled(): boolean {
    const allPages = this.getNumberOfPages();

    return this.page === allPages - 1 || allPages === 0;
  }

  getNumberOfPages(): number {
    return Math.ceil(this.total / this.entries);
  }

  getPageNumbers(): number[] {
    const allPages = this.getNumberOfPages();
    const pageNumbers = [];

    for (let i = 0; i < allPages; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  }

  nextPage(): void {
    if (this.isNextPageDisabled()) {
      return;
    }

    this.page++;
    this._emitPaginationChange();
  }

  previousPage(): void {
    if (this.isPreviousPageDisabled()) {
      return;
    }

    this.page--;
    this._emitPaginationChange();
  }

  updatePage(page: number): void {
    this.page = page;
    this._emitPaginationChange();
  }

  updateRowPerPageNumber(entries: any): void {
    const startIndex = this.page * this.entries;
    this.entries = entries;
    this.page = Math.floor(startIndex / entries) || 0;

    this._emitPaginationChange();
  }

  private _emitPaginationChange(): void {
    this.paginationChange.emit({
      page: this.page,
      entries: this.entries,
      total: this.total,
    });
  }

  private _updateEntriesOptions(): void {
    const entriesDefault = 10;
    const hasEntriesOptions = this.entriesOptions.length !== 0;
    const firstOption = hasEntriesOptions && this.entriesOptions[0];

    if (!this.entries) {
      this.entries = firstOption ? firstOption : entriesDefault;
    }

    if (!this.entriesOptions.includes(this.entries)) {
      this.entriesOptions.push(this.entries);
      this.entriesOptions.sort((a, b) => a - b);
    }
  }

  static ngAcceptInputType_prevButtonDisabled: BooleanInput;
  static ngAcceptInputType_nextButtonDisabled: BooleanInput;
}
