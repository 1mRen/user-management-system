import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DepartmentsComponent } from "./departments.component";
import { DepartmentListComponent } from "./department-list.component";
import { DepartmentFormComponent } from "./department-form.component";

const routes: Routes = [
    {
        path: '',
        component: DepartmentsComponent,
        children: [
            { path: '', component: DepartmentListComponent },
            { path: 'add', component: DepartmentFormComponent },
            { path: 'edit/:id', component: DepartmentFormComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DepartmentsRoutingModule {} 