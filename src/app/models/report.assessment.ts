import { Report } from "./report";

export class ReportAssessment{
    
    public patientId : number;
    public patientName : string;
    public date : Date;
    public assessmentResults : Report[] = [];

}