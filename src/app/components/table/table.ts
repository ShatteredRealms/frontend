import { Component } from "@angular/core";

@Component({
  template: ''
})
export abstract class Table<T> {
  dataSource: T[] = [];
}
