import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { StorageUtil } from '@/utility/StorageUtil';
import { UserPrivilege } from '@/Model/user-privilege.model';

@Injectable({ providedIn: 'root' })
export class RouteGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  private isLoggedIn(): boolean {
    const user = StorageUtil.getItem('user');
    const privilege = StorageUtil.getItem<UserPrivilege | UserPrivilege[]>('privilege');
    return !!user && !!privilege; // Check if user and privilege exist in storage
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.isLoggedIn()) return true;
    return this.router.parseUrl('/access-denied');
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.canActivate(route, state);
  }
}
