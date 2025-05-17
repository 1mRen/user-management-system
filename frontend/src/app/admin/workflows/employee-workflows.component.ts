import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';

import { WorkflowService } from './workflow.service';
import { AlertService } from '@app/_services';
import { EmployeeService } from '../employees/employee.service';

@Component({
    templateUrl: './employee-workflows.component.html'
})
export class EmployeeWorkflowsComponent implements OnInit {
    employeeId: string;
    employee: any;
    workflows: any[] = [];
    loading = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private workflowService: WorkflowService,
        private employeeService: EmployeeService,
        private alertService: AlertService,
        private formBuilder: FormBuilder
    ) {}

    ngOnInit() {
        this.employeeId = this.route.snapshot.params['id'];
        this.loading = true;

        // Load employee details
        this.employeeService.getById(parseInt(this.employeeId))
            .pipe(first())
            .subscribe({
                next: (employee) => {
                    this.employee = employee;
                    this.loadWorkflows();
                },
                error: (error) => {
                    this.alertService.error('Error loading employee details');
                    this.loading = false;
                }
            });
    }

    loadWorkflows() {
        this.workflowService.getByEmployeeId(parseInt(this.employeeId))
            .pipe(first())
            .subscribe({
                next: (workflows: any) => {
                    this.workflows = workflows;
                    this.loading = false;
                },
                error: (error) => {
                    this.alertService.error('Error loading workflows');
                    this.loading = false;
                }
            });
    }

    updateStatus(workflowId: number, event: Event) {
        const selectElement = event.target as HTMLSelectElement;
        const newStatus = selectElement.value;
        
        this.workflowService.updateStatus(workflowId, { status: newStatus })
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Workflow status updated successfully');
                    this.loadWorkflows();
                },
                error: (error) => {
                    this.alertService.error('Error updating workflow status');
                }
            });
    }

    goBack() {
        this.router.navigate(['/admin/employees']);
    }
} 