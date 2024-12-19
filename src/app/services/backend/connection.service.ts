import { Injectable } from '@angular/core';
import { ConnectionServiceClient } from '../../protos/sro/gameserver/connection.client';
import { KeycloakService } from '../auth/keycloak.service';
import { createGrpcWebTransport } from './util';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  private instance: ConnectionServiceClient;
  constructor(
    protected keycloak: KeycloakService,
  ) {
    this.instance = new ConnectionServiceClient(createGrpcWebTransport(environment.GSS_GRPC_URL, keycloak));
  }

  getClient(): ConnectionServiceClient {
    return this.instance;
  }
}
