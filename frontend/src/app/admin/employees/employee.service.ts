import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Employee {
    id: number;
    employeeNumber: string;
    accountId: number;
    departmentId: number;
    position: string;
    startDate: string;
    endDate?: string;
    status: string;
    isActive: boolean;
    created?: string;
    updated?: string;
    account?: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
    };
    department?: {
        id: number;
        name: string;
    };
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    private apiUrl = `${environment.apiUrl}/employees`;

    constructor(private http: HttpClient) {}

    getAll(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.apiUrl);
    }

    getById(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiUrl}/${id}`);
    }

    create(employee: Partial<Employee>): Observable<Employee> {
        return this.http.post<Employee>(this.apiUrl, employee);
    }

    update(id: number, employee: Partial<Employee>): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    transfer(id: number, departmentId: number, reason?: string): Observable<Employee> {
        return this.http.post<Employee>(`${this.apiUrl}/${id}/transfer`, { 
            departmentId, 
            reason 
        });
    }
} 