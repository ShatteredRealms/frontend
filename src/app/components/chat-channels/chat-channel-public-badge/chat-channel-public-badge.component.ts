import { Component, input } from '@angular/core';
import { ChatChannel } from '../../../../protos/sro/chat/chat';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-chat-channel-public-badge',
  imports: [
    NgClass,
  ],
  templateUrl: './chat-channel-public-badge.component.html',
})
export class ChatChannelPublicBadgeComponent {
  chatChannel = input.required<ChatChannel>();
  dark = input<boolean>(false);
}
