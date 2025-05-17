import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { RequestsComponent } from './requests.component';
import { RequestListComponent } from './request-list.component';
import { RequestFormComponent } from './request-form.component';
import { RequestService } from './request.service';

const routes: Routes = [
    {
        path: '',
        component: RequestsComponent,
        children: [
            { path: '', component: RequestListComponent },
            { path: 'add', component: RequestFormComponent },
            { path: 'edit/:id', component: RequestFormComponent }
        ]
    }
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RouterModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        RequestsComponent,
        RequestListComponent,
        RequestFormComponent
    ],
    providers: [
        RequestService
    ]
})
export class RequestsModule {} 