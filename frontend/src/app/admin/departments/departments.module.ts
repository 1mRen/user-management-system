import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { DepartmentsRoutingModule } from "./departments-routing.module";
import { DepartmentsComponent } from "./departments.component";
import { DepartmentListComponent } from "./department-list.component";
import { DepartmentFormComponent } from "./department-form.component";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        DepartmentsRoutingModule
    ],
    declarations: [
        DepartmentsComponent,
        DepartmentListComponent,
        DepartmentFormComponent
    ]
})
export class DepartmentsModule {} 