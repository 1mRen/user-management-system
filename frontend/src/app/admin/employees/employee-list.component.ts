import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService, Employee } from './employee.service';
import { DepartmentService } from '../departments/department.service'; 
import { AlertService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
    selector: 'app-employee-list',
    templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {
    employees: Employee[] = [];
    departments: any[] = [];
    loading = false;
    showTransferModal = false;
    selectedEmployee: Employee | null = null;
    selectedDepartmentId: number | null = null;
    transferReason: string = '';
    transferInProgress = false;

    constructor(
        private employeeService: EmployeeService,
        private departmentService: DepartmentService,
        private alertService: AlertService,
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.loading = true;
        this.loadEmployees();
        this.loadDepartments();
    }

    loadEmployees() {
        this.employeeService.getAll().pipe(first()).subscribe({
            next: (employees) => {
                this.employees = employees;
                this.loading = false;
            },
            error: (error) => {
                console.error('Error loading employees:', error);
                this.alertService.error('Failed to load employees');
                this.loading = false;
            }
        });
    }

    loadDepartments() {
        this.departmentService.getAll().subscribe({
            next: (departments) => {
                this.departments = departments;
            },
            error: (error) => {
                console.error('Error loading departments:', error);
                this.alertService.error('Failed to load departments');
            }
        });
    }

    viewRequests(id: number) {
        // TODO: Implement requests view for an employee
        alert('View requests for employee ' + id + ' not implemented yet');
    }

    viewWorkflows(id: number) {
        // TODO: Implement workflows view for an employee
        alert('View workflows for employee ' + id + ' not implemented yet');
    }

    transferEmployee(employee: Employee) {
        this.selectedEmployee = employee;
        this.selectedDepartmentId = null;
        this.transferReason = '';
        this.showTransferModal = true;
    }

    cancelTransfer() {
        this.showTransferModal = false;
        this.selectedEmployee = null;
    }

    confirmTransfer() {
        if (!this.selectedEmployee || !this.selectedDepartmentId) return;
        
        this.transferInProgress = true;
        
        this.employeeService.transfer(
            this.selectedEmployee.id, 
            this.selectedDepartmentId, 
            this.transferReason
        ).pipe(first()).subscribe({
            next: () => {
                this.alertService.success('Employee transferred successfully');
                this.loadEmployees();
                this.showTransferModal = false;
                this.transferInProgress = false;
            },
            error: (error) => {
                console.error('Error transferring employee:', error);
                this.alertService.error('Failed to transfer employee');
                this.transferInProgress = false;
            }
        });
    }
} 