import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

interface Breadcrumb {
  label: string;
  url: string;
}

export interface ExtraButton {
  label: string;
  routerLink: string[];
}


@Component({
  selector: 'app-breadcrumb',
  imports: [
    RouterLink,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbLayoutComponent {

  breadcrumbs: Breadcrumb[] = [];
  extraButtons = input<ExtraButton[]>([]);

  constructor(
    protected _router: Router,
    protected _activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.updateBreadcrumbs();
    this._router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateBreadcrumbs();
    });
  }

  updateBreadcrumbs() {
    this.breadcrumbs = [];

    let url = '';
    const children = this._activatedRoute.root.children;
    for (let idx = 0; idx < children.length; idx++) {
      const child = children[idx];
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }
      let label = child.snapshot.data['breadcrumb'];
      if (label !== undefined && label !== null) {
        if (label.startsWith(':')) {
          label = child.snapshot.params[label.replace(':', '')];
        }
        this.breadcrumbs.push({ label, url });
      }
      children.push(...child.children);
    }
  }

  isLastBreadcrumb(b: Breadcrumb): boolean {
    return this.breadcrumbs.lastIndexOf(b) === this.breadcrumbs.length - 1;
  }
}
