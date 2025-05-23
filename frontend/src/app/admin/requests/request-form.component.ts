import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RequestService, Request } from './request.service';
import { EmployeeService } from '../employees/employee.service';
import { AlertService } from '@app/_services';
import { first } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-request-form',
    templateUrl: './request-form.component.html'
})
export class RequestFormComponent implements OnInit {
    form: FormGroup;
    id: string;
    isEditMode = false;
    loading = false;
    submitted = false;
    employees: any[] = [];
    request: Request | null = null;
    
    // Approve/Reject Modal variables
    showApproveModal = false;
    showRejectModal = false;
    approvalComments = '';
    rejectionReason = '';
    submitting = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private requestService: RequestService,
        private employeeService: EmployeeService,
        private alertService: AlertService
    ) {
        this.form = this.formBuilder.group({
            employeeId: ['', Validators.required],
            type: ['equipment', Validators.required],
            title: ['', Validators.required],
            description: [''],
            priority: ['medium'],
            items: this.formBuilder.array([this.createItemFormGroup()])
        });
    }

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isEditMode = !!this.id;

        // Watch for type changes to adjust form
        this.form.get('type')?.valueChanges.subscribe(type => {
            this.updateFormForType(type);
            
            // Allow a moment for the DOM to update after type changes
            setTimeout(() => {
                // Apply custom styling to the dropdown if needed
                this.adjustDropdownVisibility();
            }, 100);
        });

        // In edit mode, load the request details
        if (this.isEditMode) {
            this.loading = true;
            
            console.log(`Loading request with ID: ${this.id}`);
            
            // Check if ID is valid
            if (!this.id || isNaN(+this.id)) {
                console.error('Invalid request ID:', this.id);
                this.alertService.error('Invalid request ID');
                this.loading = false;
                this.router.navigate(['/admin/requests']);
                return;
            }
            
            this.requestService.getById(+this.id)
                .pipe(first())
                .subscribe({
                    next: (request) => {
                        console.log('Received request details:', request);
                        
                        if (!request) {
                            this.alertService.error('Request not found');
                            this.loading = false;
                            this.router.navigate(['/admin/requests']);
                            return;
                        }
                        
                        // Add extra safeguards against invalid request data
                        try {
                            // Ensure details object exists
                            request.details = request.details || {};
                            
                            // Ensure other required properties exist
                            if (!request.type) request.type = 'equipment';
                            if (!request.status) request.status = 'pending';
                            if (!request.title) request.title = 'Untitled Request';
                            
                            this.request = request;
                            console.log('Request successfully loaded and processed:', this.request);
                        } catch(parseError) {
                            console.error('Error processing request data:', parseError);
                            this.alertService.error('Error processing request data');
                            this.loading = false;
                            setTimeout(() => this.router.navigate(['/admin/requests']), 2000);
                            return;
                        }
                        
                        // Clear existing items
                        while (this.itemsArray.length) {
                            this.itemsArray.removeAt(0);
                        }
                        
                        // Initialize details object if it doesn't exist
                        if (!request.details) {
                            request.details = {};
                        }
                        
                        // Add items if it's an equipment request
                        if (request.type?.toLowerCase() === 'equipment' && request.details?.items && Array.isArray(request.details.items)) {
                            request.details.items.forEach((item: {name: string, quantity: number, purpose?: string}) => {
                                this.itemsArray.push(this.formBuilder.group({
                                    name: [item.name, Validators.required],
                                    quantity: [item.quantity, [Validators.required, Validators.min(1)]]
                                }));
                            });
                        } else {
                            // Add a default item
                            this.itemsArray.push(this.createItemFormGroup());
                        }

                        this.form.patchValue({
                            employeeId: request.employeeId,
                            type: request.type,
                            title: request.title || '',
                            description: request.description || '',
                            priority: request.priority || 'medium'
                        });
                        
                        this.loading = false;
                    },
                    error: (error) => {
                        console.error('Error loading request details:', error);
                        this.alertService.error('Error loading request details. Please try again.');
                        this.loading = false;
                        
                        // Wait a moment before navigating back to allow the user to see the error
                        setTimeout(() => {
                            this.router.navigate(['/admin/requests']);
                        }, 2000);
                    }
                });
        } else {
            // Load employees for dropdown
            this.loadEmployees();
        }
        
        // Initialize dropdown styling
        setTimeout(() => {
            this.adjustDropdownVisibility();
        }, 200);
    }

    // Convenience getter for form fields
    get f() { return this.form.controls; }
    
    // Get items FormArray
    get itemsArray() {
        return this.form.get('items') as FormArray;
    }
    
    // Create a new item form group
    createItemFormGroup() {
        return this.formBuilder.group({
            name: ['', Validators.required],
            quantity: [1, [Validators.required, Validators.min(1)]]
        });
    }
    
    // Add a new item
    addItem() {
        this.itemsArray.push(this.createItemFormGroup());
    }
    
    // Remove an item
    removeItem(index: number) {
        if (this.itemsArray.length > 1) {
            this.itemsArray.removeAt(index);
        }
    }
    
    // Update form fields based on request type
    updateFormForType(type: string) {
        if (type.toLowerCase() === 'equipment' || type.toLowerCase() === 'resources' || type.toLowerCase() === 'leave') {
            if (this.itemsArray.length === 0) {
                this.addItem();
            }
        }
    }

    loadEmployees() {
        this.employeeService.getAll()
            .pipe(first())
            .subscribe({
                next: (employees) => {
                    this.employees = employees;
                },
                error: (error) => {
                    this.alertService.error('Error loading employees');
                    console.error(error);
                }
            });
    }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        // Stop if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        
        // Prepare request data based on type
        const formValues = this.form.value;
        let requestData: any = {
            employeeId: formValues.employeeId,
            type: formValues.type,
            title: formValues.title || `New ${formValues.type} request`,
            description: formValues.description,
            priority: formValues.priority || 'medium'
        };
        
        // Add type-specific details
        if (formValues.type.toLowerCase() === 'equipment' || formValues.type.toLowerCase() === 'resources') {
            // Format as expected by backend
            requestData.items = formValues.items.map((item: any) => ({
                name: item.name,
                quantity: item.quantity
            }));
        }
        
        if (this.isEditMode) {
            this.updateRequest(requestData);
        } else {
            this.createRequest(requestData);
        }
    }

    private createRequest(requestData: any) {
        this.requestService.create(requestData)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Request created successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['/admin/requests']);
                },
                error: (error) => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
    
    private updateRequest(requestData: any) {
        this.requestService.update(+this.id, requestData)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Request updated successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['/admin/requests']);
                },
                error: (error) => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    getStatusClass(status: string): string {
        switch (status.toLowerCase()) {
            case 'approved': return 'status-success';
            case 'rejected': return 'status-danger';
            case 'pending': return 'status-warning';
            default: return 'status-info';
        }
    }
    
    // Modal methods
    openApproveModal() {
        this.approvalComments = '';
        this.showApproveModal = true;
    }
    
    openRejectModal() {
        this.rejectionReason = '';
        this.showRejectModal = true;
    }
    
    cancelModal() {
        this.showApproveModal = false;
        this.showRejectModal = false;
    }
    
    approveRequest() {
        if (!this.id) return;
        
        this.submitting = true;
        this.requestService.approve(+this.id, this.approvalComments)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Request approved successfully', { keepAfterRouteChange: true });
                    this.showApproveModal = false;
                    this.submitting = false;
                    // Refresh page to show updated status
                    this.router.navigate(['/admin/requests']);
                },
                error: (error) => {
                    this.alertService.error('Failed to approve request: ' + error);
                    this.submitting = false;
                }
            });
    }
    
    rejectRequest() {
        if (!this.id || !this.rejectionReason) return;
        
        this.submitting = true;
        this.requestService.reject(+this.id, this.rejectionReason)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Request rejected successfully', { keepAfterRouteChange: true });
                    this.showRejectModal = false;
                    this.submitting = false;
                    // Refresh page to show updated status
                    this.router.navigate(['/admin/requests']);
                },
                error: (error) => {
                    this.alertService.error('Failed to reject request: ' + error);
                    this.submitting = false;
                }
            });
    }

    // Ensure dropdown is fully visible
    adjustDropdownVisibility() {
        try {
            // Use a type assertion for the querySelectorAll result
            const selectElements = document.querySelectorAll('select.form-control');
            
            // Iterate through NodeList with proper typecasting for each element
            for (let i = 0; i < selectElements.length; i++) {
                const select = selectElements[i] as HTMLSelectElement;
                
                // Now we can safely access style properties
                select.classList.add('custom-select');
                
                if (select.parentElement) {
                    select.parentElement.style.position = 'relative';
                    select.parentElement.style.width = '100%';
                    select.parentElement.style.display = 'block';
                    
                    // Apply styles directly to the select element
                    select.style.textOverflow = 'ellipsis';
                    select.style.overflow = 'hidden';
                    select.style.paddingRight = '35px';
                }
            }
        } catch (error) {
            console.error('Error adjusting dropdown visibility:', error);
        }
    }
} 