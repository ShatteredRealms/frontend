import { Component, inject } from '@angular/core';
import { ChatChannel, UpdateChatChannelRequest } from '../../../../../../protos/sro/chat/chat';
import { ActivatedRoute, Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { ChatService } from '../../../../../services/backend/chat.service';
import { MapService } from '../../../../../services/backend/map.service';
import { NotificationService } from '../../../../../services/ui/notification.service';
import { AlertComponent } from '../../../../../components/alert/alert.component';
import { ChatChannelFormComponent } from '../../../../../components/chat-channels/chat-channel-form/chat-channel-form.component';

@Component({
  selector: 'app-edit-chat',
  imports: [
    ChatChannelFormComponent,
  ],
  templateUrl: './edit.component.html',
})
export class EditChatComponent {
  chat: ChatChannel = inject<ChatChannel>(ROUTER_OUTLET_DATA);
  id: string;

  pendingSave = false;

  constructor(
    protected _chatsService: ChatService,
    protected _mapService: MapService,
    protected _notificationService: NotificationService,
    protected _route: ActivatedRoute,
    protected _router: Router,
  ) {
    this.id = this._route.parent?.snapshot.params['id'] as string;
    if (this.id === undefined) {
      throw new Error('Chat ID is required');
    }
  }

  ngOnInit() {
    this._chatsService.getChat(this.id).then((chat) => {
      this.chat = chat;
    });
  }

  onSubmit(chat: ChatChannel) {
    if (this.pendingSave) {
      return;
    }

    this.pendingSave = true;
    const request = UpdateChatChannelRequest.create();
    request.channelId = this.id;
    request.optionalDimension = { oneofKind: 'dimension', dimension: chat.dimensionId }

    this._chatsService.editChat(request).then((chat) => {
      this.chat = chat;
      this._notificationService.open(AlertComponent, {
        data: {
          message: 'Chat update successful!',
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
