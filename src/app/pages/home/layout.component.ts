import { Component, Inject, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterLink, RouterOutlet } from '@angular/router';
import { KeycloakService } from '../../auth/keycloak.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { trigger, transition, animate, style, state } from '@angular/animations';
import { SROGroups } from '../../auth/groups';
import { filter } from 'rxjs';

@Component({
  selector: 'app-default',
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './layout.component.html',
  animations: [
    trigger('openClose', [
      state('open',
        style({ opacity: 1, transform: 'scale(1.0)' }),
      ),
      state('closed',
        style({ opacity: 0, transform: 'scale(0.95)' }),
      ),
      transition('open => closed', [
        animate('100ms'),
      ]),
      transition('closed => open', [
        animate('75ms'),
      ]),
    ]),
  ],
})
export class DefaultLayoutComponent {
  links = [
    {
      title: 'Home',
      link: '/',
      active: false,
    },
    {
      title: 'Dev Log',
      link: '/blog',
      active: false,
    },
  ];

  showProfile = false;
  showMobileMenu = false;

  constructor(
    protected _router: Router,
    protected _keycloak: KeycloakService,
    protected renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  ngOnInit() {

    this.renderer.addClass(this.document.body, 'bg-gray-900');
    this.renderer.addClass(this.document.body, 'h-full');
    if (this.isAuthenticated() && this._keycloak.hasGroup(SROGroups.Admin)) {
      this.links.push({
        title: 'Admin',
        link: '/admin',
        active: false,
      });
    }
    this.updateActiveLink(this._router.url);
    this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.updateActiveLink(event.url);
    });
  }

  updateActiveLink(url: string) {
    console.log('updateActiveLink:', url);
    this.links.forEach(link => {
      if (link.link === '/') {
        link.active = url === '' || url === '/';
      } else {
        link.active = url.startsWith(link.link);
      }
    });
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'bg-gray-900');
    this.renderer.removeClass(this.document.body, 'h-full');
  }

  logout() {
    if (this.isAuthenticated())
      this._keycloak.logout();
  }

  login() {
    if (!this.isAuthenticated())
      this._keycloak.login();
  }

  isAuthenticated() {
    return this._keycloak.instance.authenticated;
  }

  toggleProfile() {
    this.showProfile = !this.showProfile;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }
}
