import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AlertService, AccountService } from '@app/_services';
import { RequestService, Request as ServiceRequest } from '@app/admin/requests/request.service';
import { environment } from '@environments/environment';

// Define a component-specific Request interface to handle date conversion
interface Request extends Omit<ServiceRequest, 'created'> {
    created: Date;
}

interface Employee {
    id: number;
    accountId: number;
    position: string;
    departmentId: number;
    employeeNumber: string;
    status: string;
    department?: {
        id: number;
        name: string;
    };
    account?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    };
}

@Component({
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
    requests: Request[] = [];
    loading = false;
    accountId?: string;
    employeeId?: number;
    hasEmployeeRecord = true;
    loadError = false;

    constructor(
        private requestService: RequestService,
        private accountService: AccountService,
        private alertService: AlertService,
        private http: HttpClient
    ) {
        console.log('Request list component constructed');
    }

    ngOnInit() {
        console.log('Request list component initialized');
        this.loading = true;
        
        // Get account ID
        const account = this.accountService.accountValue;
        if (!account) {
            this.alertService.error('You must be logged in to view requests');
            this.loading = false;
            this.loadError = true;
            return;
        }
        
        this.accountId = account.id;
        console.log('AccountID found:', this.accountId);
        
        // Get employee data
        this.fetchEmployeeByAccountId();
    }

    fetchEmployeeByAccountId() {
        console.log('Fetching employee record');
        if (!this.accountId) {
            console.error('No account ID available');
            this.loading = false;
            this.loadError = true;
            return;
        }
        
        // Get the current token from account service
        const account = this.accountService.accountValue;
        if (!account || !account.jwtToken) {
            console.error('No authentication token available');
            this.alertService.error('Authentication required. Please log in again.');
            this.loading = false;
            this.loadError = true;
            return;
        }
        
        // Prepare HTTP options with authorization header
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${account.jwtToken}`,
                'Content-Type': 'application/json'
            }),
            withCredentials: true
        };
        
        // Make authenticated request to get employees
        this.http.get<Employee[]>(`${environment.apiUrl}/employees`, httpOptions)
            .pipe(first())
            .subscribe({
                next: (employees) => {
                    console.log('Employees data received:', employees);
                    
                    // Find the employee with matching account ID
                    const accountIdNum = Number(this.accountId);
                    const employee = employees.find(e => Number(e.accountId) === accountIdNum);
                    
                    if (employee) {
                        console.log('Found employee record:', employee);
                        this.employeeId = employee.id;
                        this.hasEmployeeRecord = true;
                        this.loadRequests();
                    } else {
                        console.log('No employee record found');
                        this.hasEmployeeRecord = false;
                        this.loading = false;
                    }
                },
                error: (error) => {
                    console.error('Error fetching employee data:', error);
                    if (error.status === 401) {
                        this.alertService.error('Authentication failed. Please log in again.');
                    } else {
                        this.alertService.error('Failed to load employee data: ' + (error.message || 'Unknown error'));
                    }
                    this.hasEmployeeRecord = false;
                    this.loading = false;
                    this.loadError = true;
                }
            });
    }

    loadRequests() {
        console.log('Loading requests for employeeId:', this.employeeId);
        
        if (!this.employeeId) {
            console.error('No employee ID available');
            this.loading = false;
            this.loadError = true;
            return;
        }
        
        // Use the employee-specific endpoint instead of query parameters
        const url = `${environment.apiUrl}/requests/employee/${this.employeeId}`;
        
        // Get the current token
        const account = this.accountService.accountValue;
        if (!account || !account.jwtToken) {
            console.error('No authentication token available');
            this.alertService.error('Authentication required. Please log in again.');
            this.loading = false;
            this.loadError = true;
            return;
        }
        
        // Prepare HTTP options with authorization header
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${account.jwtToken}`,
                'Content-Type': 'application/json'
            }),
            withCredentials: true
        };
        
        this.http.get<ServiceRequest[]>(url, httpOptions)
            .pipe(first())
            .subscribe({
                next: (requests) => {
                    console.log('My requests received:', requests);
                    
                    // Convert created date strings to Date objects
                    this.requests = requests.map(req => ({
                        ...req,
                        created: new Date(req.created)
                    }));
                    
                    this.loading = false;
                },
                error: (error) => {
                    console.error('Error loading requests:', error);
                    if (error.status === 401) {
                        this.alertService.error('Authentication failed. Please log in again.');
                    } else {
                        this.alertService.error('Failed to load requests: ' + (error.message || 'Unknown error'));
                    }
                    this.loading = false;
                    this.loadError = true;
                }
            });
    }

    retryLoading() {
        console.log('Retrying data load');
        this.loading = true;
        this.loadError = false;
        
        if (this.employeeId) {
            this.loadRequests();
        } else {
            this.fetchEmployeeByAccountId();
        }
    }

    getStatusClass(status: string): string {
        switch (status.toLowerCase()) {
            case 'approved': return 'status-success';
            case 'rejected': return 'status-danger';
            case 'pending': return 'status-warning';
            case 'completed': return 'status-success';
            case 'cancelled': return 'status-danger';
            default: return 'status-info';
        }
    }

    getItemsDescription(request: Request): string {
        if (!request.details || !request.details.items || !request.details.items.length) {
            return 'No items specified';
        }

        return request.details.items.map((item: {name: string, quantity: number}) => 
            `${item.name} (${item.quantity})`
        ).join(', ');
    }

    // Debug function to navigate to edit
    debugNavigateToEdit(id: number) {
        console.log('Debug: Attempting to navigate to edit page for request ID:', id);
        window.location.href = `/requests/edit/${id}`;
    }
} 