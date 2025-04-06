import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {ListComponent} from './list.component';
import {AddEditiComponent} from './add-edit.component';

const routes : Routes = {
  {path: '', component: ListComponent},
  {path: 'add', component: AddEditComponent},
  {path: 'edit/:id', component: AddEditiComponent}
};

@NgModule({
imports : [RouterModule.forChild(routes)],
exports : [RouterModule]

})

export class AccountsRoutingModule{ }