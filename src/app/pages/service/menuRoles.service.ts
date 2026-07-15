import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuRolesService {
  private apiUrl = environment.apiUrl + "api/MenuRoles/";

  constructor(private http: HttpClient) {}

  getMenuByRole(roleId: number): Observable<any> {
    const params = { roleId: roleId?.toString() };
    return this.http.get<any>(`${this.apiUrl}Menu/Role`,{ params });
  }
  getUserPriviliges(roleId: number, menuId: number): Observable<any> {
    const params = { roleId: roleId?.toString(), menuId: menuId?.toString() };
    return this.http.get<any>(`${this.apiUrl}User/Privillige`,{ params });
  }
  getMenuRole(): Observable<any> {
      return this.http.get(this.apiUrl + "roles/menus");
  }
  getMenus(): Observable<any> {
      return this.http.get(this.apiUrl + "menus");
  }
  saveMenuRoles(data : any):Observable<any>{
      return this.http.post(this.apiUrl + "save/role/menu",data);
  }
  getmenuTree(menuId: number = 0): Observable<any> {
      const params = { menuId: menuId?.toString() };
      return this.http.get(this.apiUrl + `Menu/Tree`,{ params });
  }
  saveMenu(data : any):Observable<any>{
      return this.http.post(this.apiUrl + "menu/entry",data);
  }
}

