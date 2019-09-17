import { Injectable } from '@angular/core';
import { Person } from '../models/person';
import { AbstractService } from './abstract.service';
import { DataConnService } from './shared/data-conn.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class PersonService extends AbstractService<Person>{


  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public getService(): string {
    return 'persons';
  }
}
