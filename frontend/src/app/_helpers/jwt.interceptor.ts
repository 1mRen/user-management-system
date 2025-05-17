import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment} from '@environments/environment';
import { AccountService } from '@app/_services';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private accountService: AccountService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if account is logged in and request is to the api url
        const account = this.accountService.accountValue;
        const isLoggedIn = account && account.jwtToken;
        const isApiUrl = request.url.startsWith(environment.apiUrl);
        
        console.log(`Request to: ${request.url}`);
        console.log(`Is API URL: ${isApiUrl}, Is Logged In: ${isLoggedIn}`);
        
        if (isLoggedIn && isApiUrl) {
            console.log(`Adding JWT token for user: ${account.email}, Role: ${account.role}`);
            request = request.clone({
                setHeaders: { Authorization: `Bearer ${account.jwtToken}` }
            });
        } else if (isApiUrl) {
            console.log('No JWT token available for API request');
        }

        return next.handle(request);
    }
}