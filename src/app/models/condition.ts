import { ConditionTemplate } from './conditionTemplate';
import { AssessmentInstance } from './assessmentInstance';
import { Base } from './base';
import { CRUDAction } from './publicEnums';
import { ConditionPresence } from './conditionPresence';
export class Condition extends Base {
    conditionTemplate: ConditionTemplate;
    conditionTemplateId: number;
    regardingToCode: number;
    regardingToType: number;
    assessments: AssessmentInstance[]; //collection of condition events where type = 'assessments'
    crudAction: CRUDAction;
    presence: any; //propriedade virtual usada na tela de admission para renderizar datas de inicio e fim da ultima presença
    presences: ConditionPresence[];
    index?: number;
    lastIndex?: number;
    consitionSetingId?: [] = [];
}
