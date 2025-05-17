import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AlertService, AccountService } from '@app/_services';
import { RequestService } from '@app/admin/requests/request.service';
import { environment } from '@environments/environment';

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
    templateUrl: './add.component.html'
})
export class AddComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;
    employeeId?: number;
    loadError = false;
    requestTypes = [
        { value: 'leave', label: 'Leave Request' },
        { value: 'equipment', label: 'Equipment Request' },
        { value: 'resources', label: 'Resources Request' },
        { value: 'other', label: 'Other Request' }
    ];
    currentType = '';

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private requestService: RequestService,
        private accountService: AccountService,
        private alertService: AlertService,
        private http: HttpClient
    ) {}

    ngOnInit() {
        console.log('Add request component initialized');
        
        // Initialize form first so it's available regardless of employee ID
        this.form = this.formBuilder.group({
            type: ['', Validators.required],
            title: ['', Validators.required],
            description: [''],
            details: this.formBuilder.group({
                // Initialize items as an empty array - this is critical
                items: this.formBuilder.array([])
            })
        });

        // Add debugging to verify form structure
        console.log('Initial form structure:', this.form);
        console.log('Items FormArray exists:', this.form.get('details.items') !== null);

        // Watch for type changes
        this.form.get('type')?.valueChanges.subscribe(value => {
            this.currentType = value;
            this.resetItems();
            if (value === 'leave' || value === 'equipment' || value === 'resources') {
                this.addItem();
            }
        });
        
        // Get employee ID from account
        const accountId = this.accountService.accountValue?.id;
        
        if (accountId) {
            console.log('AccountID found:', accountId);
            this.fetchEmployeeByAccountId(accountId);
        } else {
            this.loadError = true;
            this.alertService.error('Account information not available');
        }
    }

    fetchEmployeeByAccountId(accountId: string) {
        // Get the current account with JWT token for authorization
        const account = this.accountService.accountValue;
        
        // Create HTTP options with auth token
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${account?.jwtToken}`
            }),
            withCredentials: true
        };
        
        // Fetch all employees with proper authentication
        this.http.get<Employee[]>(`${environment.apiUrl}/employees`, httpOptions)
            .pipe(first())
            .subscribe({
                next: (employees: Employee[]) => {
                    console.log('All employees:', employees);
                    
                    // Try both string and number comparison
                    const accountIdNum = parseInt(accountId || '0');
                    const employee = employees.find(e => 
                        e.accountId === accountIdNum || 
                        String(e.accountId) === accountId
                    );
                    
                    if (employee) {
                        console.log('Found employee record:', employee);
                        this.employeeId = employee.id;
                    } else {
                        console.log('No employee record found for account ID:', accountId);
                        this.alertService.warn('Your account is not linked to an employee record. Please contact an administrator.');
                    }
                },
                error: (error) => {
                    console.error('Error fetching employees:', error);
                    this.alertService.warn('Authentication error. Please try logging out and back in.');
                }
            });
    }

    // Convenience getter for form fields
    get f(): { [key: string]: AbstractControl } { 
        return this.form.controls; 
    }
    
    // Fixed getter for items FormArray
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

    addItem() {
        try {
            console.log('Adding item, current items length:', this.items.length);
            this.items.push(this.formBuilder.group({
                name: ['', Validators.required],
                quantity: [1, [Validators.required, Validators.min(1)]]
            }));
            console.log('Item added, new items length:', this.items.length);
        } catch (error) {
            console.error('Error adding item:', error);
            this.alertService.error('Error adding item to form');
        }
    }

    removeItem(index: number) {
        try {
            this.items.removeAt(index);
        } catch (error) {
            console.error('Error removing item:', error);
        }
    }

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
        this.submitted = true;

        // Reset alerts
        this.alertService.clear();

        // Debug form state before validation
        console.log('Form state on submit:', this.form.value);
        console.log('Form valid?', this.form.valid);
        
        if (this.form.get('details.items')?.invalid) {
            console.error('Items are invalid:', this.form.get('details.items'));
        }

        // Stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        if (!this.employeeId) {
            this.alertService.error('Cannot submit request: No employee ID available');
            return;
        }

        this.loading = true;

        // Create properly formatted request object based on the type
        // Use an any type to avoid TypeScript errors with dynamic properties
        let requestData: any = {
            employeeId: this.employeeId,
            type: this.form.value.type,
            title: this.form.value.title,
            status: 'pending',
        };

        // Handle description differently based on type
        if (this.form.value.type === 'other') {
            // For 'other' type, description is required
            if (!this.form.value.description) {
                this.alertService.error('Description is required for this request type');
                this.loading = false;
                return;
            }
            requestData.description = this.form.value.description;
        } else {
            // For other types, provide a default description if not provided
            requestData.description = this.form.value.description || 'New request';
        }

        // Add items for equipment, leave, and resources types
        if (['equipment', 'resources', 'leave'].includes(this.form.value.type)) {
            // Items array must be at the top level for the backend validation
            requestData.items = this.form.value.details?.items || [];
            
            // Check if items array is empty
            if (!requestData.items || requestData.items.length === 0) {
                this.alertService.error(`Please add at least one item to your ${this.form.value.type} request`);
                this.loading = false;
                return;
            }
        } else {
            // For other types, add details as JSON
            requestData.details = this.form.value.details || {};
        }

        console.log('Submitting request with data:', requestData);

        this.requestService.create(requestData)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Request created successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['/requests']);
                },
                error: error => {
                    console.error('Error creating request:', error);
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
} 