import { Patient } from './patient';
import { Room } from './room';

export class AssessmentParams {
  id : number = 0;
  admissionId: number;
  objectType: ObjectTypes; //enum: 0 none; 1 person; 2 patient; 3 player; 4 user; 5 contact; 6 concept; 11 institution; 12 outras derivaçoes de institution ; 21 equipments...etc. There are assessment templates that can be used for patients and concepts. In this case use assessment_template.object_type=person. But there are assessments that may be used only by concpets, in this case use assessment_template.object_type=concept, so you can filter different assessment templates depending on the context. But we also need object type here because in the case we have assessment_template.object_type=person, it means that we need to specify if the instance is being used for a patient or for a concept (both are persons).
  objectId: number;
  assessmentInstanceUid: string;
  patient: Patient;
  room: Room;
  action: string;
}

export enum ObjectTypes {
  None = 0,
  Person = 1,
  Patient = 2,
  Player = 3,
  User = 4,
  Contact = 5,
  Concept = 6,
  Institutions = 11,
  Equipments = 21
}