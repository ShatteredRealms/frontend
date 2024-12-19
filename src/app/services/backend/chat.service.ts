import { Injectable } from '@angular/core';
import { ChatServiceClient } from '../../protos/sro/chat/chat.client';
import { KeycloakService } from '../auth/keycloak.service';
import { createGrpcWebTransport } from './util';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private instance: ChatServiceClient;
  constructor(
    protected keycloak: KeycloakService,
  ) {
    this.instance = new ChatServiceClient(createGrpcWebTransport(environment.CHAT_GRPC_URL, keycloak));
  }

  getClient(): ChatServiceClient {
    return this.instance;
  }
}
