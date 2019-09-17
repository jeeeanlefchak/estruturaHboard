import { AssessmentInstance } from "./assessmentInstance";
import { Patient } from "./patient";
import { Station } from "./station";
import { Admission } from "./admission";

export class AsessmentEditorParams{
  action?: string;
  assessmentInstance?: AssessmentInstance;
  assessmentTemplateId?: number;
  patient?: Patient;
  room?: Station;
  admission?: Admission;
}