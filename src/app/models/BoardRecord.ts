import { CareTransferItem } from './careTransferItem';
import { Station } from "./station";
import { Patient } from "./patient";
import { Admission } from "./admission";
import { Player } from "./player";
import { AssessmentInstance } from "./assessmentInstance";
import { Condition } from "./condition";
import { InterventionInstance } from "./interventionInstance";
import { Note } from "./note";
import { Team } from './team';

export class BoardRecord{
    id: number;
    uid: string;
    room: any;
    station: Station;
    patient: Patient;
    admission: Admission;
    nursing: Player[];
    physician : Physician;
    pregnancy: AssessmentInstance;
    conditions: Condition[];
    cervicalExam: AssessmentInstance;
    membranes: AssessmentInstance;
    interventions: InterventionInstance[];
    delivery: AssessmentInstance;
    pain: AssessmentInstance;
    notes: Note[];
    careTransferItem: CareTransferItem;
}
export class Physician {
  physicians: Player[] = [];
  teams: Team[] = [];
}