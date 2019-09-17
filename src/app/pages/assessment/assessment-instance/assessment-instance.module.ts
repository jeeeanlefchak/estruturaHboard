import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { AssessmentInstanceComponent } from "./assessment-instance.component";
import { ParameterInputterModule } from "../parameter-inputter/parameter-inputter.module";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParameterInputterModule
  ],
  declarations: [
    AssessmentInstanceComponent
  ],
  exports: [
    AssessmentInstanceComponent
  ],
  providers:[DatePipe]
})
export class AssessmentInstanceModule { }