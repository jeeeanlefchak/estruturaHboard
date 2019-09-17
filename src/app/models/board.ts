import { BoardRecord } from './BoardRecord';
import { Base } from "./base";

export class Board extends Base{
    name: string;
    displayName: string;
    description: string;
    sectorId: number;
    settings: Object;
    uid: string;
    modifiedOn: Date;
    rowData: BoardRecord[];
}