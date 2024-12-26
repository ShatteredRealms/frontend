import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, Input, input, ViewChild } from '@angular/core';
import { ChatChannel } from '../../../../protos/sro/chat/chat';
import { ChatService } from '../../../services/backend/chat.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DimensionService } from '../../../services/backend/dimension.service';
import { NotificationService } from '../../../services/ui/notification.service';
import { AlertComponent } from '../../alert/alert.component';
import { Dimension } from '../../../../protos/sro/gameserver/dimension';
import { TableDirective } from '../../table/table.directive';
import { TablePaginationComponent } from '../../table/table-pagination.component';
import { TableSortDirective } from '../../table/table-sort.directive';
import { TableSortHeaderDirective } from '../../table/table-sort-header.component';
import { defaultFilterFn, GlobalFilterService } from '../../../services/util/global-filter.service';


@Component({
  selector: 'app-chat-channels-table',
  imports: [
    CommonModule,
    RouterLink,
    TableDirective,
    TablePaginationComponent,
    TableSortDirective,
    TableSortHeaderDirective,
  ],
  templateUrl: './chat-channels-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatChannelsTableComponent {
  @ViewChild('table') table!: TableDirective<ChatChannel>;

  @Input()
  actions = true;

  data = input.required<Map<string, ChatChannel>>();
  datasource: ChatChannel[] = [];
  dimensions = new Map<string, Dimension>();
  userGroups = new Map<string, string[]>();
  getUserErrors: string[] = [];

  constructor(
    protected _chatService: ChatService,
    protected _dimensionService: DimensionService,
    protected _notificationService: NotificationService,
    protected _globalFilterService: GlobalFilterService,
    protected _cdr: ChangeDetectorRef,
  ) {
    effect(() => {
      this.datasource = Array.from(this.data().values());
      this._dimensionService.getDimensions().then((dimensions) => {
        this.dimensions = dimensions;
        console.log('Dimensions:', dimensions);
        this._cdr.markForCheck();
      }).catch((err) => {
        this._notificationService.open(AlertComponent, {
          data: {
            message: `Failed to load dimensions: ${err.code} ${err.message}`,
            type: 'error',
          },
        });
      });
    })
  }

  ngOnInit() {
    this._globalFilterService.filter$.subscribe((searchTerm) => {
      this.table.search(searchTerm);
    });
  }

  filterFn(data: any, searchTerm: string): boolean {
    return defaultFilterFn(data, searchTerm);
  }
}
