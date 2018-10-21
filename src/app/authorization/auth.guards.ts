import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log(route.routeConfig.path);

        if (localStorage.getItem('currentUser') != null && localStorage.getItem('currentUser') != "null") {
            console.log(route.routeConfig.path + "true");
            // logged in so return true
            return true;
        }
        console.log(route.routeConfig.path + "false");

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        return false;
    }
}

@Injectable()
export class LoginGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log(route.routeConfig.path);

        if (localStorage.getItem('currentUser') != null && localStorage.getItem('currentUser') != "null") {
            console.log(route.routeConfig.path + "true");
            // logged in so return true
            this.router.navigate(['/do']);
            return false;
        }
        console.log(route.routeConfig.path + "false");

        return true;
    }
}