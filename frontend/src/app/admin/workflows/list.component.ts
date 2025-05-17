import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { WorkflowService } from './workflow.service';
import { AlertService } from '@app/_services';

@Component({
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
    workflows: any[] = [];

    constructor(
        private workflowService: WorkflowService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.workflowService.getAll()
            .pipe(first())
            .subscribe({
                next: (workflows: any) => {
                    this.workflows = workflows;
                },
                error: error => {
                    this.alertService.error(error);
                }
            });
    }
} 