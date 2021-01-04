import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProjectEditDB } from '../models/project-editor';

@Injectable({
  providedIn: 'root'
})
export class ProjectEditorService {
  constructor(private http: HttpClient) { }
  GetDataSetEdit(Id:string|number): Observable<any> {
    return this.http.get(`${this.baseUrl()}/UI/ProjectEditor/GetDataSetEdit/${Id}`);
  }

  SaveProjectEdit(body:{project:IProjectEditDB,projectDataIds:number[]}): Observable<any> {
    return this.http.patch(`${this.baseUrl()}/UI/ProjectEditor/SaveProjectEdit`,body);
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