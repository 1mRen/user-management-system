import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, finalize } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Account } from '@app/_models';

const baseUrl = `${environment.apiUrl}/accounts`;
const ACCOUNT_KEY = 'currentAccount'; // Local storage key

@Injectable({ providedIn: 'root' })
export class AccountService {
    private accountSubject: BehaviorSubject<Account | null>;
    public account: Observable<Account | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        // Try to load the account from localStorage on service initialization
        let storedAccount: Account | null = null;
        try {
            const storedData = localStorage.getItem(ACCOUNT_KEY);
            if (storedData) {
                storedAccount = JSON.parse(storedData);
                console.log('Found saved account in localStorage');
            }
        } catch (e) {
            console.error('Error loading account from localStorage:', e);
            localStorage.removeItem(ACCOUNT_KEY);
        }

        this.accountSubject = new BehaviorSubject<Account | null>(storedAccount);
        this.account = this.accountSubject.asObservable();
        
        // If we have a stored account, start the refresh timer
        if (storedAccount?.jwtToken) {
            console.log('Starting refresh token timer for stored account');
            this.startRefreshTokenTimer();
        }
    }

    public get accountValue(): Account {
        return this.accountSubject.value!;
    }

    login(email: string, password: string) {
        return this.http.post<Account>(`${baseUrl}/login`, { email, password }, { withCredentials: true })
            .pipe(map(account => {
                this.storeAccount(account);
                this.startRefreshTokenTimer();
                return account;
            }));
    }

    logout() {
        this.http.post(`${baseUrl}/logout`, {}, { withCredentials: true })
            .pipe(
                finalize(() => {
                    // These actions will run regardless of success/failure
                    this.clearAccount();
                })
            )
            .subscribe({
                error: error => {
                    console.error('Logout error:', error);
                    // Still proceed with local logout even if API call fails
                }
            });
    }

    refreshToken() {
        return this.http.post<Account>(`${baseUrl}/refresh-token`, {}, { withCredentials: true })
            .pipe(map(account => {
                this.storeAccount(account);
                this.startRefreshTokenTimer();
                return account;
            }));
    }

    // Store account in memory and localStorage
    private storeAccount(account: Account) {
        this.accountSubject.next(account);
        localStorage.setItem(ACCOUNT_KEY, JSON.stringify(account));
    }

    // Clear account from memory and localStorage
    private clearAccount() {
        this.stopRefreshTokenTimer();
        this.accountSubject.next(null);
        localStorage.removeItem(ACCOUNT_KEY);
        this.router.navigate(['/account/login']);
    }

    register(account: Account) {
        return this.http.post(`${baseUrl}/register`, account);
    }

    verifyEmail(token: string) {
        return this.http.post(`${baseUrl}/verify-email`, { token });
    }

    forgotPassword(email: string) {
        return this.http.post(`${baseUrl}/forgot-password`, { email });
    }

    validateResetToken(token: string) {
        return this.http.post(`${baseUrl}/validate-reset-token`, { token });
    }

    resetPassword(token: string, password: string, confirmPassword: string) {
        return this.http.post(`${baseUrl}/reset-password`, { token, password, confirmPassword });
    }
    
    getAll() {
        return this.http.get<Account[]>(baseUrl);
    }

    getById(id: string) {
        return this.http.get<Account>(`${baseUrl}/${id}`);
    }

    create(params: Partial<Account>) {
        return this.http.post(baseUrl, params);
      }
      
    update(id: string, params: Partial<Account>) {
        return this.http.put(`${baseUrl}/${id}`, params)
      
            .pipe(map((account: any) => {
                // update the current account if it was updated
                if (account.id === this.accountValue.id) {
                    // publish updated account to subscribers
                    account = { ...this.accountValue, ...account };
                    this.storeAccount(account);
                }
                return account;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`)
            .pipe(finalize(() => {
                // auto logout if the logged in account was deleted
                if (id === this.accountValue.id)
                    this.logout();
            }));
    }

    // Add this to account.service.ts
    resendVerificationEmail(email: string) {
        return this.http.post(`${baseUrl}/resend-verification-email`, { email });
    }
    
    updateStatus(id: string, isActive: boolean) {
        return this.http.patch(`${environment.apiUrl}/accounts/${id}/status`, { isActive });
    }

    //helper methods

    private refreshTokenTimeout: ReturnType<typeof setTimeout>;


    private startRefreshTokenTimer() {
        // parse json object from base64 encoded jwt token
        if (!this.accountValue?.jwtToken) return;
        
        try {
            const jwtToken = JSON.parse(atob(this.accountValue.jwtToken.split('.')[1]));
            
            // set a timeout to refresh the token a minute before it expires
            const expires = new Date(jwtToken.exp * 1000);
            const timeout = expires.getTime() - Date.now() - (60 * 1000);
            
            console.log(`JWT token will expire at ${expires.toLocaleString()}, refreshing in ${Math.round(timeout/1000/60)} minutes`);
            
            this.refreshTokenTimeout = setTimeout(() => {
                console.log('Refreshing token...');
                this.refreshToken().subscribe({
                    next: () => console.log('Token refreshed successfully'),
                    error: err => console.error('Token refresh failed:', err)
                });
            }, timeout);
        } catch (e) {
            console.error('Error parsing JWT token for refresh timer:', e);
        }
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }
}