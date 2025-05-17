import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Request {
    id: number;
    employeeId: number;
    type: string;
    title: string;
    description?: string;
    status: string;
    priority: string;
    requestDate: string;
    completionDate?: string;
    approverId?: number;
    details: any;
    created: string;
    updated?: string;
    employee?: {
        id: number;
        employeeNumber: string;
        position: string;
        account?: {
            firstName: string;
            lastName: string;
            email: string;
        }
    };
    approver?: {
        id: number;
        employeeNumber: string;
        account?: {
            firstName: string;
            lastName: string;
            email: string;
        }
    };
}

@Injectable({ providedIn: 'root' })
export class RequestService {
    private apiUrl = `${environment.apiUrl}/requests`;

    constructor(private http: HttpClient) {
        console.log('RequestService initialized with API URL:', this.apiUrl);
    }

    private handleError(error: HttpErrorResponse) {
        console.error('API Error:', error);
        
        if (error.error instanceof ErrorEvent) {
            // Client-side or network error
            console.error('Client-side error:', error.error.message);
        } else {
            // Backend returned error response
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${JSON.stringify(error.error)}`
            );
        }
        
        return throwError(() => new Error('Something went wrong. Please try again later.'));
    }

    getAll(): Observable<Request[]> {
        console.log('Making API request to:', this.apiUrl);
        return this.http.get<Request[]>(this.apiUrl)
            .pipe(
                tap(data => console.log('Received data:', data)),
                catchError(this.handleError)
            );
    }

    getById(id: number): Observable<Request> {
        console.log(`Getting request details for ID: ${id}`);
        return this.http.get<Request>(`${this.apiUrl}/${id}`)
            .pipe(
                tap(data => console.log('Received request details:', data)),
                catchError(this.handleError)
            );
    }

    create(request: Partial<Request>): Observable<Request> {
        console.log('Creating request with data:', request);
        return this.http.post<Request>(this.apiUrl, request)
            .pipe(
                tap(response => console.log('Create response:', response)),
                catchError(this.handleError)
            );
    }

    update(id: number, request: Partial<Request>): Observable<Request> {
        return this.http.put<Request>(`${this.apiUrl}/${id}`, request)
            .pipe(catchError(this.handleError));
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`)
            .pipe(catchError(this.handleError));
    }

    approve(id: number, comments?: string): Observable<Request> {
        return this.http.put<Request>(`${this.apiUrl}/${id}`, {
            status: 'approved',
            details: comments ? { comments } : undefined
        }).pipe(catchError(this.handleError));
    }

    reject(id: number, reason: string): Observable<Request> {
        return this.http.put<Request>(`${this.apiUrl}/${id}`, {
            status: 'rejected',
            details: { reason }
        }).pipe(catchError(this.handleError));
    }
} 