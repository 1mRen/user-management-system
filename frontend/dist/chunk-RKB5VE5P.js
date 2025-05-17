import{a as q}from"./chunk-FFQWOFG3.js";import{a as S}from"./chunk-5ITAWLK2.js";import{b as de,e as R}from"./chunk-MMLTXIW5.js";import{$ as O,A as n,Aa as le,B as v,Ba as se,Da as V,E as M,Ea as me,F as _,Fa as L,G as c,Ga as A,Ia as z,K as r,L as h,M as C,N as K,P as W,Q as B,R as $,T as b,U as Q,V as U,W as X,Z as w,_ as k,aa as Z,ba as ee,ia as P,j as y,ja as x,ka as T,la as te,m as Y,ma as ne,na as ie,o as E,p as J,pa as oe,q as f,r as g,sa as re,t as a,ta as D,u,ua as F,v as d,va as N,w as l,ya as ae,z as i}from"./chunk-U6ZOIJ5K.js";var pe=(()=>{class t{static{this.\u0275fac=function(s){return new(s||t)}}static{this.\u0275cmp=E({type:t,selectors:[["app-employees"]],decls:4,vars:0,consts:[[1,"employees-container"],[1,"employee-header"]],template:function(s,o){s&1&&(i(0,"div",0)(1,"h1",1),r(2,"EMPLOYEES"),n(),v(3,"router-outlet"),n())},dependencies:[me],styles:[".employees-container[_ngcontent-%COMP%]{padding:0;border:1px solid #dee2e6;border-radius:4px;background-color:#fff;margin-bottom:1rem}.employee-header[_ngcontent-%COMP%]{background-color:#f8f9fa;padding:1rem;margin:0;font-size:1.5rem;font-weight:700;border-bottom:1px solid #dee2e6}"]})}}return t})();var Ee=(t,m,e)=>({"status-active":t,"status-warning":m,"status-danger":e}),Ce=t=>["edit",t];function xe(t,m){if(t&1){let e=M();i(0,"tr")(1,"td"),r(2),n(),i(3,"td"),r(4),n(),i(5,"td"),r(6),n(),i(7,"td"),r(8),n(),i(9,"td"),r(10),U(11,"date"),n(),i(12,"td")(13,"span",7),r(14),n()(),i(15,"td",8)(16,"button",9),_("click",function(){let o=f(e).$implicit,p=c();return g(p.viewRequests(o.id))}),r(17,"Requests"),n(),i(18,"button",9),_("click",function(){let o=f(e).$implicit,p=c();return g(p.viewWorkflows(o.id))}),r(19,"Workflows"),n(),i(20,"button",10),_("click",function(){let o=f(e).$implicit,p=c();return g(p.transferEmployee(o))}),r(21,"Transfer"),n(),i(22,"a",11),r(23,"Edit"),n()()()}if(t&2){let e=m.$implicit;a(2),h(e.employeeNumber),a(2),h(e.account==null?null:e.account.email),a(2),h(e.position),a(2),h(e.department==null?null:e.department.name),a(2),h(X(11,8,e.startDate,"M/d/yyyy")),a(3),l("ngClass",Q(11,Ee,e.status==="active",e.status==="on_leave",e.status==="terminated"||e.status==="suspended")),a(),C(" ",e.status==="active"?"Active":e.status==="on_leave"?"On Leave":e.status==="terminated"?"Terminated":"Suspended"," "),a(8),l("routerLink",b(15,Ce,e.id))}}function Se(t,m){t&1&&v(0,"span",14)}function Ie(t,m){t&1&&(i(0,"span"),r(1,"No employees found"),n())}function Me(t,m){if(t&1&&(i(0,"tr")(1,"td",12),d(2,Se,1,0,"span",13)(3,Ie,2,0,"span",3),n()()),t&2){let e=c();a(2),l("ngIf",e.loading),a(),l("ngIf",!e.loading)}}function we(t,m){if(t&1&&(i(0,"option",33),r(1),n()),t&2){let e=m.$implicit;l("value",e.id),a(),h(e.name)}}function ke(t,m){if(t&1){let e=M();i(0,"div",27)(1,"label"),r(2),n(),i(3,"select",28),$("ngModelChange",function(o){f(e);let p=c(2);return B(p.selectedDepartmentId,o)||(p.selectedDepartmentId=o),g(o)}),i(4,"option",29),r(5,"Select department"),n(),d(6,we,2,2,"option",30),n(),i(7,"div",31)(8,"label"),r(9,"Reason:"),n(),i(10,"textarea",32),$("ngModelChange",function(o){f(e);let p=c(2);return B(p.transferReason,o)||(p.transferReason=o),g(o)}),n()()()}if(t&2){let e=c(2);a(2),K("Transfer ",e.selectedEmployee.account==null?null:e.selectedEmployee.account.firstName," ",e.selectedEmployee.account==null?null:e.selectedEmployee.account.lastName," to:"),a(),W("ngModel",e.selectedDepartmentId),a(),l("ngValue",null),a(2),l("ngForOf",e.departments),a(4),W("ngModel",e.transferReason)}}function Oe(t,m){t&1&&v(0,"span",34)}function Pe(t,m){if(t&1){let e=M();i(0,"div",15),_("click",function(){f(e);let o=c();return g(o.cancelTransfer())}),i(1,"div",16),_("click",function(o){return f(e),g(o.stopPropagation())}),i(2,"div",17)(3,"div",18)(4,"h5",19),r(5,"Transfer Employee"),n(),i(6,"button",20),_("click",function(){f(e);let o=c();return g(o.cancelTransfer())}),r(7,"\xD7"),n()(),i(8,"div",21),d(9,ke,11,6,"div",22),n(),i(10,"div",23)(11,"button",24),_("click",function(){f(e);let o=c();return g(o.cancelTransfer())}),r(12,"Cancel"),n(),i(13,"button",25),_("click",function(){f(e);let o=c();return g(o.confirmTransfer())}),d(14,Oe,1,0,"span",26),r(15," Transfer "),n()()()()()}if(t&2){let e=c();a(9),l("ngIf",e.selectedEmployee),a(4),l("disabled",!e.selectedDepartmentId||e.transferInProgress),a(),l("ngIf",e.transferInProgress)}}var ue=(()=>{class t{constructor(e,s,o,p,j){this.employeeService=e,this.departmentService=s,this.alertService=o,this.router=p,this.route=j,this.employees=[],this.departments=[],this.loading=!1,this.showTransferModal=!1,this.selectedEmployee=null,this.selectedDepartmentId=null,this.transferReason="",this.transferInProgress=!1}ngOnInit(){this.loading=!0,this.loadEmployees(),this.loadDepartments()}loadEmployees(){this.employeeService.getAll().pipe(y()).subscribe({next:e=>{this.employees=e,this.loading=!1},error:e=>{console.error("Error loading employees:",e),this.alertService.error("Failed to load employees"),this.loading=!1}})}loadDepartments(){this.departmentService.getAll().subscribe({next:e=>{this.departments=e},error:e=>{console.error("Error loading departments:",e),this.alertService.error("Failed to load departments")}})}viewRequests(e){alert("View requests for employee "+e+" not implemented yet")}viewWorkflows(e){this.router.navigate(["/admin/workflows/employee",e])}transferEmployee(e){this.selectedEmployee=e,this.selectedDepartmentId=null,this.transferReason="",this.showTransferModal=!0}cancelTransfer(){this.showTransferModal=!1,this.selectedEmployee=null}confirmTransfer(){!this.selectedEmployee||!this.selectedDepartmentId||(this.transferInProgress=!0,this.employeeService.transfer(this.selectedEmployee.id,this.selectedDepartmentId,this.transferReason).pipe(y()).subscribe({next:()=>{this.alertService.success("Employee transferred successfully"),this.loadEmployees(),this.showTransferModal=!1,this.transferInProgress=!1},error:e=>{console.error("Error transferring employee:",e),this.alertService.error("Failed to transfer employee"),this.transferInProgress=!1}}))}static{this.\u0275fac=function(s){return new(s||t)(u(S),u(q),u(R),u(L),u(V))}}static{this.\u0275cmp=E({type:t,selectors:[["app-employee-list"]],decls:25,vars:3,consts:[[1,"table-responsive"],[1,"table","table-bordered"],[4,"ngFor","ngForOf"],[4,"ngIf"],[1,"mt-2"],["routerLink","add",1,"btn","btn-success"],["class","modal-backdrop",3,"click",4,"ngIf"],[1,"status-badge",3,"ngClass"],[1,"action-buttons"],[1,"btn","btn-info",3,"click"],[1,"btn","btn-warning",3,"click"],[1,"btn","btn-primary",3,"routerLink"],["colspan","7",1,"text-center"],["class","spinner-border spinner-border-lg align-center",4,"ngIf"],[1,"spinner-border","spinner-border-lg","align-center"],[1,"modal-backdrop",3,"click"],[1,"modal-dialog",3,"click"],[1,"modal-content"],[1,"modal-header"],[1,"modal-title"],["type","button",1,"close",3,"click"],[1,"modal-body"],["class","form-group",4,"ngIf"],[1,"modal-footer"],["type","button",1,"btn","btn-secondary",3,"click"],["type","button",1,"btn","btn-primary",3,"click","disabled"],["class","spinner-border spinner-border-sm mr-1",4,"ngIf"],[1,"form-group"],[1,"form-control",3,"ngModelChange","ngModel"],["disabled","",3,"ngValue"],[3,"value",4,"ngFor","ngForOf"],[1,"form-group","mt-3"],["rows","3",1,"form-control",3,"ngModelChange","ngModel"],[3,"value"],[1,"spinner-border","spinner-border-sm","mr-1"]],template:function(s,o){s&1&&(i(0,"div",0)(1,"table",1)(2,"thead")(3,"tr")(4,"th"),r(5,"Employee ID"),n(),i(6,"th"),r(7,"Account"),n(),i(8,"th"),r(9,"Position"),n(),i(10,"th"),r(11,"Department"),n(),i(12,"th"),r(13,"Hire Date"),n(),i(14,"th"),r(15,"Status"),n(),i(16,"th"),r(17,"Actions"),n()()(),i(18,"tbody"),d(19,xe,24,17,"tr",2)(20,Me,4,2,"tr",3),n()()(),i(21,"div",4)(22,"a",5),r(23,"Add Employee"),n()(),d(24,Pe,16,3,"div",6)),s&2&&(a(19),l("ngForOf",o.employees),a(),l("ngIf",!o.employees||o.employees.length===0),a(4),l("ngIf",o.showTransferModal))},dependencies:[w,k,O,F,N,P,D,T,ne,A,Z],styles:[`.table[_ngcontent-%COMP%] {
        margin-bottom: 0;
    }
    .table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {
        background-color: #f8f9fa;
        font-weight: bold;
    }
    .table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%], .table[_ngcontent-%COMP%]   th[_ngcontent-%COMP%] {
        padding: 0.75rem;
        vertical-align: middle;
        border: 1px solid #dee2e6;
    }
    .status-badge[_ngcontent-%COMP%] {
        display: inline-block;
        padding: 0.4rem 0.6rem;
        border-radius: 0.25rem;
        color: white;
        text-align: center;
        min-width: 5rem;
    }
    .status-active[_ngcontent-%COMP%] {
        background-color: #28a745;
    }
    .status-warning[_ngcontent-%COMP%] {
        background-color: #ffc107;
        color: #212529;
    }
    .status-danger[_ngcontent-%COMP%] {
        background-color: #dc3545;
    }
    .action-buttons[_ngcontent-%COMP%] {
        white-space: nowrap;
    }
    .action-buttons[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {
        margin-right: 0.25rem;
        margin-bottom: 0.25rem;
    }
    .btn-info[_ngcontent-%COMP%] {
        background-color: #17a2b8;
        color: white;
        border: none;
    }
    .btn-warning[_ngcontent-%COMP%] {
        background-color: #ffc107;
        color: #212529;
        border: none;
    }
    .btn-primary[_ngcontent-%COMP%] {
        background-color: #007bff;
        color: white;
        border: none;
    }
    .btn-success[_ngcontent-%COMP%] {
        background-color: #28a745;
        color: white;
        border: none;
    }
    .modal-backdrop[_ngcontent-%COMP%] {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1050;
    }
    .modal-dialog[_ngcontent-%COMP%] {
        max-width: 500px;
        margin: 1.75rem auto;
    }
    .modal-content[_ngcontent-%COMP%] {
        background-color: white;
        border-radius: 0.3rem;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.5);
    }
    .modal-header[_ngcontent-%COMP%] {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border-bottom: 1px solid #dee2e6;
    }
    .modal-body[_ngcontent-%COMP%] {
        padding: 1rem;
    }
    .modal-footer[_ngcontent-%COMP%] {
        padding: 1rem;
        border-top: 1px solid #dee2e6;
        display: flex;
        justify-content: flex-end;
    }
    .close[_ngcontent-%COMP%] {
        border: none;
        background: transparent;
        font-size: 1.5rem;
        font-weight: 700;
        opacity: 0.5;
        cursor: pointer;
    }
    .close[_ngcontent-%COMP%]:hover {
        opacity: 1;
    }
    .mt-2[_ngcontent-%COMP%] {
        margin-top: 0.5rem;
    }
    .mt-3[_ngcontent-%COMP%] {
        margin-top: 1rem;
    }`]})}}return t})();var I=t=>({"is-invalid":t});function Te(t,m){t&1&&(i(0,"div"),r(1,"Employee ID is required"),n())}function De(t,m){if(t&1&&(i(0,"div",20),d(1,Te,2,0,"div",21),n()),t&2){let e=c();a(),l("ngIf",e.f.employeeNumber.errors.required)}}function Fe(t,m){if(t&1&&(i(0,"option",22),r(1),n()),t&2){let e=m.$implicit;l("value",e.id),a(),C(" ",e.email," ")}}function Ne(t,m){t&1&&(i(0,"div"),r(1,"Account is required"),n())}function Ve(t,m){if(t&1&&(i(0,"div",20),d(1,Ne,2,0,"div",21),n()),t&2){let e=c();a(),l("ngIf",e.f.accountId.errors.required)}}function Le(t,m){t&1&&(i(0,"div"),r(1,"Position is required"),n())}function Ae(t,m){if(t&1&&(i(0,"div",20),d(1,Le,2,0,"div",21),n()),t&2){let e=c();a(),l("ngIf",e.f.position.errors.required)}}function Re(t,m){if(t&1&&(i(0,"option",22),r(1),n()),t&2){let e=m.$implicit;l("value",e.id),a(),C(" ",e.name," ")}}function qe(t,m){t&1&&(i(0,"div"),r(1,"Department is required"),n())}function je(t,m){if(t&1&&(i(0,"div",20),d(1,qe,2,0,"div",21),n()),t&2){let e=c();a(),l("ngIf",e.f.departmentId.errors.required)}}function We(t,m){t&1&&(i(0,"div"),r(1,"Hire Date is required"),n())}function Be(t,m){if(t&1&&(i(0,"div",20),d(1,We,2,0,"div",21),n()),t&2){let e=c();a(),l("ngIf",e.f.startDate.errors.required)}}function $e(t,m){t&1&&(i(0,"div",2)(1,"label",23),r(2,"Status"),n(),i(3,"select",24)(4,"option",25),r(5,"Active"),n(),i(6,"option",26),r(7,"On Leave"),n(),i(8,"option",27),r(9,"Suspended"),n(),i(10,"option",28),r(11,"Terminated"),n()()())}function ze(t,m){t&1&&v(0,"span",29)}var H=(()=>{class t{constructor(e,s,o,p,j,fe,ge){this.formBuilder=e,this.route=s,this.router=o,this.employeeService=p,this.departmentService=j,this.accountService=fe,this.alertService=ge,this.isEditMode=!1,this.loading=!1,this.submitted=!1,this.accounts=[],this.departments=[]}ngOnInit(){this.id=this.route.snapshot.params.id,this.isEditMode=!!this.id,this.form=this.formBuilder.group({employeeNumber:["EMP"+this.generateRandomId(),x.required],accountId:["",x.required],position:["",x.required],departmentId:["",x.required],startDate:[this.formatDate(new Date),x.required],status:["active"]}),this.loadDepartments(),this.loadAccounts(),this.isEditMode&&(this.loading=!0,this.employeeService.getById(+this.id).pipe(y()).subscribe({next:e=>{this.form.patchValue({employeeNumber:e.employeeNumber,accountId:e.accountId,position:e.position,departmentId:e.departmentId,startDate:this.formatDate(new Date(e.startDate)),status:e.status}),this.loading=!1},error:e=>{this.alertService.error("Error loading employee data"),this.loading=!1,this.router.navigate(["/admin/employees"])}}))}get f(){return this.form.controls}onSubmit(){this.submitted=!0,this.alertService.clear(),!this.form.invalid&&(this.loading=!0,this.isEditMode?this.updateEmployee():this.createEmployee())}createEmployee(){this.employeeService.create(this.form.value).pipe(y()).subscribe({next:()=>{this.alertService.success("Employee created successfully",{keepAfterRouteChange:!0}),this.router.navigate(["/admin/employees"])},error:e=>{this.alertService.error(e),this.loading=!1}})}updateEmployee(){this.employeeService.update(+this.id,this.form.value).pipe(y()).subscribe({next:()=>{this.alertService.success("Employee updated successfully",{keepAfterRouteChange:!0}),this.router.navigate(["/admin/employees"])},error:e=>{this.alertService.error(e),this.loading=!1}})}loadDepartments(){this.departmentService.getAll().pipe(y()).subscribe({next:e=>{this.departments=e},error:e=>{this.alertService.error("Error loading departments"),console.error(e)}})}loadAccounts(){this.accountService.getAll().pipe(y()).subscribe({next:e=>{this.accounts=e},error:e=>{this.alertService.error("Error loading accounts"),console.error(e)}})}formatDate(e){let s=e.getFullYear(),o=("0"+(e.getMonth()+1)).slice(-2),p=("0"+e.getDate()).slice(-2);return`${s}-${o}-${p}`}generateRandomId(){return Math.floor(1e3+Math.random()*9e3).toString()}static{this.\u0275fac=function(s){return new(s||t)(u(ae),u(V),u(L),u(S),u(q),u(de),u(R))}}static{this.\u0275cmp=E({type:t,selectors:[["app-employee-form"]],decls:42,vars:27,consts:[[1,"employee-form"],[3,"ngSubmit","formGroup"],[1,"form-group"],["for","employeeNumber"],["type","text","id","employeeNumber","formControlName","employeeNumber",1,"form-control",3,"ngClass"],["class","invalid-feedback",4,"ngIf"],["for","accountId"],["id","accountId","formControlName","accountId",1,"form-control",3,"ngClass"],["value",""],[3,"value",4,"ngFor","ngForOf"],["for","position"],["type","text","id","position","formControlName","position",1,"form-control",3,"ngClass"],["for","departmentId"],["id","departmentId","formControlName","departmentId",1,"form-control",3,"ngClass"],["for","startDate"],["type","date","id","startDate","formControlName","startDate",1,"form-control",3,"ngClass"],["class","form-group",4,"ngIf"],[1,"btn","btn-primary",3,"disabled"],["class","spinner-border spinner-border-sm mr-1",4,"ngIf"],["routerLink","/admin/employees",1,"btn","btn-link"],[1,"invalid-feedback"],[4,"ngIf"],[3,"value"],["for","status"],["id","status","formControlName","status",1,"form-control"],["value","active"],["value","on_leave"],["value","suspended"],["value","terminated"],[1,"spinner-border","spinner-border-sm","mr-1"]],template:function(s,o){s&1&&(i(0,"div",0)(1,"h3"),r(2),n(),i(3,"form",1),_("ngSubmit",function(){return o.onSubmit()}),i(4,"div",2)(5,"label",3),r(6,"Employee ID"),n(),v(7,"input",4),d(8,De,2,1,"div",5),n(),i(9,"div",2)(10,"label",6),r(11,"Account"),n(),i(12,"select",7)(13,"option",8),r(14,"Select Account"),n(),d(15,Fe,2,2,"option",9),n(),d(16,Ve,2,1,"div",5),n(),i(17,"div",2)(18,"label",10),r(19,"Position"),n(),v(20,"input",11),d(21,Ae,2,1,"div",5),n(),i(22,"div",2)(23,"label",12),r(24,"Department"),n(),i(25,"select",13)(26,"option",8),r(27,"Select Department"),n(),d(28,Re,2,2,"option",9),n(),d(29,je,2,1,"div",5),n(),i(30,"div",2)(31,"label",14),r(32,"Hire Date"),n(),v(33,"input",15),d(34,Be,2,1,"div",5),n(),d(35,$e,12,0,"div",16),i(36,"div",2)(37,"button",17),d(38,ze,1,0,"span",18),r(39," Save "),n(),i(40,"a",19),r(41,"Cancel"),n()()()()),s&2&&(a(2),C("",o.isEditMode?"Edit":"Add"," Employee"),a(),l("formGroup",o.form),a(4),l("ngClass",b(17,I,o.submitted&&o.f.employeeNumber.errors)),a(),l("ngIf",o.submitted&&o.f.employeeNumber.errors),a(4),l("ngClass",b(19,I,o.submitted&&o.f.accountId.errors)),a(3),l("ngForOf",o.accounts),a(),l("ngIf",o.submitted&&o.f.accountId.errors),a(4),l("ngClass",b(21,I,o.submitted&&o.f.position.errors)),a(),l("ngIf",o.submitted&&o.f.position.errors),a(4),l("ngClass",b(23,I,o.submitted&&o.f.departmentId.errors)),a(3),l("ngForOf",o.departments),a(),l("ngIf",o.submitted&&o.f.departmentId.errors),a(4),l("ngClass",b(25,I,o.submitted&&o.f.startDate.errors)),a(),l("ngIf",o.submitted&&o.f.startDate.errors),a(),l("ngIf",o.isEditMode),a(2),l("disabled",o.loading),a(),l("ngIf",o.loading))},dependencies:[w,k,O,ie,F,N,P,D,T,te,oe,re,A],styles:[".employee-form[_ngcontent-%COMP%]{max-width:600px;margin:0 auto;padding:1rem;background:#fff;border-radius:.25rem;box-shadow:0 1px 3px #0000001a}h3[_ngcontent-%COMP%]{margin-bottom:1.5rem;padding-bottom:.5rem;border-bottom:1px solid #dee2e6}.form-group[_ngcontent-%COMP%]{margin-bottom:1rem}label[_ngcontent-%COMP%]{font-weight:500}.form-control[_ngcontent-%COMP%]{padding:.5rem .75rem;border:1px solid #ced4da;border-radius:.25rem}.is-invalid[_ngcontent-%COMP%]{border-color:#dc3545}.invalid-feedback[_ngcontent-%COMP%]{color:#dc3545;font-size:80%}.btn-primary[_ngcontent-%COMP%]{background-color:#007bff;border-color:#007bff;color:#fff;padding:.5rem 1rem}.btn-link[_ngcontent-%COMP%]{color:#6c757d;text-decoration:none}.mr-1[_ngcontent-%COMP%]{margin-right:.25rem}"]})}}return t})();var Ge=[{path:"",component:pe,children:[{path:"",component:ue},{path:"add",component:H},{path:"edit/:id",component:H}]}],rt=(()=>{class t{static{this.\u0275fac=function(s){return new(s||t)}}static{this.\u0275mod=J({type:t})}static{this.\u0275inj=Y({providers:[S],imports:[ee,se,le,z,z.forChild(Ge)]})}}return t})();export{rt as EmployeesModule};
