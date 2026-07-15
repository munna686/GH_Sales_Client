import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { StorageUtil } from '@/utility/StorageUtil';
import { PrivilegeService } from '@/pages/service/privilege.service';

@Injectable({ providedIn: 'root' })
export class PermissionGuard implements CanActivate {
  constructor(
    private router: Router,
    private privilegeService: PrivilegeService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> {
    const user: any = StorageUtil.getItem('user');
    const userId = Number(user?.userId ?? user?.id ?? 0);

    if (!userId) {
      return this.router.parseUrl('/');
    }

    if (Number(user?.adminPrivilegeType) === 1) {
      return true;
    }

    const menuId = Number(route.data?.['menuId'] ?? 0);
    if (!menuId) {
      return true;
    }

    return this.privilegeService.checkPermission(userId, menuId).pipe(
      map((res) => {
        const ok = res?.statusCode === 200;
        return ok ? true : this.router.parseUrl('/access-denied');
      }),
      catchError(() => of(this.router.parseUrl('/access-denied')))
    );
  }
}
