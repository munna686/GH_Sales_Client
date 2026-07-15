import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ApiResponse<T> {
  statusCode: number;
  message: string | null;
  objectId: string | null;
  data: T;
}

export interface UserTransPolicyDTO {
  transPolicyId: number;
  policyName: string;
  mopFromDate: string;
  mopToDate: string;
  aopPolicyId: number;
  aopBwDays: number;
  aopFwDays: number;
  isActive: boolean;
  workFollowPosition: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserTransPolicyService {
  private readonly apiUrl = environment.apiUrl + 'api/UserTransPolicy';

  constructor(private http: HttpClient) {}

  getByTransPolicyId(transPolicyId: number): Observable<ApiResponse<UserTransPolicyDTO[]>> {
    const params = new HttpParams().set('transPolicyId', transPolicyId.toString());
    return this.http.get<ApiResponse<UserTransPolicyDTO[]>>(`${this.apiUrl}/By`, { params });
  }
}
