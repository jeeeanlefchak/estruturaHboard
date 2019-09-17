import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(l => l.LoginPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(l => l.AboutPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./pages/settings/settings.module').then(l => l.SettingsPageModule)
  },
  {
    path: 'admission',
    loadChildren: () => import('./pages/admission/admission.component.module').then(l => l.AdmissionPageModule)
  },
  {
    path: 'assessment',
    loadChildren: () => import('./pages/assessment/assessment.module').then(l => l.AssessmentModule)
  },
  {
    path: 'handoff',
    loadChildren: () => import('./pages/handoff/handoff.module').then(l => l.HandoffModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then(l => l.AccountPageModule)
  },
  {
    path: 'condition',
    loadChildren: () => import('./pages/condition/condition.module').then(l => l.ConditionModule)
  },
  {
    path: 'intervention',
    loadChildren: () => import('./pages/intervention/intervention.module').then(l => l.InterventionModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
