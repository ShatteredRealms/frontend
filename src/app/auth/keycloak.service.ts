import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Keycloak, { KeycloakLoginOptions, KeycloakProfile } from 'keycloak-js';
import { environment } from '../../environments/environment';
import { fromEvent, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../services/ui/notification.service';
import { AlertComponent } from '../components/alert/alert.component';
import { NotificationRef } from '../services/ui/notification';
import { SROGroups } from './groups';


@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  instance: Keycloak;
  profile: KeycloakProfile | undefined;
  autoLogoutMs = 60 * 60 * 1000;
  logoutWarningPercent = 0.9;

  private _inactiveTimer: any;
  private _inactiveWarningTimer: any;
  private _timeout: boolean
  private _warning: NotificationRef;

  constructor(
    protected _http: HttpClient,
    protected _router: Router,
    protected _notificationService: NotificationService,
  ) {
    this.instance = new Keycloak({
      realm: environment.KEYCLOAK_REALM,
      url: environment.KEYCLOAK_URL,
      clientId: environment.KEYCLOAK_CLIENT_ID,
    });

    this.instance.onAuthLogout = () => {
      if (this._timeout) {
        this._notificationService.open(AlertComponent, {
          data: {
            message: 'You have been logged out due to inactivity',
            type: 'warning',
          },
          position: 'top-center',
          autohide: false,
        });
        this._timeout = false;
      }
    };
    this.instance.onAuthSuccess = () => this.startRefreshTimer(this.instance);

    fromEvent(document, 'mousemove').subscribe(() => this.onInteraction());
    fromEvent(document, 'keydown').subscribe(() => this.onInteraction());
    fromEvent(document, 'click').subscribe(() => this.onInteraction());
  }

  async init(): Promise<boolean> {
    const authenticated = await this.instance.init({
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
      scope: 'openid profile',
      checkLoginIframe: false,
      redirectUri: window.location.origin,
    });

    if (authenticated) {
      try {
        this.profile = await this.instance.loadUserProfile();
      } catch (error) {
        this._notificationService.open(AlertComponent, {
          data: {
            message: 'Error loading user profile',
            type: 'error',
          },
          position: 'top-center',
          autohide: false,
        });
      }
      try {
        await this.instance.loadUserInfo();
      } catch (error) {
        this._notificationService.open(AlertComponent, {
          data: {
            message: 'Error loading user info',
            type: 'error',
          },
          position: 'top-center',
          autohide: false,
        });
      }
    }

    return authenticated;
  }

  startRefreshTimer(keycloak: Keycloak) {
    if (keycloak == null) {
      return;
    }

    if (!keycloak.authenticated) {
      return;
    }

    const token = keycloak.tokenParsed;
    if (!token || !token.exp) {
      return;
    }

    const now = Date.now() / 1000;
    const expire = token.exp;
    const timeout = (expire - now) * 1000 - (15 * 1000);
    setTimeout(async () => {
      await keycloak.updateToken(30);
      this.startRefreshTimer(keycloak);
    }, timeout);
  }

  onInteraction() {
    if (!this.instance.authenticated) {
      return;
    }

    if (this._warning) {
      this._warning.close();
    }

    clearTimeout(this._inactiveTimer);
    this._inactiveTimer = setTimeout(async () => {
      this._timeout = true;
      this.logout();
    }, this.autoLogoutMs);
    clearTimeout(this._inactiveWarningTimer);
    this._inactiveTimer = setTimeout(async () => {
      this._warning = this._notificationService.open(AlertComponent, {
        data: {
          message: 'You are about to be logged out due to inactivity',
          type: 'warning',
        },
        position: 'top-center',
        autohide: false,
      });
    }, this.autoLogoutMs * this.logoutWarningPercent);
  }

  async login(options: KeycloakLoginOptions = {}) {
    await this.instance.login(options);
    this.profile = await this.instance.loadUserProfile();
    this.startRefreshTimer(this.instance);
  }

  async logout() {
    await this.instance.logout();
    this.profile = undefined;
  }

  async register(options: KeycloakLoginOptions = { action: 'register' }) {
    await this.instance.register(options);
    this.profile = await this.instance.loadUserProfile();
  }

  async loadUserProfile(force: boolean = false) {
    if (this.profile && !force) {
      return this.profile;
    }

    if (this.instance.authenticated) {
      throw new Error('User is not authenticated');
    }

    return (this.profile = await this.instance.loadUserProfile());
  }

  getUserRealmRoles(): string[] {
    if (this.instance.realmAccess) {
      return this.instance.realmAccess.roles;
    }
    return [];
  }

  getUserRoles(includeRealmRoles: boolean = true): string[] {
    let roles: string[] = [];
    if (this.instance.resourceAccess) {
      roles = Object.entries(this.instance.resourceAccess).flatMap(([key, value]) =>
        value.roles.map((role) => `${key}:${role}`)
      );
    }
    if (includeRealmRoles) {
      roles.push(...this.getUserRealmRoles());
    }
    return roles;
  }

  getUser(username: string): Observable<KeycloakProfile> {
    return this._http.get<KeycloakProfile>(`${this.baseAdminUrl()}/users?exact=true&max=1&username=${username}`)
      .pipe(
        map((response: KeycloakProfile | any) => {
          if (response instanceof Array) {
            return response[0]
          }
          throw new Error(`unable to find user ${username}`);
        })
      );
  }

  getAllUsers(): Observable<KeycloakProfile[]> {
    return this._http.get<KeycloakProfile[]>(`${this.baseAdminUrl()}/users`)
      .pipe(map((response: KeycloakProfile[] | any) => {
        if (response instanceof Array) {
          return response;
        }
        throw new Error('unable to get users');
      }
      ));
  }

  private baseAdminUrl(): string {
    return `${environment.KEYCLOAK_URL}/admin/realms/${environment.KEYCLOAK_REALM}`;
  }

  getGroups(): string[] {
    if (this.instance.userInfo) {
      const userInfo = this.instance.userInfo as { groups: string[] };
      return userInfo.groups;
    }
    return [];
  }

  hasGroup(group: SROGroups): boolean {
    if (this.instance.userInfo) {
      return this.getGroups().includes(group);
    }
    return false;
  }
}
