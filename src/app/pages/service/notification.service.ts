import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environment.apiUrl + "api/Notification/";

  constructor(private http: HttpClient) {}

    getNotifications(employeeId: number): Observable<any> {
      const params = new HttpParams()
      .set('employeeId', employeeId.toString());
      return this.http.get<any>(`${this.apiUrl}`, { params });
  }


}
