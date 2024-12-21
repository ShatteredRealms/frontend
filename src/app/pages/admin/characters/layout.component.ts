import { Component } from '@angular/core';
import { BreadcrumbLayoutComponent, ExtraButton } from '../../../layouts/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-characters-layout',
  imports: [
    BreadcrumbLayoutComponent,
  ],
  templateUrl: './layout.component.html',
})
export class AdminCharacterLayout {
  extraButtons: ExtraButton[] = [
    { label: 'New Character', routerLink: ['new'] },
  ];
}
