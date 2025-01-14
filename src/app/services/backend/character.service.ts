import { Injectable } from '@angular/core';
import { CharacterServiceClient } from '../../../protos/sro/character/character.client';
import { KeycloakService } from '../../auth/keycloak.service';
import { createGrpcWebTransport } from './util';
import { environment } from '../../../environments/environment';
import { Character, CreateCharacterRequest, EditCharacterRequest } from '../../../protos/sro/character/character';
import { FetchType } from './fetch';
import { NotificationService } from '../ui/notification.service';
import { AlertComponent } from '../../components/alert/alert.component';
import { MapCached } from './cacheable';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private instance: CharacterServiceClient;

  private characterCache: MapCached<Character>;

  constructor(
    protected keycloak: KeycloakService,
    protected _notificationService: NotificationService,
  ) {
    this.instance = new CharacterServiceClient(createGrpcWebTransport(environment.CHARACTER_GRPC_URL, keycloak));
    this.characterCache = new MapCached(
      'characters',
      'id',
      this._getCharacter.bind(this),
      this._getCharacters.bind(this),
    );
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

  editCharacter(request: EditCharacterRequest): Promise<Character> {
    return new Promise(async (resolve, reject) => {
      this.instance.editCharacter(request).then((finished) => {
        this.characterCache.save(finished.response);
        this._showSuccess('Character updated');
        resolve(finished.response);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  deleteCharacter(characterId: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const finished = await this.instance.deleteCharacter({ id: characterId });
      if (finished.response) {
        this.characterCache.remove(characterId);
        resolve(true);
      } else {
        this._showError('Error deleting character');
        reject(false);
      }
    });
  }

  createCharacter(data: CreateCharacterRequest): Promise<Character> {
    return new Promise(async (resolve, reject) => {
      this.instance.createCharacter(data).then((finished) => {
        this.characterCache.save(finished.response);
        this._showSuccess('Character created');
        resolve(finished.response);
      }).catch((e) => {
        reject(e);
      });
    });
  }

  getCharacters(fetchType = FetchType.AUTO): Promise<Map<string, Character>> {
    return this.characterCache.getAll(fetchType);
  }

  getCharacter(characterId: string, fetchType = FetchType.AUTO): Promise<Character> {
    return this.characterCache.get(characterId, fetchType);
  }

  private _getCharacters(fetchType = FetchType.AUTO): Promise<Character[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const finished = await this.instance.getCharacters({});
        resolve(finished.response.characters);
      } catch (e) {
        reject(e);
      }
    });
  }

  private _getCharacter(characterId: string, fetchType = FetchType.AUTO): Promise<Character> {
    return new Promise(async (resolve, reject) => {
      try {
        const finished = await this.instance.getCharacter({ id: characterId });
        resolve(finished.response);
      } catch (e) {
        reject(e);
      }
    });
  }
}
