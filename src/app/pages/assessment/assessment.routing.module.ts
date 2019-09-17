import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssessmentInstanceComponent } from './assessment-instance/assessment-instance.component';


const routes: Routes = [
  { path: '', component: AssessmentInstanceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssessmentRoutingModule { }
