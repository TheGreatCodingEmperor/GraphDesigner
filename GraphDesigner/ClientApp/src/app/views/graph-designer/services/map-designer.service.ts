import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapDesignerService {
  constructor(private http: HttpClient) { }

  GetMap(ProjectId:string|number): Observable<any> {
    return this.http.get(`${this.baseUrl()}/UI/MapDesigner/map/${ProjectId}`);
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
