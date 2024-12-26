import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ChatChannel } from '../../../../protos/sro/chat/chat';
import { ChatService } from '../../../services/backend/chat.service';
import { ChatChannelsTableComponent } from '../../../components/chat-channels/chat-channels-table/chat-channels-table.component';

@Component({
  selector: 'app-chats',
  imports: [
    RouterLink,
    RouterOutlet,
    ChatChannelsTableComponent
  ],
  templateUrl: './chats.component.html',
})
export class AdminChatsComponent {
  chats: Map<string, ChatChannel> = new Map();

  constructor(
    private _chatsService: ChatService,
  ) { }

  ngOnInit() {
    this._chatsService.getChats().then((chats) => {
      this.chats = chats;
    });
  }
}
