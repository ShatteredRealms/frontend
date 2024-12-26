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
  ],
  templateUrl: './details.component.html',
})
export class CharacterDetailsComponent {

  headers = ['Name', 'Position', 'Office', 'Age', 'Start Date', 'Salary'];

  dataSource: Person[] = [
    {
      name: 'Tiger Nixon',
      position: 'System Architect',
      office: 'Edinburgh',
      age: 61,
      startDate: '2011/04/25',
      salary: '$320,800',
    },
    {
      name: 'Sonya Frost',
      position: 'Software Engineer',
      office: 'Edinburgh',
      age: 23,
      startDate: '2008/12/13',
      salary: '$103,600',
    },
    {
      name: 'Jena Gaines',
      position: 'Office Manager',
      office: 'London',
      age: 30,
      startDate: '2008/12/19',
      salary: '$90,560',
    },
    {
      name: 'Quinn Flynn',
      position: 'Support Lead',
      office: 'Edinburgh',
      age: 22,
      startDate: '2013/03/03',
      salary: '$342,000',
    },
    {
      name: 'Charde Marshall',
      position: 'Regional Director',
      office: 'San Francisco',
      age: 36,
      startDate: '2008/10/16',
      salary: '$470,600',
    },
    {
      name: 'Haley Kennedy',
      position: 'Senior Marketing Designer',
      office: 'London',
      age: 43,
      startDate: '2012/12/18',
      salary: '$313,500',
    },
    {
      name: 'Tatyana Fitzpatrick',
      position: 'Regional Director',
      office: 'London',
      age: 19,
      startDate: '2010/03/17',
      salary: '$385,750',
    },
    {
      name: 'Michael Silva',
      position: 'Marketing Designer',
      office: 'London',
      age: 66,
      startDate: '2012/11/27',
      salary: '$198,500',
    },
    {
      name: 'Paul Byrd',
      position: 'Chief Financial Officer (CFO)',
      office: 'New York',
      age: 64,
      startDate: '2010/06/09',
      salary: '$725,000',
    },
    {
      name: 'Gloria Little',
      position: 'Systems Administrator',
      office: 'New York',
      age: 59,
      startDate: '2009/04/10',
      salary: '$237,500',
    },
    {
      name: 'Garrett Winters',
      position: 'Accountant',
      office: 'Tokyo',
      age: 63,
      startDate: '2011/07/25',
      salary: '$170,750',
    },
    {
      name: 'Ashton Cox',
      position: 'Junior Technical Author',
      office: 'San Francisco',
      age: 66,
      startDate: '2009/01/12',
      salary: '$86,000',
    },
    {
      name: 'Cedric Kelly',
      position: 'Senior Javascript Developer',
      office: 'Edinburgh',
      age: 22,
      startDate: '2012/03/29',
      salary: '$433,060',
    },
    {
      name: 'Airi Satou',
      position: 'Accountant',
      office: 'Tokyo',
      age: 33,
      startDate: '2008/11/28',
      salary: '$162,700',
    },
    {
      name: 'Brielle Williamson',
      position: 'Integration Specialist',
      office: 'New York',
      age: 61,
      startDate: '2012/12/02',
      salary: '$372,000',
    },
  ];






  @Input() id!: string;

  @Input() character: CharacterDetails | undefined;
  owner: UserRepresentation | undefined;
  dimension: Dimension | undefined;

  constructor(
    protected _charactersService: CharacterService,
    protected _userSerivce: UserService,
    protected _dimensionService: DimensionService,
    protected _modalService: ModalService,
    protected _notificationService: NotificationService,
    protected _router: Router,
    protected _route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (!this.character) {
      this._charactersService.getCharacter(this.id).then((character) => {
        this.character = character;
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
