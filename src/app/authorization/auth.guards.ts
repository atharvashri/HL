import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AppUtil } from '../utils/app.util';
import { ROUTES } from '../components/sidebar/sidebar.component';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currRole = localStorage.getItem('currentRole');
        if(!currRole || currRole === "null"){
          // not logged in so redirect to login page with the return url
          this.router.navigate(['/login']);
          return false;
        }

        if (this.isAuthorized(route.routeConfig.path, currRole)) {
            // logged in so return true
            return true;
        }else{
            this.router.navigate([AppUtil.defaultLandingRoute(currRole)]);
            return false;
        }
    }

    isAuthorized(path, currRole){
      //doing substring from 1 because in ROUTES path starts from '/' so we need to ignore it for perfect match
      const route = ROUTES.find(item => item.path.substring(1) === path);
      return route ? route.roles.some(item => item === currRole) : false;
    }
}

@Injectable()
export class LoginGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currRole = localStorage.getItem('currentRole');
        if (currRole != null && currRole != "null") {
            // logged in so return false
            this.router.navigate([AppUtil.defaultLandingRoute(currRole)]);
            return false;
        }

        return true;
    }
}
