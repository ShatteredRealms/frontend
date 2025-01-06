import { Component, inject } from '@angular/core';
import { Character, EditCharacterRequest } from '../../../../../../protos/sro/character/character';
import { ActivatedRoute, Router, ROUTER_OUTLET_DATA } from '@angular/router';
import { CharacterService } from '../../../../../services/backend/character.service';
import { MapService } from '../../../../../services/backend/map.service';
import { NotificationService } from '../../../../../services/ui/notification.service';
import { AlertComponent } from '../../../../../components/alert/alert.component';
import { CharacterFormComponent } from '../../../../../components/characters/character-form/character-form.component';
import { ChatChannel } from '../../../../../../protos/sro/chat/chat';
import { ChatService } from '../../../../../services/backend/chat.service';
import { ChatChannelsTableComponent } from '../../../../../components/chat-channels/chat-channels-table/chat-channels-table.component';
import { FieldMask } from '../../../../../../protos/google/protobuf/field_mask';

@Component({
  selector: 'app-edit-character',
  imports: [
    CharacterFormComponent,
    ChatChannelsTableComponent,
  ],
  templateUrl: './edit.component.html',
})
export class EditCharacterComponent {
  character: Character = inject<Character>(ROUTER_OUTLET_DATA);
  id: string;

  pendingSave = false;

  chatChannels: Map<string, ChatChannel>;
  startingChatChannels: Set<ChatChannel>;
  selectedChatChannels: Set<ChatChannel> = new Set();

  constructor(
    protected _charactersService: CharacterService,
    protected _mapService: MapService,
    protected _chatService: ChatService,
    protected _notificationService: NotificationService,
    protected _route: ActivatedRoute,
    protected _router: Router,
  ) {
    this.id = this._route.parent?.snapshot.params['id'] as string;
    if (this.id === undefined) {
      throw new Error('Character ID is required');
    }
  }

  ngOnInit() {
    this._charactersService.getCharacter(this.id).then((character) => {
      this.character = character;
    });
    this._chatService.getChats().then((channels) => {
      this.chatChannels = channels;
      this._chatService.getAuthorizedChats(this.id).then((chatChannels) => {
        this.startingChatChannels = new Set();
        this.chatChannels.forEach((channel) => {
          if (chatChannels.channels.some((c) => c.id === channel.id)) {
            this.startingChatChannels.add(channel);
          }
        });
      });
    });
  }

  onCharacterSubmit(character: Character) {
    if (this.pendingSave) {
      return;
    }

    this.pendingSave = true;
    const request = EditCharacterRequest.create();
    request.character = Character.create();
    request.character.id = this.id;
    request.mask = FieldMask.create()
    if (character.realm !== this.character.realm) {
      request.mask.paths.push('character.realm');
      request.character.realm = character.realm;
    }
    if (character.gender !== this.character.gender) {
      request.mask.paths.push('character.gender');
      request.character.gender = character.gender
    }
    if (character.name !== this.character.name) {
      request.mask.paths.push('character.name');
      request.character.name = character.name;
    }
    if (character.dimensionId !== this.character.dimensionId) {
      request.mask.paths.push('character.dimension_id');
      request.character.dimensionId = character.dimensionId;
    }
    if (character.ownerId !== this.character.ownerId) {
      request.mask.paths.push('character.owner_id');
      request.character.ownerId = character.ownerId;
    }

    this._charactersService.editCharacter(request).then((character) => {
      this.character = character;
      this._notificationService.open(AlertComponent, {
        data: {
          message: 'Character update successful!',
          type: 'success',
          persist: true,
        },
        position: 'top-center',
        autohide: true,
      });
      this._router.navigate(['../'], { relativeTo: this._route });
    }).catch((e) => {
      this._notificationService.open(AlertComponent, {
        data: {
          message: `${e.code}: ${e.message}`,
          type: 'error',
          persist: true,
        },
        position: 'top-center',
        autohide: false,
      });
    }).finally(() => {
      this.pendingSave = false;
    })
  }

  chatChannelChange(channels: Set<ChatChannel>) {
    this.selectedChatChannels = channels;
  }

  onChatChannelsSubmit() {
    this.pendingSave = true;
    this._chatService.setAuthorizedChatChannels(this.id, [...this.selectedChatChannels].map((channel) => channel.id)).finally(() => {
      this.pendingSave = false;
    });
  }
}
