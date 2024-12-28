import { Component } from '@angular/core';
import { BreadcrumbLayoutComponent, ExtraButton } from '../../../layouts/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-maps-layout',
  imports: [
    BreadcrumbLayoutComponent,
  ],
  templateUrl: './layout.component.html',
})
export class AdminMapLayout {
  extraButtons: ExtraButton[] = [
    { label: 'New Map', routerLink: ['new'] },
  ];
}
