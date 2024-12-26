import { Component, Inject, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { KeycloakService } from '../../auth/keycloak.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { heroHome, heroCog6Tooth, heroXMark, heroChatBubbleLeftEllipsis, heroUser, heroGlobeAlt, heroRocketLaunch, heroCircleStack } from '@ng-icons/heroicons/outline';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin',
  imports: [
    RouterOutlet,
    CommonModule,
    RouterLink,
    NgIconComponent,
  ],
  providers: [
    provideIcons({ heroHome, heroCog6Tooth, heroXMark, heroChatBubbleLeftEllipsis, heroUser, heroGlobeAlt, heroRocketLaunch, heroCircleStack }),
  ],
  templateUrl: './layout.component.html',
})
export class AdminLayoutComponent {
  mainLinks = [
    {
      title: 'Dashboard',
      link: '/admin',
      active: false,
      icon: "heroHome",
    },
    {
      title: 'Dimensions',
      link: '/admin/dimensions',
      icon: "heroCircleStack",
      active: false,
    },
    {
      title: 'Maps',
      link: '/admin/maps',
      icon: "heroGlobeAlt",
      active: false,
    },
    {
      title: 'Characters',
      link: '/admin/characters',
      icon: "heroUser",
      active: false,
    },
    {
      title: 'Chat',
      link: '/admin/chats',
      icon: "heroChatBubbleLeftEllipsis",
      active: false,
    },
  ];

  bottomLinks = [
    {
      title: 'Settings',
      link: '/admin/settings',
      active: false,
      icon: "heroCog6Tooth",
    },
    {
      title: 'Exit Dashboard',
      link: '/',
      active: false,
      icon: "heroXMark",
    },
  ];

  showProfile = false;
  showMobileMenu = false;

  constructor(
    protected _route: ActivatedRoute,
    protected _router: Router,
    protected _keycloak: KeycloakService,
    protected renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) { }

  ngOnInit() {
    this.renderer.addClass(this.document.body, 'bg-gray-800');
    this.renderer.addClass(this.document.body, 'h-full');
    this.updateActiveLink();
    this._router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.showMobileMenu = false;
      this.showProfile = false;
      this.updateActiveLink();
    });
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'bg-gray-800');
    this.renderer.removeClass(this.document.body, 'h-full');
  }

  toggleProfile() {
    this.showProfile = !this.showProfile;
  }
  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }
  getActiveTitle() {
    return this.mainLinks.find(link => link.active)?.title || 'Admin Dashboard';
  }

  updateActiveLink() {
    this.mainLinks.forEach(link => {
      link.active = this._router.url === link.link;
    });
  }

  getName() {
    return `${this._keycloak.profile?.firstName} ${this._keycloak.profile?.lastName} (${this._keycloak.profile?.username})`;
  }
}
