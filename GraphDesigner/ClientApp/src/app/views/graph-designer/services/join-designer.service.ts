import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JoinDesignerService {

  constructor(private http: HttpClient) { }
  GetJoinDataSetSchemas(Id:number|string): Observable<any> {
    return this.http.get(`${this.baseUrl()}/UI/JoinDesigner/GetJoinDataSetSchemas/${Id}`);
  }
  GetLayerMaintableSelectOptions(Id:number|string): Observable<any> {
    return this.http.get(`${this.baseUrl()}/UI/JoinDesigner/LayerMaintableSelectOptions/${Id}`);
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
