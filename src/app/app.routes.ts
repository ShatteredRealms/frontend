import { Routes } from '@angular/router';
import { HomeComponent as HomePage } from './pages/home/home.component';
import { DefaultLayoutComponent as DefaultLayout } from './pages/home/layout.component';
import { AdminLayoutComponent as AdminLayout } from './pages/admin/layout.component';
import { AdminDashboardComponent as AdminDashboardPage } from './pages/admin/dashboard.component';
import { authGuard } from './auth/auth.guard';
import { AdminDimensionsComponent as DimensionDashboardPage } from './pages/admin/dimensions/dimensions.component';
import { AdminCharactersComponent as CharacterDashboardPage } from './pages/admin/characters/characters.component';
import { NewDimensionComponent as NewDimensionPage } from './pages/admin/dimensions/new/new.component';
import { EditDimensionComponent as EditDimensionPage } from './pages/admin/dimensions/details/edit/edit.component';
import { DimensionDetailsComponent as DimensionDetailsPage } from './pages/admin/dimensions/details/details.component';
import { AdminDimensionLayoutComponent as AdminDimensionLayout } from './pages/admin/dimensions/layout.component';
import { NewCharacterComponent as NewCharacterPage } from './pages/admin/characters/new/new.component';
import { EditCharacterComponent as EditCharacterPage } from './pages/admin/characters/details/edit/edit.component';
import { CharacterDetailsComponent as CharacterDetailsPage } from './pages/admin/characters/details/details.component';
import { AdminCharacterLayout } from './pages/admin/characters/layout.component';
import { SROGroups } from './auth/groups';
import { AdminChatLayout } from './pages/admin/chats/layout.component';
import { NewChatComponent } from './pages/admin/chats/new/new.component';
import { ChatChannelComponent } from './pages/admin/chats/details/details.component';
import { EditChatComponent } from './pages/admin/chats/details/edit/edit.component';
import { AdminChatsComponent } from './pages/admin/chats/chats.component';
import { AdminMapLayout } from './pages/admin/maps/layout.component';
import { AdminMapsComponent } from './pages/admin/maps/maps.component';
import { NewMapComponent } from './pages/admin/maps/new/new.component';
import { MapChannelComponent } from './pages/admin/maps/details/details.component';
import { EditMapComponent } from './pages/admin/maps/details/edit/edit.component';

export const routes: Routes = [
  {
    path: '', component: DefaultLayout,
    children: [
      { path: '', component: HomePage },
    ]
  },
  {
    path: 'admin',
    component: AdminLayout,
    data: { roles: [], groups: [SROGroups.Admin] },
    canActivate: [authGuard],
    children: [
      { path: '', component: AdminDashboardPage },

      {
        path: 'dimensions',
        component: AdminDimensionLayout,
        children: [
          {
            path: '', component: DimensionDashboardPage, data: { breadcrumb: 'Dimensions' },
            children: [
              { path: 'new', component: NewDimensionPage, data: { breadcrumb: 'New Dimension' } },
              {
                path: ':id', component: DimensionDetailsPage, data: { breadcrumb: ':id' },
                children: [
                  { path: 'edit', component: EditDimensionPage, data: { breadcrumb: 'Edit Dimension' } },
                ],
              },
            ],
          },
        ],
      },

      {
        path: 'characters',
        component: AdminCharacterLayout,
        children: [
          {
            path: '', component: CharacterDashboardPage, data: { breadcrumb: 'Characters' },
            children: [
              { path: 'new', component: NewCharacterPage, data: { breadcrumb: 'New Character' } },
              {
                path: ':id', component: CharacterDetailsPage, data: { breadcrumb: ':id' },
                children: [
                  { path: 'edit', component: EditCharacterPage, data: { breadcrumb: 'Edit Character' } },
                ],
              },
            ],
          },
        ],
      },

      {
        path: 'chats',
        component: AdminChatLayout,
        children: [
          {
            path: '', component: AdminChatsComponent, data: { breadcrumb: 'Chats' },
            children: [
              { path: 'new', component: NewChatComponent, data: { breadcrumb: 'New Chat' } },
              {
                path: ':id', component: ChatChannelComponent, data: { breadcrumb: ':id' },
                children: [
                  { path: 'edit', component: EditChatComponent, data: { breadcrumb: 'Edit Chat' } },
                ],
              },
            ],
          },
        ],
      },

      {
        path: 'maps',
        component: AdminMapLayout,
        children: [
          {
            path: '', component: AdminMapsComponent, data: { breadcrumb: 'Maps' },
            children: [
              { path: 'new', component: NewMapComponent, data: { breadcrumb: 'New Map' } },
              {
                path: ':id', component: MapChannelComponent, data: { breadcrumb: ':id' },
                children: [
                  { path: 'edit', component: EditMapComponent, data: { breadcrumb: 'Edit Map' } },
                ],
              },
            ],
          },
        ],
      },
    ]
  }
];
