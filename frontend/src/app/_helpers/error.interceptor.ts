import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { AccountService } from '@app/_services';
import { environment } from '@environments/environment';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private accountService: AccountService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.error(`Error interceptor caught error (${err.status}):`, err);
            
            // Check if it's a refresh token request that failed with 401
            const isRefreshTokenRequest = request.url.includes('/refresh-token');
            const isApiUrl = request.url.startsWith(environment.apiUrl);
            
            if (err.status === 401 && this.accountService.accountValue) {
                if (isRefreshTokenRequest) {
                    // If a refresh token request fails with 401, the token is invalid - logout
                    console.log('Token refresh failed with 401, logging out user');
                    this.accountService.logout();
                } else if (isApiUrl) {
                    // For other API requests, try to refresh the token first if possible
                    console.log('API request failed with 401, redirecting to login');
                    
                    // Redirect to login but don't logout to preserve the return URL
                    this.router.navigate(['/account/login'], { 
                        queryParams: { returnUrl: this.router.url }
                    });
                }
            } else if (err.status === 403 && this.accountService.accountValue) {
                console.error('User not authorized (403 Forbidden)');
                // Optionally redirect to an access denied page
            }

            // Get the error message from the response or use a default
            let errorMessage = 'An unknown error occurred';
            if (err.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = err.error.message;
            } else if (err.error?.message) {
                // API error with message
                errorMessage = err.error.message;
            } else if (err.statusText) {
                // HTTP status text
                errorMessage = err.statusText;
            }
            
            console.error('Error details:', errorMessage);
            return throwError(() => err);
        }));
    }
}