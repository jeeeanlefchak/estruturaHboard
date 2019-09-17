import { Injectable} from '@angular/core';
import { UnitService } from '../unit.service';
import { Unit } from '../../models/unit';

@Injectable()
export class UnitConversionService {

  private unitRelations: Array<UnitRelation>;
  private matchUnit: UnitRelation;
  private reverse: boolean = false;
  
  constructor(
    private _unitService: UnitService,
  ){
    
  }

  public async convertValue(idFrom: number, idTo: number, value: number, responseType?: string):Promise<any>{
    let response: ConvertObject = new ConvertObject();

    if(idFrom == idTo){
      response.value = value;
      response.msg = '';
      return response;
    }
    // await this.getAllRelations();
    
    this.matchUnit = this.findMatchUnit(idFrom, idTo);
    if(!this.matchUnit){
      this.matchUnit = this.findMatchReverse(idFrom,idTo);
    }

    if(!this.matchUnit){
      // await this.getAllRelations();
      this.matchUnit = this.findMatchUnit(idFrom, idTo);
      if(!this.matchUnit){
        this.matchUnit = this.findMatchReverse(idFrom,idTo);
      }
      if(!this.matchUnit){
        response.value = 0;
        response.msg = 'Could not find the conversion factor!'
      }
    }else{
      if(this.reverse){
        response.value = Number((value * this.matchUnit.counterpartProportion).toFixed(2));
      }else{
        response.value = Number((value / this.matchUnit.counterpartProportion).toFixed(2)); 
      }
      response.msg = null;
    }

    switch(responseType){
      case 'in/4':
        response.numIntPart = Math.floor(response.value);
        let decPart = Number((response.value % 1).toFixed(2));
        if(decPart > 0){
          if(decPart < 0.20){
            response.numDecPart = 0;
          }else if(decPart >= 0.20 && decPart <= 0.25){
            response.numDecPart = 0.25;
          }else if(decPart > 0.25 && decPart <=0.5){
            response.numDecPart = 0.5;
          }else if(decPart > 0.5 && decPart <=0.75){
            response.numDecPart = 0.75;
          }else if(decPart > 0.75 && decPart <= 0.85){
            response.numDecPart = 0.75;
          }else if(decPart > 0.85){
            response.numIntPart += 1;
            response.numDecPart = 0;
          }
        }else{
          response.numDecPart = 0;
        }
        break;
      case 'lb/oz':
        response.numIntPart = Math.floor(response.value);
        response.numDecPart = Math.round(Number((response.value % 1).toFixed(2)) * 16);
        break;
    }    
    return response;
  }

  private findMatchUnit(idFrom, idTo){
    if(this.unitRelations){
      this.reverse = false;
      return this.unitRelations.find(x => x.partId == idFrom && x.counterPartId == idTo);
    }else{
      this.reverse = false;
      return null;
    }
  }

  private findMatchReverse(idFrom, idTo){
    if(this.unitRelations){
      let unit = this.unitRelations.find(x=> x.partId == idTo && x.counterPartId == idFrom);
        if(unit) this.reverse = true;
      return unit;
    }else{
      this.reverse = false;
      return null;
    }
  }

  // private async getAllRelations(){
//     await this._unitService.getAllRelations()
//       .then(res =>{
//         if(res){
//           this.unitRelations = res;
//         }
//       })
//       .catch(err =>{
//         console.error('Error while getting unit relations: ', err);
//       })
//   }
}


export class UnitRelation{
  id: number;
  partId: number;
  counterPartId: number;
  partProportion: number;
  counterpartProportion: number;
  part: Unit;
  counterPart: Unit;
}

export class ConvertObject {
  value: number;
  numIntPart: number;
  numDecPart: number;
  msg: string;
}