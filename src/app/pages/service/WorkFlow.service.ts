import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from './user-trans-policy.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {

  private apiUrl = environment.apiUrl + 'api/Workflow/';

  constructor(private http: HttpClient) {}

  processWorkFlow(
    userId: number,
    moduleId: number,
    tableId: number,
    pkId: number,
    workId: number,
    action: number,
    workNote: string
  ): Observable<ApiResponse<string>> {

    let params = new HttpParams()
      .set('userId', userId)
      .set('moduleId', moduleId)
      .set('tableId', tableId)
      .set('pkId', pkId)
      .set('workId', workId)
      .set('action', action)
      .set('workNote', workNote ?? '');

    return this.http.post<ApiResponse<string>>(
      this.apiUrl + 'process',
      null,
      { params }
    );
  }
}