import { Component, Input } from '@angular/core';
import { ChatService } from '../../../../services/backend/chat.service';
import { ModalService } from '../../../../services/ui/modal.service';
import { NotificationService } from '../../../../services/ui/notification.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ModalComponent } from '../../../../components/modal/modal.component';
import { AlertComponent } from '../../../../components/alert/alert.component';
import { ChatChannel } from '../../../../../protos/sro/chat/chat';
import { UserService } from '../../../../services/backend/user.service';
import { Dimension } from '../../../../../protos/sro/gameserver/dimension';
import { DimensionService } from '../../../../services/backend/dimension.service';
import { ChatChannelPublicBadgeComponent } from '../../../../components/chat-channels/chat-channel-public-badge/chat-channel-public-badge.component';

@Component({
  selector: 'app-chat-details',
  imports: [
    RouterOutlet,
    RouterLink,
    ChatChannelPublicBadgeComponent,
  ],
  templateUrl: './details.component.html',
})
export class ChatChannelComponent {
  @Input() id!: string;

  @Input() chat: ChatChannel | undefined;
  dimension: Dimension | undefined;

  constructor(
    protected _chatsService: ChatService,
    protected _userSerivce: UserService,
    protected _dimensionService: DimensionService,
    protected _modalService: ModalService,
    protected _notificationService: NotificationService,
    protected _router: Router,
    protected _route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (!this.chat) {
      this._chatsService.getChat(this.id).then((chat) => {
        this.chat = chat;
        if (chat.dimensionId) {
          this._dimensionService.getDimension(chat.dimensionId).then((dimension) => {
            this.dimension = dimension;
          }).catch((error) => {
            this._notificationService.open(AlertComponent, {
              data: {
                message: `Failed to load dimension. ${error.code} + ${error.message}`,
                type: 'error',
              },
            });
          });
        }
      });
    }
  }

  async deleteChat() {
    this._modalService.open(ModalComponent, {
      data: {
        title: 'Delete Chat',
        message: 'Are you sure you want to delete this chat?',
        submitText: 'Delete',
        isWarning: true,
      },
    }).onClose.subscribe((result: any) => {
      if (result) {
        this._chatsService.deleteChat(this.id).then(() => {
          this._router.navigate(['../'], { relativeTo: this._route }).finally(() => {
            this._notificationService.open(AlertComponent, {
              data: {
                message: 'The chat has been deleted successfully.',
                type: 'success',
              },
            });
          });
        }).catch((error) => {
          this._notificationService.open(AlertComponent, {
            data: {
              message: `Failed to delete the chat. ${error.code} + ${error.message}`,
              type: 'error',
            },
          });
        });
      }
    });
  }
}
