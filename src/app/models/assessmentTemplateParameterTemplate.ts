import { AssessmentInstance } from './assessmentInstance';
import { Base } from './base';
import { AssessmentTemplateParameterOptionSet } from './assessmentTemplateParameterOptionSet';
import { AssessmentTemplateParameter } from './assessmentTemplateParameter';
import { AssessmentTemplateParameterOption } from './assessmentTemplateParameterOption';
import { AssessmentParameterInstance } from './assessmentParameterInstance';
export class AssessmentTemplateParameterTemplate extends Base {
    assessmentTemplateId: number;
    assessmentTemplateParameterId: number;
    name: string;
    shortName: string;
    displayName: string;
    defValueSource: number;
    defUnit: any;
    defUnitId: number;
    sortIndex: number;
    optionSetId: number;
    activatedOn: Date;
    optionSet: AssessmentTemplateParameterOptionSet;
    options: AssessmentTemplateParameterOption[];
    parameter: AssessmentTemplateParameter;
    //assessmentInstance: AssessmentInstance;
    parameterInstance: AssessmentParameterInstance;
    jsInputSettings: any;
    dataType: number;
    cssClassContent: string;
    cssClassId: number;
    inputType: number;
    inputSettings: string;
    required: boolean;
    maxValue: number;
    minResultRequired: number;
    minValue: number;
    step: number;
    storeUnitId: number;
    settings: any;
    inputTypeMobile: number;
    uid : string;
    // resultOption? : any;
}
