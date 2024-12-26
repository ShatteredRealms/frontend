import { Component } from '@angular/core';
import { ChatService } from '../../../../services/backend/chat.service';
import { NotificationService } from '../../../../services/ui/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertComponent } from '../../../../components/alert/alert.component';
import { ChatChannel } from '../../../../../protos/sro/chat/chat';
import { ChatChannelFormComponent } from '../../../../components/chat-channels/chat-channel-form/chat-channel-form.component';

@Component({
  selector: 'app-new-chat',
  imports: [
    ChatChannelFormComponent,
  ],
  templateUrl: './new.component.html',
})
export class NewChatComponent {
  pendingSave = false;

  constructor(
    protected _chatsService: ChatService,
    protected _notificationService: NotificationService,
    protected _route: ActivatedRoute,
    protected _router: Router,
  ) {
  }

  onSubmit(chat: ChatChannel) {
    if (this.pendingSave) {
      return;
    }

    this.pendingSave = true;
    this._chatsService.createChatChannel(chat).then((chat) => {
      this._notificationService.open(AlertComponent, {
        data: {
          message: `Chat channel ${chat.name} (${chat.id}) created!`,
          type: 'success',
          persist: true,
        },
        position: 'top-center',
        autohide: true,
      });
      this._router.navigate(['../'], { relativeTo: this._route });
    }).catch((e) => {
      this._notificationService.open(AlertComponent, {
        data: {
          message: `${e.code}: ${e.message}`,
          type: 'error',
          persist: true,
        },
        position: 'top-center',
        autohide: false,
      });
    }).finally(() => {
      this.pendingSave = false;
    })
  }
}
