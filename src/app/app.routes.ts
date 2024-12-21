import { Routes } from '@angular/router';
import { HomeComponent as HomePage } from './pages/home/home.component';
import { DefaultLayoutComponent as DefaultLayout } from './pages/home/layout.component';
import { AdminLayoutComponent as AdminLayout } from './pages/admin/layout.component';
import { AdminDashboardComponent as AdminDashboardPage } from './pages/admin/dashboard.component';
import { authGuard } from './auth/auth.guard';
import { AdminDimensionsComponent as DimensionDashboardPage } from './pages/admin/dimensions/dimensions.component';
import { AdminCharactersComponent as CharacterDashboardPage } from './pages/admin/characters/characters.component';
import { AdminChatComponent as ChatDashboardPage } from './pages/admin/chat/chat.component';
import { NewDimensionComponent as NewDimensionPage } from './pages/admin/dimensions/new/new.component';
import { EditDimensionComponent as EditDimensionPage } from './pages/admin/dimensions/details/edit/edit.component';
import { DimensionDetailsComponent as DimensionDetailsPage } from './pages/admin/dimensions/details/details.component';
import { AdminDimensionLayoutComponent as AdminDimensionLayout } from './pages/admin/dimensions/layout.component';
import { NewCharacterComponent as NewCharacterPage } from './pages/admin/characters/new/new.component';
import { EditCharacterComponent as EditCharacterPage } from './pages/admin/characters/details/edit/edit.component';
import { CharacterDetailsComponent as CharacterDetailsPage } from './pages/admin/characters/details/details.component';
import { AdminCharacterLayout } from './pages/admin/characters/layout.component';

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
    data: { roles: [], groups: ['admin'] },
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

      { path: 'chat', component: ChatDashboardPage },
    ]
  }
];
