import { Component, Input } from '@angular/core';
import { CharacterService } from '../../../../services/backend/character.service';
import { ModalService } from '../../../../services/ui/modal.service';
import { NotificationService } from '../../../../services/ui/notification.service';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ModalComponent } from '../../../../components/modal/modal.component';
import { AlertComponent } from '../../../../components/alert/alert.component';
import { CharacterDetails } from '../../../../../protos/sro/character/character';
import { UserService } from '../../../../services/backend/user.service';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { Dimension } from '../../../../../protos/sro/gameserver/dimension';
import { DimensionService } from '../../../../services/backend/dimension.service';
import { CommonModule } from '@angular/common';
import { ChatChannel } from '../../../../../protos/sro/chat/chat';
import { ChatService } from '../../../../services/backend/chat.service';
import { ChatChannelsTableComponent } from '../../../../components/chat-channels/chat-channels-table/chat-channels-table.component';

export interface Person {
  name: string;
  position: string;
  office: string;
  age: number;
  startDate: string;
  salary: string;
}

@Component({
  selector: 'app-character-details',
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    ChatChannelsTableComponent,
  ],
  templateUrl: './details.component.html',
})
export class CharacterDetailsComponent {
  @Input() id!: string;

  @Input() character: CharacterDetails | undefined;
  owner: UserRepresentation | undefined;
  dimension: Dimension | undefined;

  characterChatChannels: Map<string, ChatChannel>;

  constructor(
    protected _charactersService: CharacterService,
    protected _userSerivce: UserService,
    protected _dimensionService: DimensionService,
    protected _chatService: ChatService,
    protected _modalService: ModalService,
    protected _notificationService: NotificationService,
    protected _router: Router,
    protected _route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (!this.character) {
      this._charactersService.getCharacter(this.id).then((character) => {
        this.character = character;
        this._chatService.getAuthorizedChats(character.characterId).then((chatChannels) => {
          this.characterChatChannels = new Map(chatChannels.channels.map((channel) => [channel.id, channel]));
        });
        this._userSerivce.getUser(character.ownerId).then((user) => {
          this.owner = user;
        }).catch((error) => {
          this._notificationService.open(AlertComponent, {
            data: {
              message: `Failed to load user. ${error.code} + ${error.message}`,
              type: 'error',
            },
          });
        });
        this._dimensionService.getDimension(character.dimensionId).then((dimension) => {
          this.dimension = dimension;
        }).catch((error) => {
          this._notificationService.open(AlertComponent, {
            data: {
              message: `Failed to load dimension. ${error.code} + ${error.message}`,
              type: 'error',
            },
          });
        });
      });
    }
  }

  async deleteCharacter() {
    this._modalService.open(ModalComponent, {
      data: {
        title: 'Delete Character',
        message: 'Are you sure you want to delete this character?',
        submitText: 'Delete',
        isWarning: true,
      },
    }).onClose.subscribe((result: any) => {
      if (result) {
        this._charactersService.deleteCharacter(this.id).then(() => {
          this._router.navigate(['../'], { relativeTo: this._route }).finally(() => {
            this._notificationService.open(AlertComponent, {
              data: {
                message: 'The character has been deleted successfully.',
                type: 'success',
              },
            });
          });
        }).catch((error) => {
          this._notificationService.open(AlertComponent, {
            data: {
              message: `Failed to delete the character. ${error.code} + ${error.message}`,
              type: 'error',
            },
          });
        });
      }
    });
  }
}
