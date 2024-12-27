import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, Input, input, ViewChild } from '@angular/core';
import { Map as GSMap } from '../../../../protos/sro/gameserver/map';
import { MapService } from '../../../services/backend/map.service';
import { CommonModule } from '@angular/common';
import { timeAge, timeStringFromSeconds } from '../../../helpers/time';
import { RouterLink } from '@angular/router';
import { TableDirective } from '../../table/table.directive';
import { TablePaginationComponent } from '../../table/table-pagination.component';
import { TableSortDirective } from '../../table/table-sort.directive';
import { TableSortHeaderDirective } from '../../table/table-sort-header.component';
import { defaultFilterFn, GlobalFilterService } from '../../../services/util/global-filter.service';
import { SelectableTable } from '../../table/selectable';
import { CheckboxDirective } from '../../checkbox/checkbox.directive';

@Component({
  selector: 'app-maps-table',
  imports: [
    CommonModule,
    RouterLink,
    TableDirective,
    TablePaginationComponent,
    TableSortDirective,
    TableSortHeaderDirective,
    CheckboxDirective,
  ],
  templateUrl: './maps-table.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class MapsTableComponent extends SelectableTable<GSMap> {
  @ViewChild('table') table!: TableDirective<GSMap>;

  @Input()
  actions = true;

  data = input.required<Map<string, GSMap>>();

  constructor(
    protected _mapService: MapService,
    protected _globalFilterService: GlobalFilterService,
    protected _cdr: ChangeDetectorRef,
  ) {
    super();
    effect(() => {
      if (!this.data()) {
        return;
      }

      this.dataSource = Array.from(this.data().values());
    })
  }

  ngOnInit() {
    this._globalFilterService.filter$.subscribe((searchTerm) => {
      this.table?.search(searchTerm);
    });
  }

  timeAge(unixTime: number): string {
    return timeAge(new Date(Number(unixTime) * 1000));
  }

  prettyTime(seconds: number) {
    return timeStringFromSeconds(Number(seconds), true, false);
  }

  filterFn(data: any, searchTerm: string): boolean {
    return defaultFilterFn(data, searchTerm);
  }
}
