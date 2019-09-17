import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { ConditionComponent } from './condition.component';
import { ConditionTemplateGroupService } from 'src/app/services/condition-template.group.service';
import { ConditionInstanceIndexesService } from 'src/app/services/condition-instance-index.service';


const routes: Routes = [
  { path: ':stationId', component: ConditionComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ConditionComponent],
  providers: [
    ConditionTemplateGroupService,
    ConditionInstanceIndexesService
  ],
  exports: [],
  entryComponents: [],
})
export class ConditionModule { }
