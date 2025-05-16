import { NgModule } from "@angular/core";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { AdminRoutingModule } from "./admin-routing.module";
import { SubNavComponent } from "./subnav.component";
import { LayoutComponent } from "./layout.component";
import { OverviewComponent } from "./overview.component";

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		RouterModule,
		AdminRoutingModule
	],
	declarations: [
		SubNavComponent,
		LayoutComponent,
		OverviewComponent
	]
})
export class AdminModule {}
