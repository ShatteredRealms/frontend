import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, Input, input } from '@angular/core';
import { ChatChannel } from '../../../../protos/sro/chat/chat';
import { ChatService } from '../../../services/backend/chat.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DimensionService } from '../../../services/backend/dimension.service';
import { NotificationService } from '../../../services/ui/notification.service';
import { AlertComponent } from '../../alert/alert.component';
import { Dimension } from '../../../../protos/sro/gameserver/dimension';


@Component({
  selector: 'app-chat-channels-table',
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './chat-channels-table.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatChannelsTableComponent {
  @Input()
  actions = true;

  data = input.required<Map<string, ChatChannel>>();
  dimensions = new Map<string, Dimension>();
  userGroups = new Map<string, string[]>();
  getUserErrors: string[] = [];

  constructor(
    protected _chatService: ChatService,
    protected _dimensionService: DimensionService,
    protected _notificationService: NotificationService,
    protected _cdr: ChangeDetectorRef,
  ) {
    effect(() => {
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

  getChats(): ChatChannel[] {
    return this.data ? Array.from(this.data().values()) : [];
  }
}
