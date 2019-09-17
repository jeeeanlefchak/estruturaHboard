import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { HttpClient } from '@angular/common/http';
import { DataConnService } from './shared/data-conn.service';

@Injectable()
export class AssessmentTemplateToParameterTemplatesService extends AbstractService<any> {

  // options = new RequestOptions({
  //   withCredentials: false
  // });

  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService);
  }


  public getService(): string {
    return 'assessmentTemplateToParameterTemplates';
  }

  public getInputSettings(id: number) {
    return this.http.get(this.urlBase + '/' + id + '/InputSettings')
      .toPromise();
  }

  public async getUnits(id: number) {
    return await this.http.get(this.urlBase + '/' + id + '/GetUnits')
      .toPromise();
  }

}
