import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectManagerService {

  constructor(
    protected http:HttpClient
  ) { }

  GetProjectList():Observable<any>{
    return this.http.get(`${this.baseUrl()}/UI/ProjectManager/ProjectMangerList`);
  }

  GetDatasetList():Observable<any>{
    return this.http.get(`${this.baseUrl()}/UI/ProjectManager/DatasetList`);
  }

  RemoveProject(projectId:number): Observable<any> {
    return this.http.delete(`${this.baseUrl()}/UI/ProjectManager/RemoveProject/${projectId}`);
  }
  
  public baseUrl() {
    let base = '';

    if (window.location.origin) {
      base = window.location.origin;
    } else {
      base = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
    }

    return base.replace(/\/$/, '');
  }
}
