import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DepartmentService } from "./department.service";

@Component({
    selector: "app-department-form",
    template: `
        <div class="department-form">
            <h3>{{isEditMode ? 'Edit' : 'Add'}} Department</h3>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
                <div class="form-group">
                    <label for="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        formControlName="name"
                        class="form-control"
                        [ngClass]="{'is-invalid': submitted && f['name'].errors}"
                    />
                    <div *ngIf="submitted && f['name'].errors" class="invalid-feedback">
                        <div *ngIf="f['name'].errors['required']">Name is required</div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="code">Code</label>
                    <input
                        type="text"
                        id="code"
                        formControlName="code"
                        class="form-control"
                        [ngClass]="{'is-invalid': submitted && f['code'].errors}"
                    />
                    <div *ngIf="submitted && f['code'].errors" class="invalid-feedback">
                        <div *ngIf="f['code'].errors['required']">Code is required</div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="location">Location</label>
                    <input
                        type="text"
                        id="location"
                        formControlName="location"
                        class="form-control"
                    />
                </div>

                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea
                        id="description"
                        formControlName="description"
                        class="form-control"
                        rows="3"
                    ></textarea>
                </div>

                <div class="form-group">
                    <div class="form-check">
                        <input
                            type="checkbox"
                            id="isActive"
                            formControlName="isActive"
                            class="form-check-input"
                        />
                        <label class="form-check-label" for="isActive">Active</label>
                    </div>
                </div>

                <div class="form-group">
                    <button type="submit" class="btn btn-primary" [disabled]="loading">
                        {{loading ? 'Saving...' : 'Save'}}
                    </button>
                    <button type="button" class="btn btn-link" (click)="cancel()">Cancel</button>
                </div>
            </form>
        </div>
    `,
    styles: [`
        .department-form {
            max-width: 600px;
            margin: 0 auto;
            padding: 1rem;
        }
        .form-group {
            margin-bottom: 1rem;
        }
        label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        .form-control {
            display: block;
            width: 100%;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            line-height: 1.5;
            color: #495057;
            background-color: #fff;
            border: 1px solid #ced4da;
            border-radius: 0.25rem;
        }
        .form-control.is-invalid {
            border-color: #dc3545;
        }
        .invalid-feedback {
            display: block;
            width: 100%;
            margin-top: 0.25rem;
            font-size: 80%;
            color: #dc3545;
        }
        .form-check {
            display: flex;
            align-items: center;
        }
        .form-check-input {
            margin-right: 0.5rem;
        }
        .btn {
            margin-right: 0.5rem;
        }
        .btn-link {
            color: #6c757d;
            text-decoration: none;
        }
        .btn-link:hover {
            color: #0056b3;
            text-decoration: underline;
        }
    `]
})
export class DepartmentFormComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;
    isEditMode = false;
    id: number;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private departmentService: DepartmentService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isEditMode = !!this.id;

        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            code: ['', Validators.required],
            location: [''],
            description: [''],
            isActive: [true]
        });

        if (this.isEditMode) {
            this.loadDepartment();
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    loadDepartment() {
        this.departmentService.getById(this.id).subscribe({
            next: (department) => {
                this.form.patchValue(department);
            },
            error: (error) => {
                console.error('Error loading department:', error);
                // TODO: Add proper error handling
            }
        });
    }

    onSubmit() {
        this.submitted = true;

        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        const department = this.form.value;
        
        console.log('Submitting department form with data:', department);

        if (this.isEditMode) {
            this.departmentService.update(this.id, department).subscribe({
                next: () => {
                    console.log('Department updated successfully');
                    this.router.navigate(['/admin/departments']);
                },
                error: (error) => {
                    console.error('Error updating department:', error);
                    let errorMessage = 'Error updating department';
                    
                    if (error.error && error.error.message) {
                        errorMessage = error.error.message;
                    } else if (error.message) {
                        errorMessage = error.message;
                    }
                    
                    // Display error to user (you might want to add an error message element to your template)
                    alert(`Failed to update department: ${errorMessage}`);
                    this.loading = false;
                }
            });
        } else {
            this.departmentService.create(department).subscribe({
                next: () => {
                    console.log('Department created successfully');
                    this.router.navigate(['/admin/departments']);
                },
                error: (error) => {
                    console.error('Error creating department:', error);
                    let errorMessage = 'Error creating department';
                    
                    if (error.error && error.error.message) {
                        errorMessage = error.error.message;
                    } else if (error.message) {
                        errorMessage = error.message;
                    }
                    
                    if (error.error && error.error.details) {
                        console.error('Error details:', error.error.details);
                    }
                    
                    // Display error to user (you might want to add an error message element to your template)
                    alert(`Failed to create department: ${errorMessage}`);
                    this.loading = false;
                }
            });
        }
    }

    cancel() {
        this.router.navigate(['/admin/departments']);
    }
} 