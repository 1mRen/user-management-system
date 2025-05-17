import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { RequestsRoutingModule } from './requests-routing.module';
import { ListComponent } from './list.component';
import { LayoutComponent } from './layout.component';
import { AddComponent } from './add.component';
import { EditComponent } from './edit.component';
import { RequestService } from '@app/admin/requests/request.service';

// Add console log to check if module is loaded
console.log('=========== REQUESTS MODULE LOADED ===========');

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        RequestsRoutingModule
    ],
    declarations: [
        ListComponent,
        LayoutComponent,
        AddComponent,
        EditComponent
    ],
    providers: [
        RequestService
    ]
})
export class RequestsModule { } 