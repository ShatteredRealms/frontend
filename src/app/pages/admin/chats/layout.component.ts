import { Component } from '@angular/core';
import { BreadcrumbLayoutComponent, ExtraButton } from '../../../layouts/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-chats-layout',
  imports: [
    BreadcrumbLayoutComponent,
  ],
  templateUrl: './layout.component.html',
})
export class AdminChatLayout {
  extraButtons: ExtraButton[] = [
    { label: 'New Chat', routerLink: ['new'] },
  ];
}
