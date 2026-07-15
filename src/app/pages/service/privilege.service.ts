import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrivilegeService {
  private apiUrl = 'https://localhost:7098/api/Privilege/User';

  constructor(private http: HttpClient) { }

  checkPermission(userId: number, moduleId: number): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('moduleId', moduleId.toString());
    return this.http.get<any>(this.apiUrl, { params });
  }
}
