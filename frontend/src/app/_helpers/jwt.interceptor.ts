import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

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
        
        console.log(`JWT Interceptor - Request to: ${request.url}`);
        console.log(`JWT Interceptor - Is API URL: ${isApiUrl}, Is Logged In: ${!!isLoggedIn}`);
        
        if (isLoggedIn && isApiUrl) {
            console.log(`JWT Interceptor - Adding JWT token for user: ${account.email}, Role: ${account.role}`);
            
            // Make sure we have the most up-to-date JWT token
            const latestAccount = this.accountService.accountValue;
            const token = latestAccount?.jwtToken || account.jwtToken;
            
            // Check if token exists before adding it
            if (token) {
                // Clone the request with necessary headers for the backend
                request = request.clone({
                    setHeaders: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });
                
                console.log('JWT Interceptor - Request modified with token');
            } else {
                console.error('JWT Interceptor - Token was missing even though user is logged in');
            }
        } else if (isApiUrl) {
            console.warn(`JWT Interceptor - API request without authentication: ${request.url}`);
            
            // We should still ensure content-type is set for API requests
            if (!request.headers.has('Content-Type')) {
                request = request.clone({
                    setHeaders: {
                        'Content-Type': 'application/json'
                    }
                });
            }
        }

        return next.handle(request).pipe(
            tap({
                // Log success cases for debugging
                next: (event) => {
                    if (event.type !== 0) { // Skip request events which have type
                        console.log(`JWT Interceptor - Response for ${request.url}:`, event);
                    }
                }
            }),
            catchError((error: HttpErrorResponse) => {
                // Handle specific authentication errors
                if (error.status === 401) {
                    console.error('JWT Interceptor - Authentication error (401):', error);
                    
                    // Only log out if we tried to use a token and it failed
                    if (isLoggedIn && isApiUrl) {
                        console.warn('JWT Interceptor - Token is invalid or expired, logging out user');
                        // We don't auto-logout here to avoid interrupting the user
                        // Instead we return a clear error that the UI can handle
                    }
                } else if (error.status === 403) {
                    console.error('JWT Interceptor - Authorization error (403):', error);
                }
                
                return throwError(() => error);
            })
        );
    }
}