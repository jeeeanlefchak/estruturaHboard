import { EventEmitter } from "@angular/core";

export class EventService {

  private static emitters: {
    
    [nameEvent: string]: EventEmitter<any>;
  
  } = {};

  static get(nameEvent: string): EventEmitter<any> {
    if (!this.emitters[nameEvent]) {
      this.emitters[nameEvent] = new EventEmitter<any>();
    }
    return this.emitters[nameEvent];
  }

}
