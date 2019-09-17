import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'patients',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/patients/patients.module').then(m => m.PatientsPageModule)
          }
        ]
      },
      {
        path: 'occupations',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/occupations/occupations.module').then(m => m.OccupationsPageModule)

          }
        ]
      },
      {
        path: 'staff',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/staff/staff.module').then(m => m.StaffPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/patients',
        pathMatch: 'full',
        //canActivate: [AuthGuard]
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/patients',
    pathMatch: 'full',
    //canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }
