import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { WorkflowsRoutingModule } from './workflows-routing.module';
import { LayoutComponent } from './layout.component';
import { ListComponent } from './list.component';
import { EmployeeWorkflowsComponent } from './employee-workflows.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        WorkflowsRoutingModule
    ],
    declarations: [
        LayoutComponent,
        ListComponent,
        EmployeeWorkflowsComponent
    ]
})
export class WorkflowsModule { } 