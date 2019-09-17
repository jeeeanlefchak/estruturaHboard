import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { InterventionComponent } from './intervention.component';
import { interventionTemplatesService } from 'src/app/services/intervention-templates.service';
import { InterventionTemplateToGroupService } from 'src/app/services/Intervention-template-to-group.service';
import { InterventionInstancesService } from 'src/app/services/Intervention-intance.service';

const routes: Routes = [
  { path: ':stationId', component: InterventionComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    InterventionComponent
  ],
  providers: [
    interventionTemplatesService,
    InterventionTemplateToGroupService,
    InterventionInstancesService
  ],
  exports: [],
  entryComponents: [
  ],
})
export class InterventionModule { }
