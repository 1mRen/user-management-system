import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AccountService } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
    constructor(
        private router: Router,
        private accountService: AccountService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const account = this.accountService.accountValue;
        console.log('==================== AUTH GUARD CALLED ====================');
        console.log('Route:', route.url.map(segment => segment.path).join('/'));
        console.log('Full URL:', state.url);
        console.log('Account present:', !!account);
        
        if (account) {
            console.log('User role:', account.role);
            console.log('Route requires roles:', route.data['roles']);
            
            //check if route is restricted by role
            if (route.data['roles'] && !route.data['roles'].includes(account.role)) {
                // role not authorized so redirect to home page
                console.log('Role not authorized, redirecting to home');
                this.router.navigate(['/']);
                return false;
            }

            // authorized so return true
            console.log('User authorized to access route');
            return true;
        }

        // not logged in so redirect to login page with the return url
        console.log('User not logged in, redirecting to login');
        this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
