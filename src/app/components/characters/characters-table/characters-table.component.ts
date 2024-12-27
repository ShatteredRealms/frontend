import { ChangeDetectionStrategy, ChangeDetectorRef, Component, effect, Input, input, ViewChild } from '@angular/core';
import { CharacterDetails } from '../../../../protos/sro/character/character';
import { CharacterService } from '../../../services/backend/character.service';
import { CommonModule } from '@angular/common';
import { timeAge, timeStringFromSeconds } from '../../../helpers/time';
import { UserService } from '../../../services/backend/user.service';
import UserRepresentation from '@keycloak/keycloak-admin-client/lib/defs/userRepresentation';
import { RouterLink } from '@angular/router';
import { TableDirective } from '../../table/table.directive';
import { TablePaginationComponent } from '../../table/table-pagination.component';
import { TableSortDirective } from '../../table/table-sort.directive';
import { TableSortHeaderDirective } from '../../table/table-sort-header.component';
import { DimensionService } from '../../../services/backend/dimension.service';
import { Dimension } from '../../../../protos/sro/gameserver/dimension';
import { defaultFilterFn, GlobalFilterService } from '../../../services/util/global-filter.service';

interface Badge {
  name: string;
  classes: string;
}

@Component({
  selector: 'app-characters-table',
  imports: [
    CommonModule,
    RouterLink,
    TableDirective,
    TablePaginationComponent,
    TableSortDirective,
    TableSortHeaderDirective,
  ],
  templateUrl: './characters-table.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CharactersTableComponent {
  @ViewChild('table') table!: TableDirective<CharacterDetails>;

  @Input()
  actions = true;

  data = input.required<Map<string, CharacterDetails>>();
  datasource: CharacterDetails[] = [];
  owners = new Map<string, UserRepresentation>();
  userGroups = new Map<string, string[]>();
  getUserErrors: string[] = [];
  dimensions: Map<string, Dimension> = new Map();

  constructor(
    protected _characterService: CharacterService,
    protected _dimensionService: DimensionService,
    protected _userService: UserService,
    protected _globalFilterService: GlobalFilterService,
    protected _cdr: ChangeDetectorRef,
  ) {
    effect(() => {
      this.datasource = Array.from(this.data().values());
      this.getUserErrors = [];
      this.data().forEach((char) => {
        this._userService.getUser(char.ownerId).then((user) => {
          this.owners.set(char.characterId, user);
          this._userService.getGroups(user.id!).then((groups) => {
            this.userGroups.set(user.id!, groups.map((group) => group.name!));
            this._cdr.markForCheck();
          })
        }).catch((err) => {
          this.getUserErrors.push(err);
        });
      });
    })
  }

  ngOnInit() {
    this._dimensionService.getDimensions().then((dimensions) => {
      this.dimensions = dimensions;
      this._cdr.markForCheck();
    });
    this._globalFilterService.filter$.subscribe((searchTerm) => {
      this.table?.search(searchTerm);
    });
  }

  timeAge(unixTime: number): string {
    return timeAge(new Date(Number(unixTime) * 1000));
  }

  prettyTime(seconds: number) {
    return timeStringFromSeconds(Number(seconds), true, false);
  }

  getBadges(characterId: string): Badge[] {
    const owner = this.owners.get(characterId);
    if (!owner) {
      return [];
    }

    const groups = this.userGroups.get(owner.id!) || [];

    const badges: Badge[] = [];
    if (groups.includes('Banned')) {
      badges.push({ name: 'Banned', classes: 'text-red-400 bg-red-400/10 ring-red-400/20' });
    }
    if (groups.includes('Admin')) {
      badges.push({ name: 'Admin', classes: 'text-green-400 bg-green-400/10 ring-green-400/20' });
    }
    if (groups.includes('Moderator')) {
      badges.push({ name: 'Moderator', classes: 'text-gray-400 bg-gray-400/10 ring-gray-400/20' });
    }
    if (groups.includes('Member')) {
      badges.push({ name: 'Member', classes: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/20' });
    }
    return badges;
  }

  getOwnerName(characterId: string): string {
    return this.owners.get(characterId)?.username || `Unknown (${characterId})`;
  }

  filterFn(data: any, searchTerm: string): boolean {
    return defaultFilterFn(data, searchTerm);
  }
}
