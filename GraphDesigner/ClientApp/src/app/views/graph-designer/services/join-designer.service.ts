import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JoinDesignerService {

  constructor(private http: HttpClient) { }
  GetJoinDesignDragOptions(Id:number|string): Observable<any> {
    return this.http.get(`${this.baseUrl()}/UI/JoinDesigner/GetJoinDesignDragOptions/${Id}`);
  }
  GetLayerMaintableSelectOptions(Id:number|string): Observable<any> {
    return this.http.get(`${this.baseUrl()}/UI/JoinDesigner/LayerMaintableSelectOptions/${Id}`);
  }
  GetJoinDesignLayers(ProjectId:number|string): Observable<any> {
    return this.http.get(`${this.baseUrl()}/UI/JoinDesigner/GetJoinDesignLayers/${ProjectId}`);
  }
  SaveJoinDesign(ProjectId:number|string, body:any): Observable<any> {
    return this.http.patch(`${this.baseUrl()}/UI/JoinDesigner/SaveJoinDesign/${ProjectId}`,body);
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
