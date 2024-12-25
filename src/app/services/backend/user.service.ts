import { Injectable } from '@angular/core';
import KcAdminClient from '@keycloak/keycloak-admin-client';
import { environment } from '../../../environments/environment';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { MapCached } from './cacheable';
import { FetchType } from './fetch';
import { KeycloakService } from '../../auth/keycloak.service';
import GroupRepresentation from '@keycloak/keycloak-admin-client/lib/defs/groupRepresentation';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _kcAdmin: KcAdminClient = new KcAdminClient({
    realmName: environment.KEYCLOAK_REALM,
    baseUrl: environment.KEYCLOAK_URL,
  })

  private _userCache: MapCached<UserRepresentation>;

  constructor(
    protected keycloak: KeycloakService,
  ) {
    this._userCache = new MapCached(
      'users',
      'id',
      this._getUser.bind(this),
      this._getUsers.bind(this),
    );
  }

  getUser(userId: string, fetchType = FetchType.AUTO): Promise<UserRepresentation> {
    this._kcAdmin.accessToken = this.keycloak.instance.token;
    return this._userCache.get(userId, fetchType);
  }

  getGroups(userId: string): Promise<GroupRepresentation[]> {
    return this._kcAdmin.users.listGroups({ id: userId });
  }

  getUsers(fetchType = FetchType.AUTO): Promise<Map<string, UserRepresentation>> {
    this._kcAdmin.accessToken = this.keycloak.instance.token;
    return this._userCache.getAll(fetchType);
  }

  private _getUser(id: string): Promise<UserRepresentation> {
    return new Promise(async (resolve, reject) => {
      try {
        this._kcAdmin.accessToken = this.keycloak.instance.token;
        const user = await this._kcAdmin.users.findOne({ id });
        if (!user) {
          reject('User not found');
        }
        resolve(user!);
      } catch (e) {
        reject(e);
      }
    });
  }

  private _getUsers(): Promise<UserRepresentation[]> {
    this._kcAdmin.accessToken = this.keycloak.instance.token;
    return this._kcAdmin.users.find({});
  }
}
