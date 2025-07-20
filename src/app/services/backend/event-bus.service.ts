import { Injectable } from '@angular/core';
import { KeycloakService } from '../../auth/keycloak.service';
import { NotificationService } from '../ui/notification.service';
import { BusServiceClient } from '../../../protos/sro/bus.client';
import { createGrpcWebTransport } from './util';
import { environment } from '../../../environments/environment';
import { BusTarget } from '../../../protos/sro/bus';
import { AlertComponent } from '../../components/alert/alert.component';

export enum CharacterBusWriter {
  Character = 'sro.character',
}

export enum CharacterBusReader {
  Dimension = 'sro.gameserver.dimension',
}

export enum ChatBusWriter {
}

export enum ChatBusReader {
  Dimension = 'sro.gameserver.dimension',
  Character = 'sro.character',
}

export enum DimensionBusWriter {
  Dimension = 'sro.gameserver.dimension',
  Map = 'sro.gameserver.map',
}

export enum DimensionBusReader {
  Character = 'sro.character',
}

@Injectable({
  providedIn: 'root'
})
export class EventBusService {
  private character: BusServiceClient;
  private chat: BusServiceClient;
  private gss: BusServiceClient;

  constructor(
    protected keycloak: KeycloakService,
    protected _notificationService: NotificationService,
  ) {
    this.character = new BusServiceClient(createGrpcWebTransport(environment.CHARACTER_GRPC_URL, keycloak));
    this.chat = new BusServiceClient(createGrpcWebTransport(environment.CHAT_GRPC_URL, keycloak));
    this.gss = new BusServiceClient(createGrpcWebTransport(environment.GSS_GRPC_URL, keycloak));
  }

  /**
  * Resets the character bus.
  *
  * @param read - If true, it will reset the character bus reader, otherwise it will reset the character bus writer.
  */
  resetCharacterBusWriter(type: CharacterBusWriter) {
    let target = BusTarget.create();
    target.type = type;
    this.character.resetWriterBus(target).then(() => {
      this.successNotification('Character bus writer reset successfully.');
    }).catch((e) => {
      this.errorNotification(`Error resetting character bus writer: ${e.message}`);
    });
  }

  resetCharacterBusReader(type: CharacterBusReader) {
    let target = BusTarget.create();
    target.type = type;
    this.character.resetReaderBus(target).then(() => {
      this.successNotification('Character bus reader reset successfully.');
    }).catch((e) => {
      this.errorNotification(`Error resetting character bus reader: ${e.message}`);
    });
  }

  resetChatBusReader(type: ChatBusReader) {
    let target = BusTarget.create();
    target.type = type;
    this.chat.resetReaderBus(target).then(() => {
      this.successNotification('Chat bus reader reset successfully.');
    }).catch((e) => {
      this.errorNotification(`Error resetting chat bus reader: ${e.message}`);
    });
  }

  resetDimensionBusWriter(type: DimensionBusWriter) {
    let target = BusTarget.create();
    target.type = type;
    this.gss.resetWriterBus(target).then(() => {
      this.successNotification('Dimension bus writer reset successfully.');
    }).catch((e) => {
      this.errorNotification(`Error resetting dimension bus writer: ${e.message}`);
    });
  }

  resetDimensionBusReader(type: DimensionBusReader) {
    let target = BusTarget.create();
    target.type = type;
    this.gss.resetReaderBus(target).then(() => {
      this.successNotification('Dimension bus reader reset successfully.');
    }).catch((e) => {
      this.errorNotification(`Error resetting dimension bus reader: ${e.message}`);
    });
  }

  private successNotification(message: string) {
    this._notificationService.open(AlertComponent, {
      data: {
        message: message,
        type: 'success',
      },
      autohide: true,
      position: 'top-center',
    });
  }

  private errorNotification(message: string) {
    this._notificationService.open(AlertComponent, {
      data: {
        message: message,
        type: 'error',
      },
      autohide: false,
      position: 'top-center',
    });
  }
}
