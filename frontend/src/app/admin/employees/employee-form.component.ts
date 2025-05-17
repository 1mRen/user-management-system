import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService, Employee } from './employee.service';
import { DepartmentService } from '../departments/department.service';
import { AccountService } from '@app/_services';
import { AlertService } from '@app/_services';
import { first } from 'rxjs/operators';
import { Account } from '@app/_models';

interface Department {
    id: number;
    name: string;
}

@Component({
    selector: 'app-employee-form',
    template: `
        <div class="employee-form">
            <h3>{{ isEditMode ? 'Edit' : 'Add' }} Employee</h3>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
                <!-- Employee ID -->
                <div class="form-group">
                    <label for="employeeNumber">Employee ID</label>
                    <input 
                        type="text" 
                        id="employeeNumber" 
                        formControlName="employeeNumber" 
                        class="form-control" 
                        [ngClass]="{'is-invalid': submitted && f['employeeNumber'].errors}"
                    />
                    <div *ngIf="submitted && f['employeeNumber'].errors" class="invalid-feedback">
                        <div *ngIf="f['employeeNumber'].errors['required']">Employee ID is required</div>
                    </div>
                </div>

                <!-- Account Selection -->
                <div class="form-group">
                    <label for="accountId">Account</label>
                    <select 
                        id="accountId" 
                        formControlName="accountId" 
                        class="form-control"
                        [ngClass]="{'is-invalid': submitted && f['accountId'].errors}"
                    >
                        <option value="">Select Account</option>
                        <option *ngFor="let account of accounts" [value]="account.id">
                            {{ account.email }}
                        </option>
                    </select>
                    <div *ngIf="submitted && f['accountId'].errors" class="invalid-feedback">
                        <div *ngIf="f['accountId'].errors['required']">Account is required</div>
                    </div>
                </div>

                <!-- Position -->
                <div class="form-group">
                    <label for="position">Position</label>
                    <input 
                        type="text" 
                        id="position" 
                        formControlName="position" 
                        class="form-control"
                        [ngClass]="{'is-invalid': submitted && f['position'].errors}"
                    />
                    <div *ngIf="submitted && f['position'].errors" class="invalid-feedback">
                        <div *ngIf="f['position'].errors['required']">Position is required</div>
                    </div>
                </div>

                <!-- Department -->
                <div class="form-group">
                    <label for="departmentId">Department</label>
                    <select 
                        id="departmentId" 
                        formControlName="departmentId" 
                        class="form-control"
                        [ngClass]="{'is-invalid': submitted && f['departmentId'].errors}"
                    >
                        <option value="">Select Department</option>
                        <option *ngFor="let department of departments" [value]="department.id">
                            {{ department.name }}
                        </option>
                    </select>
                    <div *ngIf="submitted && f['departmentId'].errors" class="invalid-feedback">
                        <div *ngIf="f['departmentId'].errors['required']">Department is required</div>
                    </div>
                </div>

                <!-- Hire Date -->
                <div class="form-group">
                    <label for="startDate">Hire Date</label>
                    <input 
                        type="date" 
                        id="startDate" 
                        formControlName="startDate" 
                        class="form-control"
                        [ngClass]="{'is-invalid': submitted && f['startDate'].errors}"
                    />
                    <div *ngIf="submitted && f['startDate'].errors" class="invalid-feedback">
                        <div *ngIf="f['startDate'].errors['required']">Hire Date is required</div>
                    </div>
                </div>

                <!-- Status (for edit mode only) -->
                <div *ngIf="isEditMode" class="form-group">
                    <label for="status">Status</label>
                    <select 
                        id="status" 
                        formControlName="status" 
                        class="form-control"
                    >
                        <option value="active">Active</option>
                        <option value="on_leave">On Leave</option>
                        <option value="suspended">Suspended</option>
                        <option value="terminated">Terminated</option>
                    </select>
                </div>

                <!-- Submit Button -->
                <div class="form-group">
                    <button [disabled]="loading" class="btn btn-primary">
                        <span *ngIf="loading" class="spinner-border spinner-border-sm mr-1"></span>
                        Save
                    </button>
                    <a routerLink="/admin/employees" class="btn btn-link">Cancel</a>
                </div>
            </form>
        </div>
    `,
    styles: [`
        .employee-form {
            max-width: 600px;
            margin: 0 auto;
            padding: 1rem;
            background: white;
            border-radius: 0.25rem;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        h3 {
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #dee2e6;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        label {
            font-weight: 500;
        }
        .form-control {
            padding: 0.5rem 0.75rem;
            border: 1px solid #ced4da;
            border-radius: 0.25rem;
        }
        .is-invalid {
            border-color: #dc3545;
        }
        .invalid-feedback {
            color: #dc3545;
            font-size: 80%;
        }
        .btn-primary {
            background-color: #007bff;
            border-color: #007bff;
            color: white;
            padding: 0.5rem 1rem;
        }
        .btn-link {
            color: #6c757d;
            text-decoration: none;
        }
        .mr-1 {
            margin-right: 0.25rem;
        }
    `]
})
export class EmployeeFormComponent implements OnInit {
    form: FormGroup;
    id: string;
    isEditMode = false;
    loading = false;
    submitted = false;
    accounts: Account[] = [];
    departments: Department[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private employeeService: EmployeeService,
        private departmentService: DepartmentService,
        private accountService: AccountService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isEditMode = !!this.id;

        // Create form
        this.form = this.formBuilder.group({
            employeeNumber: ['EMP' + this.generateRandomId(), Validators.required],
            accountId: ['', Validators.required],
            position: ['', Validators.required],
            departmentId: ['', Validators.required],
            startDate: [this.formatDate(new Date()), Validators.required],
            status: ['active']
        });

        // Load departments and accounts for dropdowns
        this.loadDepartments();
        this.loadAccounts();

        // In edit mode, load the employee data
        if (this.isEditMode) {
            this.loading = true;
            this.employeeService.getById(+this.id)
                .pipe(first())
                .subscribe({
                    next: (employee) => {
                        this.form.patchValue({
                            employeeNumber: employee.employeeNumber,
                            accountId: employee.accountId,
                            position: employee.position,
                            departmentId: employee.departmentId,
                            startDate: this.formatDate(new Date(employee.startDate)),
                            status: employee.status
                        });
                        this.loading = false;
                    },
                    error: (error) => {
                        this.alertService.error('Error loading employee data');
                        this.loading = false;
                        this.router.navigate(['/admin/employees']);
                    }
                });
        }
    }

    // Convenience getter for form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;
        this.alertService.clear();

        // Stop if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        
        if (this.isEditMode) {
            this.updateEmployee();
        } else {
            this.createEmployee();
        }
    }

    private createEmployee() {
        this.employeeService.create(this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Employee created successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['/admin/employees']);
                },
                error: (error) => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateEmployee() {
        this.employeeService.update(+this.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Employee updated successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['/admin/employees']);
                },
                error: (error) => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private loadDepartments() {
        this.departmentService.getAll()
            .pipe(first())
            .subscribe({
                next: (departments) => {
                    this.departments = departments;
                },
                error: (error) => {
                    this.alertService.error('Error loading departments');
                    console.error(error);
                }
            });
    }

    private loadAccounts() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe({
                next: (accounts) => {
                    this.accounts = accounts;
                },
                error: (error) => {
                    this.alertService.error('Error loading accounts');
                    console.error(error);
                }
            });
    }

    private formatDate(date: Date) {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
        return `${year}-${month}-${day}`;
    }

    private generateRandomId() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }
} 