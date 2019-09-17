import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataConnService } from './shared/data-conn.service';
import { AbstractService } from './abstract.service';
import { AssessmentParameterTemplateToAssessmentTemplate } from '../models/assessmentParameterTemplateToAssessmentTemplate';
import { AssessmentTemplateService } from './assessment-templete.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AssessmentParameterTemplateToAssessmentTemplateService extends AbstractService<AssessmentParameterTemplateToAssessmentTemplate>{

  public getService(): string {
    return 'assessmenttemplates';
  }

  constructor(http: HttpClient, protected dataConnService: DataConnService, private _assessmentTemplateService: AssessmentTemplateService) {
    super(http, dataConnService)
  }

  public getFromParameterId(parameterId: number) {
    const url = '/byparameterid/' + parameterId;
    return this.http.get(url, httpOptions).toPromise();
  }

  public getByParameterId(parameterId: number): Promise<AssessmentParameterTemplateToAssessmentTemplate[]> {
    var promise = new Promise<AssessmentParameterTemplateToAssessmentTemplate[]>((resolve, reject) => {
      this.getFromParameterId(parameterId).then((r: any[]) => {
        let index: number = 1;
        r.forEach((e: AssessmentParameterTemplateToAssessmentTemplate) => {
          this._assessmentTemplateService.getById(e.template.id).then(res => {
            let template = res;
            e.template = { ...template }
            if (index == r.length) {
              resolve(r);
            }
            index++;
          });
        });

      }).catch(e => reject(e));

    });
    return promise;
  }

}