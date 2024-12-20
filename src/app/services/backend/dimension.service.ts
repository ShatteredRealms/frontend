import { Injectable } from '@angular/core';
import { KeycloakService } from '../../auth/keycloak.service';
import { createGrpcWebTransport } from './util';
import { environment } from '../../../environments/environment';
import { MapCached } from './cacheable';
import { NotificationService } from '../ui/notification.service';
import { Dimension, EditDimensionRequest } from '../../../protos/sro/gameserver/dimension';
import { FetchType } from './fetch';
import { DimensionServiceClient } from '../../../protos/sro/gameserver/dimension.client';

@Injectable({
  providedIn: 'root'
})
export class DimensionService {
  private instance: DimensionServiceClient;

  private dimensionCache: MapCached<Dimension>;

  constructor(
    protected keycloak: KeycloakService,
    protected _notificationService: NotificationService,
  ) {
    this.instance = new DimensionServiceClient(
      createGrpcWebTransport(environment.GSS_GRPC_URL, keycloak),
    );
    this.dimensionCache = new MapCached(
      'dimensions',
      'id',
      this._getDimension.bind(this),
      this._getDimensions.bind(this),
    );
  }

  editDimension(request: EditDimensionRequest): Promise<Dimension> {
    return new Promise(async (resolve, reject) => {
      try {
        const finished = await this.instance.editDimension(request);
        this.dimensionCache.save(finished.response);
        resolve(finished.response);
      } catch (e) {
        reject(e);
      }
    });
  }

  getDimensions(fetchType = FetchType.AUTO): Promise<Map<string, Dimension>> {
    return this.dimensionCache.getAll(fetchType);
  }

  getDimension(dimensionId: string, fetchType = FetchType.AUTO): Promise<Dimension> {
    return this.dimensionCache.get(dimensionId, fetchType);
  }

  private _getDimensions(): Promise<Dimension[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const finished = await this.instance.getDimensions({});
        resolve(finished.response.dimensions);
      } catch (e) {
        reject(e);
      }
    });
  }

  private _getDimension(dimensionId: string): Promise<Dimension> {
    return new Promise(async (resolve, reject) => {
      try {
        const finished = await this.instance.getDimension({ id: dimensionId });
        resolve(finished.response);
      } catch (e) {
        reject(e);
      }
    });
  }
}
