import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataConnService } from './shared/data-conn.service';
import { AssessmentInstance } from '../models/assessmentInstance';
import { AbstractService } from './abstract.service';
import { AssessmentTemplate } from '../models/assessmentTemplate';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AssessmentTemplateService extends AbstractService<AssessmentTemplate>{

  public getService(): string {
    return 'assessmenttemplates';
  }

  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

}