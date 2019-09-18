import { AdmissionPlayerFte } from './admissionPlayerFte';
import { AdmissionEvent } from './admissionEvent';
import { Base } from './base';
import { AdmissionSetting } from './admissionSetting';
import { Patient } from './patient';
import { CssClass } from './cssClass';

export class Admission extends Base {
  patientId: number;
  assistantPlayerId: number;
  admittedOn: Date;
  dischargedOn: Date;
  plannedDischargeOn: Date;
  plannedDischargeComments: string;
  dischargeOrderOn: Date;
  dischargeOrderBy: number;
  settings: AdmissionSetting[];
  admissionEvents: AdmissionEvent[];
  patient: Patient;
  comments: string;
  rowBkgroundColorCssId: number;
  rowBkgroundColorCss: CssClass;
  rowBkgColor?: string;
  history: any;

  priority: Priority;
  stage : Stage;
  fte : Fte;
  //playersFte: AdmissionPlayerFte[];
}

class Priority {
  shortName: string;
  color : string;
}
class Stage{
  shortName: string;
  color : string;
}
class Fte{
  shortName : string;
}