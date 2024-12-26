import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalFilterService {
  private readonly _filter$ = new BehaviorSubject<string>('');
  readonly filter$ = this._filter$.asObservable();

  constructor() { }

  setFilter(value: string): void {
    this._filter$.next(value);
  }


}

export function defaultFilterFn(data: any, searchTerm: string): boolean {
  let [phrase, columns] = searchTerm.split(' in:').map((str) => str.trim());
  return Object.keys(data).some((key: any) => {
    if (columns?.length) {
      let result;
      columns.split(',').forEach((column) => {
        if (
          column.toLowerCase().trim() === key.toLowerCase() &&
          data[key].toLowerCase().includes(phrase.toLowerCase())
        ) {
          result = true;
        }
      });
      return result;
    }
    if (data[key] && !columns?.length) {
      return JSON.stringify(data).toLowerCase().includes(phrase.toLowerCase());
    }
    return false;
  });
}
