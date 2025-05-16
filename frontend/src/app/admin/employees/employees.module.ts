import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeFormComponent } from './employee-form.component';
import { EmployeeService } from './employee.service';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
    ],
    declarations: [
        EmployeesComponent,
        EmployeeListComponent,
        EmployeeFormComponent
    ],
    providers: [
        EmployeeService
    ]
})
export class EmployeesModule {} 