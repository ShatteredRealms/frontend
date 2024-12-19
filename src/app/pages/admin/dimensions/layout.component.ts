import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-admin-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './layout.component.html',
})
export class AdminDimensionLayoutComponent {
  breadcrumbs: Breadcrumb[] = [];

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
