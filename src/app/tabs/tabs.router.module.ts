import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    //   path: 'tabs',
    //   component: TabsPage,
    //   children: [
    //     {
    //       path: 'tab1',
    //       children: [
    //         {
    //           path: '',
    //           loadChildren: () =>
    //             import('../tab1/tab1.module').then(m => m.Tab1PageModule)
    //         }
    //       ]
    //     },
    //     {
    //       path: 'tab2',
    //       children: [
    //         {
    //           path: '',
    //           loadChildren: () =>
    //             import('../tab2/tab2.module').then(m => m.Tab2PageModule)
    //         }
    //       ]
    //     },
    //     {
    //       path: 'tab3',
    //       children: [
    //         {
    //           path: '',
    //           loadChildren: () =>
    //             import('../tab3/tab3.module').then(m => m.Tab3PageModule)
    //         }
    //       ]
    //     },
    //     {
    //       path: '',
    //       redirectTo: '/tabs/tab1',
    //       pathMatch: 'full'
    //     }
    //   ]
    // },
    // {
    //   path: '',
    //   redirectTo: '/tabs/tab1',
    //   pathMatch: 'full'

    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'patients',
        // children: [
        //   {
        //     path: '',
        //     loadChildren: '../pages/patients/patients.module#PatientsPageModule',
        //   }
        // ]
      },
      {
        path: 'occupations',
        // children: [
        //   {
        //     path: '',
        //     loadChildren: '../pages/occupations/occupations.module#OccupationsPageModule',

        //   }
        // ]
      },
      {
        path: 'staff',
        // children: [
        //   {
        //     path: '',
        //     loadChildren: '../pages/staff/staff.module#StaffPageModule',

        //   }
        // ]
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
