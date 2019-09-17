import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ParameterInputterComponent } from "./parameter-inputter.component";
import { AssessmentTemplateToParameterTemplatesService } from "src/app/services/assessment-template-to-parameter-templates.service";
import { UnitConversionService } from "src/app/services/shared/unit-conversion.service";
import { UnitService } from "src/app/services/unit.service";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  declarations: [
    ParameterInputterComponent
  ],
  exports: [
    ParameterInputterComponent
  ],
  providers:[
    DatePipe,
    AssessmentTemplateToParameterTemplatesService,
    UnitConversionService,
    UnitService
  ]
})
export class ParameterInputterModule { }