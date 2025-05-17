import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { AccountService } from "@app/_services";

export interface Department {
    id: number;
    name: string;
    description: string;
    code: string;
    location: string;
    isActive: boolean;
    created?: string;
    updated?: string;
    accountId?: string | number;
}

@Injectable({ providedIn: 'root' })
export class DepartmentService {
    private apiUrl = `${environment.apiUrl}/departments`;

    constructor(
        private http: HttpClient,
        private accountService: AccountService
    ) {}

    getAll(): Observable<Department[]> {
        return this.http.get<Department[]>(this.apiUrl);
    }

    getById(id: number): Observable<Department> {
        return this.http.get<Department>(`${this.apiUrl}/${id}`);
    }

    create(department: Partial<Department>): Observable<Department> {
        // Get accountId from current user
        const accountId = this.accountService.accountValue?.id;
        console.log('Current account ID:', accountId);
        
        // Ensure accountId is set
        const deptWithAccount = {
            ...department,
            accountId: accountId
        };
        
        console.log('Sending department data:', deptWithAccount);
        return this.http.post<Department>(this.apiUrl, deptWithAccount);
    }

    update(id: number, department: Partial<Department>): Observable<Department> {
        // Get accountId from current user
        const accountId = this.accountService.accountValue?.id;
        console.log('Current account ID:', accountId);
        
        // Ensure accountId is set
        const deptWithAccount = {
            ...department,
            accountId: accountId
        };
        
        console.log('Updating department data:', deptWithAccount);
        return this.http.put<Department>(`${this.apiUrl}/${id}`, deptWithAccount);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
} 