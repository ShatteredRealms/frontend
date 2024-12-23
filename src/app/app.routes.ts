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
import { SROGroups } from './auth/groups';

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

      { path: 'characters', component: CharacterDashboardPage },

      { path: 'chat', component: ChatDashboardPage },
    ]
  }
];
