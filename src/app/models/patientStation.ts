import { PatientStationGroup } from './patientStationGroup';
import { StationStatus } from './stationStatus';
import { Base } from './base';
export class PatientStation extends Base{
    roomId: number;
    name: string;
    shortName: string;
    description: string;
    activatedOn: Date;
    inactivatedOn: Date;    
    Status: StationStatus[];
    StationGroups: PatientStationGroup[];
}
