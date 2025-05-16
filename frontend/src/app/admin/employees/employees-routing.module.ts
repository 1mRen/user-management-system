import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmployeesComponent } from './employees.component';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeFormComponent } from './employee-form.component';

const routes: Routes = [
    {
        path: '',
        component: EmployeesComponent,
        children: [
            { path: '', component: EmployeeListComponent },
            { path: 'add', component: EmployeeFormComponent },
            { path: 'edit/:id', component: EmployeeFormComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EmployeesRoutingModule {} 