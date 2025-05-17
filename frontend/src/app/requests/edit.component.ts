import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AlertService, AccountService } from '@app/_services';
import { RequestService, Request as ServiceRequest } from '@app/admin/requests/request.service';
import { environment } from '@environments/environment';

@Component({
    templateUrl: './edit.component.html'
})
export class EditComponent implements OnInit {
    form!: FormGroup;
    id: string;
    loading = false;
    submitted = false;
    request: ServiceRequest | null = null;
    accountId?: string;
    employeeId?: number;
    
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private requestService: RequestService,
        private alertService: AlertService,
        private accountService: AccountService,
        private http: HttpClient
    ) {
        // Add more verbose debug logging
        console.log('==================== EditComponent constructor called ====================');
        
        // Get the ID from the route parameters
        this.id = this.route.snapshot.params['id'];
        console.log('Request ID from route:', this.id);
        
        // Log all route params for debugging
        console.log('All route params:', this.route.snapshot.params);
        console.log('Route URL:', this.route.snapshot.url);
        console.log('Parent Route:', this.route.parent?.snapshot.url);
        
        // Initialize form immediately with structure similar to AddComponent
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            description: [''],
            priority: ['medium'],
            details: this.formBuilder.group({
                items: this.formBuilder.array([])
            })
        });
        
        console.log('Form initialized:', this.form);
    }

    ngOnInit() {
        console.log('==================== EditComponent ngOnInit called ====================');
        console.log(`Current URL: ${window.location.href}`);
        
        // Check route guard state - debug only
        if (this.route.snapshot.data) {
            console.log('Route data:', this.route.snapshot.data);
        }
        
        if (!this.id) {
            console.error('No ID found in route parameters');
            this.alertService.error('Request ID is missing');
            this.router.navigate(['/requests']);
            return;
        }
        
        // Get account ID
        const account = this.accountService.accountValue;
        if (!account) {
            console.error('No account found in accountService');
            this.alertService.error('You must be logged in to edit requests');
            this.router.navigate(['/account/login']);
            return;
        }
        
        this.accountId = account.id;
        console.log('Account ID found:', this.accountId);
        console.log('Account object:', account);
        
        // Debug the JWT token
        console.log('JWT token present:', !!account.jwtToken);
        if (account.jwtToken) {
            console.log('JWT token length:', account.jwtToken.length);
        }
        
        // First get the employee ID
        this.fetchEmployeeByAccountId();
    }

    fetchEmployeeByAccountId() {
        console.log('Fetching employee by account ID...');
        if (!this.accountId) {
            console.error('No account ID available');
            this.alertService.error('Account information not available');
            this.router.navigate(['/']);
            return;
        }
        
        // Get the current token
        const account = this.accountService.accountValue;
        if (!account || !account.jwtToken) {
            console.error('No authentication token available');
            this.alertService.error('Authentication required. Please log in again.');
            this.router.navigate(['/account/login']);
            return;
        }
        
        // Prepare HTTP options with auth header
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${account.jwtToken}`,
                'Content-Type': 'application/json'
            }),
            withCredentials: true
        };
        
        // Fetch employee data
        this.loading = true;
        console.log('Making API call to get employees...');
        this.http.get<any[]>(`${environment.apiUrl}/employees`, httpOptions)
            .pipe(first())
            .subscribe({
                next: (employees) => {
                    console.log('Employees data received, count:', employees.length);
                    
                    const accountIdNum = Number(this.accountId);
                    console.log('Looking for employee with accountId:', accountIdNum);
                    
                    const employee = employees.find(e => Number(e.accountId) === accountIdNum);
                    
                    if (employee) {
                        console.log('Found employee record:', employee);
                        this.employeeId = employee.id;
                        this.loadRequest();
                    } else {
                        console.error('No employee record found for account ID:', accountIdNum);
                        this.alertService.error('No employee record found for your account');
                        this.loading = false;
                        this.router.navigate(['/requests']);
                    }
                },
                error: (error) => {
                    console.error('Error fetching employee data:', error);
                    this.alertService.error('Failed to load employee data: ' + (error.message || 'Unknown error'));
                    this.loading = false;
                    this.router.navigate(['/requests']);
                }
            });
    }

    loadRequest() {
        console.log('Loading request with ID:', this.id);
        if (!this.id || !this.employeeId) {
            console.error('Missing ID or employeeId', {id: this.id, employeeId: this.employeeId});
            return;
        }
        
        this.loading = true;
        
        // Use the same HttpClient directly to match the Add component pattern
        const account = this.accountService.accountValue;
        if (!account || !account.jwtToken) {
            console.error('No authentication token available');
            this.alertService.error('Authentication required. Please log in again.');
            this.loading = false;
            this.router.navigate(['/account/login']);
            return;
        }
        
        // Prepare HTTP options with auth header
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${account.jwtToken}`,
                'Content-Type': 'application/json'
            }),
            withCredentials: true
        };
        
        console.log('Making API call to get request...');
        const url = `${environment.apiUrl}/requests/${this.id}`;
        console.log('Request URL:', url);
        
        this.http.get<ServiceRequest>(url, httpOptions)
            .pipe(first())
            .subscribe({
                next: (request) => {
                    console.log('Request data received:', request);
                    
                    // Verify this request belongs to the current user
                    if (request.employeeId !== this.employeeId) {
                        console.error('Request does not belong to current user', {
                            requestEmployeeId: request.employeeId,
                            userEmployeeId: this.employeeId
                        });
                        this.alertService.error('You do not have permission to edit this request');
                        this.loading = false;
                        this.router.navigate(['/requests']);
                        return;
                    }
                    
                    // Check if request can be edited (only pending requests)
                    if (request.status && request.status.toLowerCase() !== 'pending') {
                        console.error('Request is not in pending status:', request.status);
                        this.alertService.error(`This request cannot be edited because its status is ${request.status}`);
                        this.loading = false;
                        this.router.navigate(['/requests']);
                        return;
                    }
                    
                    this.request = request;
                    
                    // Initialize form with request data
                    this.form.patchValue({
                        title: request.title,
                        description: request.description || '',
                        priority: request.priority || 'medium'
                    });
                    
                    // Set up items form array for equipment, resources, or leave requests
                    if (['equipment', 'resources', 'leave'].includes(request.type)) {
                        this.resetItems();
                        
                        if (request.details && request.details.items && Array.isArray(request.details.items)) {
                            request.details.items.forEach((item: {name: string, quantity: number}) => {
                                this.items.push(this.createItemFormGroup(item.name, item.quantity));
                            });
                        } else {
                            // Add at least one item
                            this.addItem();
                        }
                    }
                    
                    this.loading = false;
                    console.log('Request loaded successfully');
                },
                error: (error) => {
                    console.error('Error loading request:', error);
                    this.alertService.error('Error loading request: ' + (error.message || 'Unknown error'));
                    this.loading = false;
                    this.router.navigate(['/requests']);
                }
            });
    }
    
    // Convenience getter for form fields
    get f(): { [key: string]: AbstractControl } { 
        return this.form.controls; 
    }
    
    // Get items FormArray - match the pattern in AddComponent
    get items(): FormArray {
        // First get the details FormGroup
        const detailsGroup = this.form.get('details') as FormGroup;
        // Then get the items FormArray from the details group
        if (detailsGroup) {
            return detailsGroup.get('items') as FormArray;
        }
        console.error('Details form group not found');
        // Return an empty FormArray if detailsGroup is not found (shouldn't happen)
        return this.formBuilder.array([]);
    }
    
    // Create a new item form group
    createItemFormGroup(name: string = '', quantity: number = 1) {
        return this.formBuilder.group({
            name: [name, Validators.required],
            quantity: [quantity, [Validators.required, Validators.min(1)]]
        });
    }
    
    // Add a new item
    addItem() {
        try {
            console.log('Adding item, current items length:', this.items.length);
            this.items.push(this.createItemFormGroup());
            console.log('Item added, new items length:', this.items.length);
        } catch (error) {
            console.error('Error adding item:', error);
            this.alertService.error('Error adding item to form');
        }
    }
    
    // Remove an item
    removeItem(index: number) {
        try {
            this.items.removeAt(index);
        } catch (error) {
            console.error('Error removing item:', error);
        }
    }
    
    // Reset items array
    resetItems() {
        try {
            while (this.items.length) {
                this.items.removeAt(0);
            }
        } catch (error) {
            console.error('Error resetting items:', error);
        }
    }
    
    onSubmit() {
        console.log('Form submitted');
        this.submitted = true;
        
        // Reset alerts
        this.alertService.clear();
        
        console.log('Form state on submit:', this.form.value);
        console.log('Form valid?', this.form.valid);
        
        // Debug form validation
        if (this.form.get('details.items')?.invalid) {
            console.error('Items are invalid:', this.form.get('details.items'));
        }
        
        // Stop if form is invalid
        if (this.form.invalid) {
            console.error('Form is invalid:', this.form.errors);
            return;
        }
        
        this.loading = true;
        
        // Prepare request data with expected structure
        const requestData: any = {
            title: this.form.value.title,
            description: this.form.value.description,
            priority: this.form.value.priority
        };
        
        // For equipment, resources, or leave requests, format as expected
        if (['equipment', 'resources', 'leave'].includes(this.request?.type || '')) {
            // Add items to request data
            requestData.items = this.form.value.details.items;
        } else {
            // For other types, add details as JSON
            requestData.details = this.form.value.details || {};
        }
        
        console.log('Updating request with data:', requestData);
        
        // Update using HttpClient directly to match AddComponent pattern
        const account = this.accountService.accountValue;
        const httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${account?.jwtToken}`,
                'Content-Type': 'application/json'
            }),
            withCredentials: true
        };
        
        this.http.put(`${environment.apiUrl}/requests/${this.id}`, requestData, httpOptions)
            .pipe(first())
            .subscribe({
                next: () => {
                    console.log('Request updated successfully');
                    this.alertService.success('Request updated successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['/requests']);
                },
                error: (error) => {
                    console.error('Update error:', error);
                    this.alertService.error('Error updating request: ' + (error.message || 'Unknown error'));
                    this.loading = false;
                }
            });
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
} 