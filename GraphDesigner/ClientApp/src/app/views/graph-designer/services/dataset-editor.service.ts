import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDataSetEditDB, IDataSetEditUI } from '../models/dataset-editor';

@Injectable({
  providedIn: 'root'
})
export class DatasetEditorService {

  constructor(private http: HttpClient) { }
  GetDataSetEdit(Id:number|string): Observable<any> {
    return this.http.get(`${this.baseUrl()}/UI/DataSetEditor/GetDataSetEdit/${Id}`);
  }
  SaveDataSetEdit(body:IDataSetEditDB): Observable<any> {
    return this.http.patch(`${this.baseUrl()}/UI/DataSetEditor/SaveDataSetEdit`,body);
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
