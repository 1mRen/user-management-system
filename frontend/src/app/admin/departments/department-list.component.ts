import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { DepartmentService } from "./department.service";

interface Department {
    id: number;
    name: string;
    description: string;
    code: string;
    location: string;
    isActive: boolean;
}

@Component({
    selector: "app-department-list",
    template: `
        <div class="department-list">
            <div class="filter-controls mb-3">
                <div class="status-filter">
                    <label class="mr-2">Status Filter:</label>
                    <select [(ngModel)]="statusFilter" (change)="applyFilters()" class="form-control-sm">
                        <option value="all">All</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                    </select>
                </div>
            </div>
            
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Location</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let dept of filteredDepartments" [class.inactive-row]="!dept.isActive">
                        <td>{{dept.name}}</td>
                        <td>{{dept.code}}</td>
                        <td>{{dept.location}}</td>
                        <td>{{dept.description}}</td>
                        <td>
                            <span class="badge" [ngClass]="dept.isActive ? 'badge-success' : 'badge-danger'">
                                {{dept.isActive ? 'Active' : 'Inactive'}}
                            </span>
                        </td>
                        <td>
                            <button class="btn btn-sm btn-info" (click)="editDepartment(dept.id)">Edit</button>
                            <button class="btn btn-sm btn-danger" (click)="deleteDepartment(dept.id)">Delete</button>
                        </td>
                    </tr>
                    <tr *ngIf="filteredDepartments.length === 0">
                        <td colspan="6" class="text-center">No departments found</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    styles: [`
        .department-list {
            padding: 1rem 0;
        }
        .filter-controls {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 1rem;
        }
        .status-filter {
            display: flex;
            align-items: center;
        }
        .mr-2 {
            margin-right: 0.5rem;
        }
        .mb-3 {
            margin-bottom: 1rem;
        }
        .form-control-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
            border-radius: 0.2rem;
            border: 1px solid #ced4da;
        }
        .inactive-row {
            background-color: #f8f9fa;
            color: #6c757d;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        .table th, .table td {
            padding: 0.75rem;
            border: 1px solid #dee2e6;
        }
        .table th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        .badge {
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
        }
        .badge-success {
            background-color: #28a745;
            color: white;
        }
        .badge-danger {
            background-color: #dc3545;
            color: white;
        }
        .btn-sm {
            padding: 0.25rem 0.5rem;
            font-size: 0.875rem;
            margin-right: 0.5rem;
        }
        .btn-info {
            background-color: #17a2b8;
            color: white;
            border: none;
        }
        .btn-danger {
            background-color: #dc3545;
            color: white;
            border: none;
        }
        .btn-info:hover {
            background-color: #138496;
        }
        .btn-danger:hover {
            background-color: #c82333;
        }
        .text-center {
            text-align: center;
        }
    `]
})
export class DepartmentListComponent implements OnInit {
    departments: Department[] = [];
    filteredDepartments: Department[] = [];
    statusFilter: string = 'all';

    constructor(
        private departmentService: DepartmentService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.loadDepartments();
    }

    loadDepartments() {
        this.departmentService.getAll().subscribe({
            next: (departments) => {
                this.departments = departments;
                this.applyFilters();
            },
            error: (error) => {
                console.error('Error loading departments:', error);
                alert('Failed to load departments: ' + (error.message || 'Unknown error'));
            }
        });
    }

    applyFilters() {
        if (this.statusFilter === 'active') {
            this.filteredDepartments = this.departments.filter(dept => dept.isActive);
        } else if (this.statusFilter === 'inactive') {
            this.filteredDepartments = this.departments.filter(dept => !dept.isActive);
        } else {
            this.filteredDepartments = [...this.departments];
        }
    }

    editDepartment(id: number) {
        this.router.navigate(['edit', id], { relativeTo: this.route });
    }

    deleteDepartment(id: number) {
        if (confirm('Are you sure you want to permanently delete this department? This cannot be undone.')) {
            this.departmentService.delete(id).subscribe({
                next: () => {
                    this.departments = this.departments.filter(d => d.id !== id);
                    this.applyFilters();
                    alert('Department deleted successfully');
                },
                error: (error) => {
                    console.error('Error deleting department:', error);
                    alert('Failed to delete department: ' + (error.message || 'Unknown error'));
                }
            });
        }
    }
} 