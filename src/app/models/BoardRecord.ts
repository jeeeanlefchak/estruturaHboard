import { CareTransferItem } from './careTransferItem';
import { Station } from "./station";
import { Patient } from "./patient";
import { Admission } from "./admission";
import { Player } from "./player";
import { AssessmentInstance } from "./assessmentInstance";
import { Condition } from "./condition";
import { InterventionInstance } from "./interventionInstance";
import { Note } from "./note";

export class BoardRecord{
    id: number;
    uid: string;
    room: any;
    station: Station;
    patient: Patient;
    admission: Admission;
    nursing: Player[];
    physician: Player[];
    pregnancy: AssessmentInstance[];
    conditions: Condition[];
    cervicalExam: AssessmentInstance[];
    membranes: AssessmentInstance[];
    interventions: InterventionInstance[];
    delivery: AssessmentInstance[];
    pain: AssessmentInstance[];
    notes: Note[];
    careTransferItem: CareTransferItem;
}