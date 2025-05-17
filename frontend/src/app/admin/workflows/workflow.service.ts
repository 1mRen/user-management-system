import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get(`${environment.apiUrl}/workflows`);
    }

    getByEmployeeId(id: number) {
        return this.http.get(`${environment.apiUrl}/workflows/employees/${id}`);
    }

    create(params: any) {
        return this.http.post(`${environment.apiUrl}/workflows`, params);
    }

    updateStatus(id: number, params: any) {
        return this.http.put(`${environment.apiUrl}/workflows/${id}/status`, params);
    }

    initiateOnboarding(params: any) {
        return this.http.post(`${environment.apiUrl}/workflows/onboarding`, params);
    }
} 