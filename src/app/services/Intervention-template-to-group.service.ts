import { Injectable } from '@angular/core';
import { AbstractService } from './abstract.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataConnService } from './shared/data-conn.service';
import { InterventionGroup } from '../models/interventionGroup';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class InterventionTemplateToGroupService extends AbstractService<InterventionGroup>{


  constructor(http: HttpClient, protected dataConnService: DataConnService) {
    super(http, dataConnService)
  }

  public getService(): string {
    return 'InterventionTemplateToGroup';
  }

  public GetGroupsAndTemplates() {
    var promise = new Promise<InterventionGroup[]>((resolve, reject) => {
      const url = this.urlBase + "/GroupsAndTemplates";
      this.http.get(url, httpOptions).toPromise()
        .then((r: InterventionGroup[]) => {
          resolve(r)
        })
    })
    return promise;
  }


}
