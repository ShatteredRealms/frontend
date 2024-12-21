import { Component } from '@angular/core';
import { BreadcrumbLayoutComponent, ExtraButton } from "../../../layouts/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-admin-layout',
  imports: [
    BreadcrumbLayoutComponent
  ],
  templateUrl: './layout.component.html',
})
export class AdminDimensionLayoutComponent {
  extraButtons: ExtraButton[] = [
    { label: 'New Dimension', routerLink: ['new'] },
  ];

  constructor(
  ) {
  }

}
