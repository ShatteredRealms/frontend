import { Injectable } from '@angular/core';
import { createGrpcWebTransport } from './util';
import { MapServiceClient } from '../../../protos/sro/gameserver/map.client';
import { EditMapRequest, Map as GSMap } from '../../../protos/sro/gameserver/map';
import { MapCached } from './cacheable';
import { KeycloakService } from '../../auth/keycloak.service';
import { NotificationService } from '../ui/notification.service';
import { environment } from '../../../environments/environment';
import { FetchType } from './fetch';
import { AlertComponent } from '../../components/alert/alert.component';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private instance: MapServiceClient;

  private mapCache: MapCached<GSMap>;

  constructor(
    protected keycloak: KeycloakService,
    protected _notificationService: NotificationService,
  ) {
    this.instance = new MapServiceClient(
      createGrpcWebTransport(environment.GSS_GRPC_URL, keycloak),
    );
    this.mapCache = new MapCached(
      'maps',
      'id',
      this._getMap.bind(this),
      this._getMaps.bind(this),
    );
  }

  createMap(map: GSMap): Promise<GSMap> {
    return new Promise(async (resolve, reject) => {
      try {
        const finished = await this.instance.createMap(map);
        this.mapCache.save(finished.response);
        this._showSuccess('Map created');
        resolve(finished.response);
      } catch (e) {
        reject(e);
      }
    });
  }

  editMap(request: EditMapRequest): Promise<GSMap> {
    return new Promise(async (resolve, reject) => {
      try {
        const finished = await this.instance.editMap(request);
        this.mapCache.save(finished.response);
        this._showSuccess('Map updated');
        resolve(finished.response);
      } catch (e) {
        reject(e);
      }
    });
  }

  deleteMap(mapId: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.instance.deleteMap({ id: mapId });
        this.mapCache.remove(mapId);
        this._showSuccess('Map deleted');
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  private _showError(message: string) {
    this._notificationService.open(AlertComponent, {
      data: {
        message: message,
        type: 'error',
      },
      autohide: false,
    });
  }

  private _showSuccess(message: string) {
    this._notificationService.open(AlertComponent, {
      data: {
        message: message,
        type: 'success',
      },
      autohide: false,
    });
  }

  getMaps(fetchType = FetchType.AUTO): Promise<Map<string, GSMap>> {
    return this.mapCache.getAll(fetchType);
  }

  getMap(mapId: string, fetchType = FetchType.AUTO): Promise<GSMap> {
    return this.mapCache.get(mapId, fetchType);
  }

  private _getMaps(): Promise<GSMap[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const finished = await this.instance.getMaps({});
        resolve(finished.response.maps);
      } catch (e) {
        reject(e);
      }
    });
  }

  private _getMap(mapId: string): Promise<GSMap> {
    return new Promise(async (resolve, reject) => {
      try {
        const finished = await this.instance.getMap({ id: mapId });
        resolve(finished.response);
      } catch (e) {
        reject(e);
      }
    });
  }
}
