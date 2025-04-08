import { Injectable } from '@angular/core';
import { createGrpcWebTransport } from './util';
import { KeycloakService } from '../../auth/keycloak.service';
import { environment } from '../../../environments/environment';
import { GameServerDataServiceClient } from '../../../protos/sro/gameserver/data.client';

@Injectable({
  providedIn: 'root'
})
export class GameServerDataService {
  private instance: GameServerDataServiceClient;

  constructor(
    protected keycloak: KeycloakService,
  ) {
    this.instance = new GameServerDataServiceClient(
      createGrpcWebTransport(environment.GSS_GRPC_URL, keycloak),
    );
  }

  getGameServerCount(): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const finished = await this.instance.getGameServerDetails({});
        resolve(finished.response.count);
      } catch (e) {
        reject(e);
      }
    });
  }
}
