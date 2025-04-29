import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of, throwError, BehaviorSubject } from 'rxjs';
import { delay, materialize, dematerialize, map, finalize } from 'rxjs/operators';
import { AlertService } from '@app/_services';
import { Role, Account } from '@app/_models';
import { Router } from '@angular/router';

// Import environment or define apiUrl
const apiUrl = '/accounts'; // Default value if environment is not available

// array in local storage for accounts
const accountsKey = 'angular-17-signup-verification-boilerplate-accounts'; // Fixed spelling
let accounts = JSON.parse(localStorage.getItem(accountsKey) || '[]');

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    private accountSubject: BehaviorSubject<Account | null>;
    public account: Observable<Account | null>;
    private refreshTokenTimeout: any;
    
    constructor(
        private alertService: AlertService,
        private router: Router,
        private http: HttpClient // Added HttpClient
    ) {
        this.accountSubject = new BehaviorSubject<Account | null>(null);
        this.account = this.accountSubject.asObservable();
    }

    public get accountValue(): Account | null {
        return this.accountSubject.value;
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;
        const alertService = this.alertService;
        
        // Store instance reference to use in helper functions
        const self = this;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/accounts/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/accounts/refresh-token') && method === 'POST':
                    return refreshToken();
                case url.endsWith('/accounts/revoke-token') && method === 'POST':
                    return revokeToken();
                case url.endsWith('/accounts/register') && method === 'POST':
                    return register();
                case url.endsWith('/accounts/verify-email') && method === 'POST':
                    return verifyEmail();
                case url.endsWith('/accounts/forgot-password') && method === 'POST':
                    return forgotPassword();
                case url.endsWith('/accounts/validate-reset-token') && method === 'POST':
                    return validateResetToken();
                case url.endsWith('/accounts/reset-password') && method === 'POST':
                    return resetPassword();
                case url.endsWith('/accounts') && method === 'GET':
                    return getAccounts();
                case url.match(/\/accounts\/\d+$/) && method === 'GET':
                    return getAccountById();
                case url.endsWith('/accounts') && method === 'POST':
                    return createAccount();
                case url.match(/\/accounts\/\d+$/) && method === 'PUT':
                    return updateAccount();
                case url.match(/\/accounts\/\d+$/) && method === 'DELETE':
                    return deleteAccount();
                case url.match(/\/accounts\/\d+\/status$/) && method === 'PATCH':
                    return updateAccountStatus();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);                
            }
        }

        // Route functions
        function authenticate() {
            const { email, password } = body;
            const account = accounts.find((x: any) => x.email === email && x.password === password && x.isVerified);
            
            if (!account) return error('Email or password is incorrect');
            if (account.isActive === false) return error('Account is deactivated');
            
            // Add refresh token to account
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts))     
            
            const result = {
                ...basicDetails(account),
                refreshTokens: account.refreshTokens, // Add this line
                jwtToken: generateJwtToken(account)
            } as Account;
            
            // Use self to access class instance
            self.accountSubject.next(result);
            self.startRefreshTokenTimer();
            
            return ok(result);
        }

        function refreshToken() {
            const refreshToken = getRefreshToken();
            if (!refreshToken) return unauthorized();
            
            const account = accounts.find((x: any) => x.refreshTokens.includes(refreshToken));
            if (!account) return unauthorized();
            
            // Replace old refresh token with new one and save
            account.refreshTokens = account.refreshTokens.filter((x: string) => x !== refreshToken);
            account.refreshTokens.push(generateRefreshToken());
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            
            const result = {
                ...basicDetails(account),
                refreshTokens: account.refreshTokens, // Add this line
                jwtToken: generateJwtToken(account)
            } as Account;
            
            // Update account in subject using self
            self.accountSubject.next(result);
            self.startRefreshTokenTimer();
            
            return ok(result);
        }

        function revokeToken() {
            if (!isAuthenticated()) return unauthorized();
            
            const refreshToken = getRefreshToken();
            const account = accounts.find((x: any) => x.refreshTokens.includes(refreshToken));
            
            // Revoke token and save
            account.refreshTokens = account.refreshTokens.filter((x: string) => x !== refreshToken);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            
            // Clear account from subject and stop refresh timer using self
            self.stopRefreshTokenTimer();
            self.accountSubject.next(null);
            self.router.navigate(['/account/login']);
            
            return ok();
        }
        
        function register() {
            const account = body;
            
            if (accounts.find((x: { email: string }) => x.email === account.email)) {
                // Display email already registered "email" in alert
                setTimeout(() => {
                    alertService.info(`
                        <h4>Email Already Registered</h4>
                        <p>Your email ${account.email} is already registered.</p>
                        <p>If you don't know your password please visit the <a href="${location.origin}/account/forgot-password">forgot password</a> page.</p>)
                        <div><strong>Note:</strong> The fake backend displayed this "email" so you can test without an api. A real backend would send a real email.</div>
                        `, { autoClose: false });
                }, 1000);
                
                // Always return ok() response to prevent email enumeration
                return ok();
            }
            
            // Assign account id and a few other properties then save
            account.id = newAccountId();
            if (account.id === 1) {
                // First registered account is an admin
                account.role = Role.Admin;
            } else {
                account.role = Role.User;
            }
            account.dateCreated = new Date().toISOString();
            account.verificationToken = new Date().getTime().toString();
            account.isVerified = false;
            account.isActive = true; // Set initial active status
            account.refreshTokens = [];
            delete account.confirmPassword;
            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            
            // Display verification email in alert
            setTimeout(() => {
                const verifyUrl = `${location.origin}/account/verify-email?token=${account.verificationToken}`;
                alertService.info(`
                    <h4>Verification Email</h4>
                    <p>Thanks for registering</p>
                    <p>Please click the below link to verify your email address:</p>
                    <p><a href="${verifyUrl}">${verifyUrl}</a></p>
                    <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an api. A real backend would send a real email.</div>`,
                    { autoClose: false });      
            }, 1000);
            
            return ok();
        }

        function verifyEmail() {
            const { token } = body;
            const account = accounts.find((x: { verificationToken?: string }) => x.verificationToken && x.verificationToken === token);
            
            if (!account) return error('Verification failed');
            
            // Set isVerified flag to true if token is valid
            account.isVerified = true;
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            
            return ok();
        } 
            
        function forgotPassword() {
            const { email } = body;
            const account = accounts.find((x: { email: string }) => x.email === email);
          
            // Always return ok() response to prevent email enumeration
            if (!account) return ok();
          
            // Create reset token that expires after 24 hours
            account.resetToken = new Date().getTime().toString();
            account.resetTokenExpires = new Date(Date.now() + 24*60*60*1000).toISOString();
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
          
            // Display password reset email in alert
            setTimeout(() => {
                const resetUrl = `${location.origin}/account/reset-password?token=${account.resetToken}`;
                alertService.info(`
                    <h4>Reset Password Email</h4>
                    <p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                    <p><a href="${resetUrl}">${resetUrl}</a></p>
                    <div><strong>NOTE:</strong> The fake backend displayed this "email" so you can test without an api. A real backend would send a real email.</div>`,
                    { autoClose: false });
            }, 1000);
          
            return ok();
        }
          
        function validateResetToken() {
            const { token } = body;
            const account = accounts.find((x: { resetToken?: string, resetTokenExpires: string }) =>
                x.resetToken && x.resetToken === token &&
                new Date() < new Date(x.resetTokenExpires)
            );
          
            if (!account) return error('Invalid token');
          
            return ok();
        }
    
        function resetPassword() {
            const { token, password, confirmPassword } = body;
            const account = accounts.find((x: { resetToken?: string, resetTokenExpires: string }) =>
                !!x.resetToken && x.resetToken === token &&
                new Date() < new Date(x.resetTokenExpires)
            );
            
            if (!account) return error('Invalid token');
            
            // Update password and remove reset token
            account.password = password;
            account.isVerified = true;
            delete account.resetToken;
            delete account.resetTokenExpires;
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            
            return ok();
        }
        
        function getAccounts() {
            if (!isAuthenticated()) return unauthorized();
            return ok(accounts.map((x: any) => basicDetails(x)));
        }
        
        function getAccountById() {
            if (!isAuthenticated()) return unauthorized();
            
            const id = idFromUrl();
            if (!id) {
                return error('Account ID is required');
            }
            
            const account = accounts.find((x: any) => Number(x.id) === id);
            if (!account) return error('Account not found');
            
            const current = currentAccount();
            if (!current) return unauthorized();
            
            // User accounts can get own profile and admin accounts can get all profiles
            if (account.id !== current.id && !isAuthorized(Role.Admin)) {
                return unauthorized();
            }
            
            return ok(basicDetails(account));
        }

        function createAccount() {
            if (!isAuthorized(Role.Admin)) return unauthorized();
          
            const account = body;
            if (accounts.find((x: { email: string }) => x.email === account.email)) {
                return error(`Email ${account.email} is already registered`);
            }
          
            // Assign account id and a few other properties then save
            account.id = newAccountId();
            account.dateCreated = new Date().toISOString();
            account.isVerified = true;
            account.isActive = true; // Set initial active status
            account.refreshTokens = [];
            delete account.confirmPassword;
            accounts.push(account);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
          
            return ok();
        }
          
        function updateAccount() {
            if (!isAuthenticated()) return unauthorized();
          
            const params = body;
            const id = idFromUrl();
            const account = accounts.find((x: any) => Number(x.id) === id);
          
            if (!account) return error('Account not found');
            
            const current = currentAccount();
            if (!current) return unauthorized();
            
            // User accounts can update own profile and admin accounts can update all profiles
            if (account.id !== current.id && !isAuthorized(Role.Admin)) {
                return unauthorized();
            }
          
            // Only update password if included
            if (!params.password) {
                delete params.password;
            }
            // Don't save confirm password
            delete params.confirmPassword;
          
            // Update and save account
            Object.assign(account, params);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            
            // If updating current user account, update the accountSubject
            if (account.id === self.accountValue?.id) {
                // Create a complete Account object with all required properties
                const updatedAccount = { 
                    ...self.accountValue, 
                    ...basicDetails(account),
                    refreshTokens: self.accountValue ? self.accountValue.refreshTokens || [] : [] // Ensure refreshTokens is present
                } as Account;
                
                self.accountSubject.next(updatedAccount);
            }
          
            return ok(basicDetails(account));
        }

        function deleteAccount() {
            if (!isAuthenticated()) return unauthorized();
          
            const id = idFromUrl();
            if (!id) return error('Account ID is required');
            
            const account = accounts.find((x: any) => Number(x.id) === id);
            if (!account) return error('Account not found');
            
            const current = currentAccount();
            if (!current) return unauthorized();
          
            // User accounts can delete own account and admin accounts can delete any account
            if (account.id !== current.id && !isAuthorized(Role.Admin)) {
                return unauthorized();
            }
          
            // Delete account then save
            accounts = accounts.filter((x: any) => Number(x.id) !== id);
            localStorage.setItem(accountsKey, JSON.stringify(accounts));
            
            // If deleting own account, logout
            if (id.toString() === self.accountValue?.id) {
                self.stopRefreshTokenTimer();
                self.accountSubject.next(null);
                self.router.navigate(['/account/login']);
            }
            
            return ok();
        }

        function updateAccountStatus() {
            if (!isAuthorized(Role.Admin)) return unauthorized();

            const id = url.split('/')[url.split('/').length - 2];
            const { isActive } = body;

            // Convert id to number for comparison since we store IDs as numbers
            const account = accounts.find((x: any) => Number(x.id) === Number(id));
            
            if (!account) return error('Account not found');

            // Update account status
            account.isActive = isActive;
            localStorage.setItem(accountsKey, JSON.stringify(accounts));

            return ok(basicDetails(account));
        }

        // Helper functions
        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); // Delay observable to simulate server api call
        }
        
        function error(message: string) {
            return throwError(() => ({ error: { message } }))
                .pipe(materialize(), delay(500), dematerialize());
                // Call materialize and dematerialize to ensure delay even if an error is thrown
        }
        
        function unauthorized() {
            return throwError(() => ({ status: 401, error: { message: 'Unauthorized' } }))
                .pipe(materialize(), delay(500), dematerialize());
        }
        
        function basicDetails(account: any) {
            const { id, title, firstName, lastName, email, role, dateCreated, isVerified, isActive } = account;
            return { id, title, firstName, lastName, email, role, dateCreated, isVerified, isActive };
        }
        
        function isAuthenticated() {
            return !!currentAccount();
        }
        
        function isAuthorized(role: Role) {
            const account = currentAccount();
            if (!account) return false;
            return account.role === role;
        }
        
        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function newAccountId() {
            return accounts.length ? Math.max(...accounts.map((x: { id: number }) => x.id)) + 1 : 1;
        }
          
        function currentAccount() {
            // Check if jwt token is in auth header
            const authHeader = headers.get('Authorization');
            if (!authHeader || !authHeader.startsWith('Bearer fake-jwt-token')) return;
          
            try {
                // Check if token is expired
                const jwtToken = JSON.parse(atob(authHeader.split('.')[1]));
                const tokenExpired = Date.now() > (jwtToken.exp * 1000);
                if (tokenExpired) return;
            
                const account = accounts.find((x: { id: number }) => x.id === jwtToken.id);
                return account;
            } catch (error) {
                console.error("Error decoding JWT:", error);
                return undefined;
            }
        }
          
        function generateJwtToken(account: { id: number }) {
            // Create token that expires in 15 minutes
            const tokenPayload = {
                exp: Math.round(new Date(Date.now() + 15*60*1000).getTime() / 1000),
                id: account.id
            }
            return `fake-jwt-token.${btoa(JSON.stringify(tokenPayload))}`;
        }
          
        function generateRefreshToken() {
            const token = new Date().getTime().toString();
          
            // Add token cookie that expires in 7 days
            const expires = new Date(Date.now() + 7*24*60*60*1000).toUTCString();
            document.cookie = `fakeRefreshToken=${token}; expires=${expires}; path=/`;
          
            return token;
        }

        function getRefreshToken() {
            // Get refresh token from cookie
            return (document.cookie.split('; ').find(x => x.includes('fakeRefreshToken')) || '=').split('=')[1];
        }
    }

    // Token refresh methods
    private startRefreshTokenTimer() {
        if (!this.accountValue?.jwtToken) return;
        
        try {
            const jwtToken = JSON.parse(atob(this.accountValue.jwtToken.split('.')[1]));
            const expires = new Date(jwtToken.exp * 1000);
            const timeout = expires.getTime() - Date.now() - (60 * 1000);
            this.refreshTokenTimeout = setTimeout(() => {
                this.http.post<any>(`${apiUrl}/refresh-token`, {}, { withCredentials: true })
                    .subscribe((account: any) => {
                        this.accountSubject.next(account);
                        this.startRefreshTokenTimer();
                    });
            }, timeout);
        } catch (error) {
            console.error("Error starting refresh token timer:", error);
        }
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}

export let fakeBackendProvider = {
    // Use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};