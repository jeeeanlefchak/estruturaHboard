import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentRoutingModule } from './assessment.routing.module';
import { AssessmentInstanceModule } from './assessment-instance/assessment-instance.module';

@NgModule({
    imports: [
        CommonModule,
        AssessmentRoutingModule,
        AssessmentInstanceModule,
    ],
    declarations: []
})
export class AssessmentModule { }
