import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { RequestsRoutingModule } from './requests-routing.module';
import { ListComponent } from './list.component';
import { LayoutComponent } from './layout.component';
import { AddComponent } from './add.component';
import { RequestService } from '@app/admin/requests/request.service';

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
        AddComponent
    ],
    providers: [
        RequestService
    ]
})
export class RequestsModule { } 