import{a as Me}from"./chunk-JLZX3VIP.js";import{a as ye,b as qe,e as $}from"./chunk-XYLJRMEX.js";import{$ as V,A as t,Aa as he,B as p,Ca as L,Da as Ce,E as M,Ea as D,F as _,Fa as z,G as c,Ha as Q,J as r,K as b,L as v,M as E,N as ee,O as B,P as G,Q as W,S as w,U as F,V as T,Y as A,Z as j,_ as N,aa as te,ba as ne,e as H,h as q,ha as ie,ia as h,j as C,ja as re,k,ka as oe,l as J,la as le,m as K,ma as ae,n as X,na as se,o as S,oa as de,p as Z,pa as ce,q as g,qa as me,r as f,ra as pe,sa as ue,t as a,ta as ge,u as x,ua as fe,v as m,va as _e,w as s,wa as ve,xa as xe,z as n,za as be}from"./chunk-VSUWDIMV.js";var Ee=(()=>{class i{static{this.\u0275fac=function(o){return new(o||i)}}static{this.\u0275cmp=S({type:i,selectors:[["app-requests"]],decls:4,vars:0,consts:[[1,"requests-container"],[1,"request-header"]],template:function(o,l){o&1&&(n(0,"div",0)(1,"h1",1),r(2,"REQUESTS"),t(),p(3,"router-outlet"),t())},dependencies:[Ce],styles:[".requests-container[_ngcontent-%COMP%]{padding:0;border:1px solid #dee2e6;border-radius:4px;background-color:#fff;margin-bottom:1rem}.request-header[_ngcontent-%COMP%]{background-color:#f8f9fa;padding:1rem;margin:0;font-size:1.5rem;font-weight:700;border-bottom:1px solid #dee2e6}"]})}}return i})();var O=(()=>{class i{constructor(e){this.http=e,this.apiUrl=`${ye.apiUrl}/requests`,console.log("RequestService initialized with API URL:",this.apiUrl)}handleError(e){return console.error("API Error:",e),e.error instanceof ErrorEvent?console.error("Client-side error:",e.error.message):console.error(`Backend returned code ${e.status}, body was: ${JSON.stringify(e.error)}`),H(()=>new Error("Something went wrong. Please try again later."))}getAll(){return console.log("Making API request to:",this.apiUrl),this.http.get(this.apiUrl).pipe(k(e=>console.log("Received data:",e)),q(this.handleError))}getById(e){return console.log(`Getting request details for ID: ${e}`),this.http.get(`${this.apiUrl}/${e}`).pipe(k(o=>console.log("Received request details:",o)),q(this.handleError))}create(e){return console.log("Creating request with data:",e),this.http.post(this.apiUrl,e).pipe(k(o=>console.log("Create response:",o)),q(this.handleError))}update(e,o){return this.http.put(`${this.apiUrl}/${e}`,o).pipe(q(this.handleError))}delete(e){return this.http.delete(`${this.apiUrl}/${e}`).pipe(q(this.handleError))}approve(e,o){return this.http.put(`${this.apiUrl}/${e}`,{status:"approved",details:o?{comments:o}:void 0}).pipe(q(this.handleError))}reject(e,o){return this.http.put(`${this.apiUrl}/${e}`,{status:"rejected",details:{reason:o}}).pipe(q(this.handleError))}static{this.\u0275fac=function(o){return new(o||i)(X(ne))}}static{this.\u0275prov=J({token:i,factory:i.\u0275fac,providedIn:"root"})}}return i})();function Ie(i,d){if(i&1){let e=M();n(0,"tr")(1,"td"),r(2),t(),n(3,"td"),r(4),t(),n(5,"td"),r(6),F(7,"date"),t(),n(8,"td")(9,"span",6),r(10),t()(),n(11,"td",7)(12,"button",8),_("click",function(){let l=g(e).$implicit,u=c();return f(u.viewDetails(l.id))}),r(13,"Edit"),t()()()}if(i&2){let e=d.$implicit,o=c();a(2),E("",e.employee==null||e.employee.account==null?null:e.employee.account.firstName," ",e.employee==null||e.employee.account==null?null:e.employee.account.lastName,""),a(2),b(e.type),a(2),b(T(7,6,e.created,"M/d/yyyy")),a(3),s("ngClass",o.getStatusClass(e.status)),a(),v(" ",e.status," ")}}function ke(i,d){i&1&&p(0,"span",11)}function Fe(i,d){i&1&&(n(0,"span"),r(1,"No requests found"),t())}function Te(i,d){if(i&1&&(n(0,"tr")(1,"td",9),m(2,ke,1,0,"span",10)(3,Fe,2,0,"span",3),t()()),i&2){let e=c();a(2),s("ngIf",e.loading),a(),s("ngIf",!e.loading)}}var Oe=(()=>{class i{constructor(e,o,l,u,y){this.requestService=e,this.alertService=o,this.accountService=l,this.router=u,this.route=y,this.requests=[],this.loading=!1}ngOnInit(){let e=this.accountService.accountValue;if(!e){this.alertService.error("You must be logged in to view requests"),this.router.navigate(["/account/login"]);return}if(e.role!=="Admin"){this.alertService.error("You must have admin privileges to view requests"),this.router.navigate(["/"]);return}this.loading=!0,this.loadRequests()}loadRequests(){console.log("Loading requests..."),this.alertService.clear(),this.requestService.getAll().pipe(C()).subscribe({next:e=>{console.log("Requests loaded successfully:",e),this.requests=e,this.loading=!1,e.length===0&&console.log("No requests found")},error:e=>{console.error("Error loading requests:",e),this.alertService.error("Failed to load requests: "+(e.message||"Unknown error")),this.loading=!1}})}viewDetails(e){this.router.navigate(["edit",e],{relativeTo:this.route})}getStatusClass(e){switch(e.toLowerCase()){case"approved":return"status-success";case"rejected":return"status-danger";case"pending":return"status-warning";default:return"status-info"}}static{this.\u0275fac=function(o){return new(o||i)(x(O),x($),x(qe),x(D),x(L))}}static{this.\u0275cmp=S({type:i,selectors:[["app-request-list"]],decls:20,vars:2,consts:[[1,"table-responsive"],[1,"table","table-bordered"],[4,"ngFor","ngForOf"],[4,"ngIf"],[1,"mt-2"],["routerLink","add",1,"btn","btn-success"],[1,"status-badge",3,"ngClass"],[1,"action-buttons"],[1,"btn","btn-info",3,"click"],["colspan","5",1,"text-center"],["class","spinner-border spinner-border-lg align-center",4,"ngIf"],[1,"spinner-border","spinner-border-lg","align-center"]],template:function(o,l){o&1&&(n(0,"div",0)(1,"table",1)(2,"thead")(3,"tr")(4,"th"),r(5,"Employee"),t(),n(6,"th"),r(7,"Type"),t(),n(8,"th"),r(9,"Date"),t(),n(10,"th"),r(11,"Status"),t(),n(12,"th"),r(13,"Actions"),t()()(),n(14,"tbody"),m(15,Ie,14,9,"tr",2)(16,Te,4,2,"tr",3),t()()(),n(17,"div",4)(18,"a",5),r(19,"Create Request"),t()()),o&2&&(a(15),s("ngForOf",l.requests),a(),s("ngIf",!l.requests||l.requests.length===0))},dependencies:[A,j,N,z,V],styles:[`.table[_ngcontent-%COMP%] {
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
    .status-success[_ngcontent-%COMP%] {
        background-color: #28a745;
    }
    .status-warning[_ngcontent-%COMP%] {
        background-color: #ffc107;
        color: #212529;
    }
    .status-danger[_ngcontent-%COMP%] {
        background-color: #dc3545;
    }
    .status-info[_ngcontent-%COMP%] {
        background-color: #17a2b8;
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
    .btn-success[_ngcontent-%COMP%] {
        background-color: #28a745;
        color: white;
        border: none;
    }
    .btn-danger[_ngcontent-%COMP%] {
        background-color: #dc3545;
        color: white;
        border: none;
    }
    .btn-secondary[_ngcontent-%COMP%] {
        background-color: #6c757d;
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
    }`]})}}return i})();var R=i=>({"is-invalid":i});function Ae(i,d){if(i&1&&(n(0,"div",31)(1,"div",32)(2,"span",33),r(3),t()(),n(4,"div",34)(5,"div",35)(6,"h4"),r(7,"Employee Information"),t(),n(8,"div",36)(9,"p"),p(10,"i",37),n(11,"strong"),r(12,"ID:"),t(),r(13),t(),n(14,"p"),p(15,"i",38),n(16,"strong"),r(17,"Name:"),t(),r(18),t(),n(19,"p"),p(20,"i",39),n(21,"strong"),r(22,"Email:"),t(),r(23),t()()(),n(24,"div",35)(25,"h4"),r(26,"Request Details"),t(),n(27,"div",36)(28,"p"),p(29,"i",40),n(30,"strong"),r(31,"Date:"),t(),r(32),F(33,"date"),t(),n(34,"p"),p(35,"i",41),n(36,"strong"),r(37,"Type:"),t(),r(38),t(),n(39,"p"),p(40,"i",42),n(41,"strong"),r(42,"Status:"),t(),n(43,"span",43),r(44),t()()()()()()),i&2){let e=c();a(2),s("ngClass",e.getStatusClass((e.request==null?null:e.request.status)||"")),a(),v(" ",e.request==null?null:e.request.status," "),a(10),v(" ",(e.request==null||e.request.employee==null?null:e.request.employee.employeeNumber)||"N/A",""),a(5),E(" ",(e.request==null||e.request.employee==null||e.request.employee.account==null?null:e.request.employee.account.firstName)||""," ",(e.request==null||e.request.employee==null||e.request.employee.account==null?null:e.request.employee.account.lastName)||"",""),a(5),v(" ",(e.request==null||e.request.employee==null||e.request.employee.account==null?null:e.request.employee.account.email)||"N/A",""),a(9),v(" ",T(33,10,e.request==null?null:e.request.created,"MMM d, yyyy"),""),a(6),v(" ",e.request==null?null:e.request.type,""),a(5),s("ngClass",e.getStatusClass((e.request==null?null:e.request.status)||"")),a(),b(e.request==null?null:e.request.status)}}function je(i,d){i&1&&(n(0,"div"),r(1,"Type is required"),t())}function Ne(i,d){if(i&1&&(n(0,"div",44),m(1,je,2,0,"div",45),t()),i&2){let e=c();a(),s("ngIf",e.f.type.errors.required)}}function Ve(i,d){i&1&&(n(0,"div"),r(1,"Title is required"),t())}function Le(i,d){if(i&1&&(n(0,"div",44),m(1,Ve,2,0,"div",45),t()),i&2){let e=c();a(),s("ngIf",e.f.title.errors.required)}}function De(i,d){if(i&1&&(n(0,"option",49),r(1),t()),i&2){let e=d.$implicit;s("value",e.id),a(),ee(" ",e.employeeNumber," - ",e.account==null?null:e.account.firstName," ",e.account==null?null:e.account.lastName," ")}}function ze(i,d){i&1&&(n(0,"div"),r(1,"Employee is required"),t())}function $e(i,d){if(i&1&&(n(0,"div",44),m(1,ze,2,0,"div",45),t()),i&2){let e=c(2);a(),s("ngIf",e.f.employeeId.errors.required)}}function Ue(i,d){if(i&1&&(n(0,"div",9)(1,"label"),r(2,"Select Employee"),t(),n(3,"select",46)(4,"option",47),r(5,"-- Select an employee --"),t(),m(6,De,2,4,"option",48),t(),m(7,$e,2,1,"div",17),t()),i&2){let e=c();a(3),s("ngClass",w(3,R,e.submitted&&e.f.employeeId.errors)),a(3),s("ngForOf",e.employees),a(),s("ngIf",e.submitted&&e.f.employeeId.errors)}}function Be(i,d){if(i&1){let e=M();n(0,"button",64),_("click",function(){g(e);let l=c().index,u=c(2);return f(u.removeItem(l))}),p(1,"i",28),r(2," Remove "),t()}}function Ge(i,d){i&1&&(n(0,"div"),r(1,"Name is required"),t())}function We(i,d){if(i&1&&(n(0,"div",44),m(1,Ge,2,0,"div",45),t()),i&2){let e,o=c().$implicit;a(),s("ngIf",(e=o.get("name"))==null||e.errors==null?null:e.errors.required)}}function Qe(i,d){i&1&&(n(0,"div"),r(1,"Quantity is required"),t())}function Ye(i,d){i&1&&(n(0,"div"),r(1,"Minimum quantity is 1"),t())}function He(i,d){if(i&1&&(n(0,"div",44),m(1,Qe,2,0,"div",45)(2,Ye,2,0,"div",45),t()),i&2){let e,o,l=c().$implicit;a(),s("ngIf",(e=l.get("quantity"))==null||e.errors==null?null:e.errors.required),a(),s("ngIf",(o=l.get("quantity"))==null||o.errors==null?null:o.errors.min)}}function Je(i,d){if(i&1&&(n(0,"div",57)(1,"div",58)(2,"div",59)(3,"h5"),r(4),t(),m(5,Be,3,0,"button",60),t(),n(6,"div",61)(7,"div",9)(8,"label"),r(9,"Item Name"),t(),p(10,"input",62),m(11,We,2,1,"div",17),t(),n(12,"div",9)(13,"label"),r(14,"Quantity"),t(),p(15,"input",63),m(16,He,3,2,"div",17),t()()()()),i&2){let e,o,l,u,y=d.$implicit,I=d.index,P=c(2);a(),s("formGroupName",I),a(3),v("Item #",I+1,""),a(),s("ngIf",P.itemsArray.length>1),a(5),s("ngClass",w(7,R,P.submitted&&((e=y.get("name"))==null?null:e.errors))),a(),s("ngIf",P.submitted&&((o=y.get("name"))==null?null:o.errors)),a(4),s("ngClass",w(9,R,P.submitted&&((l=y.get("quantity"))==null?null:l.errors))),a(),s("ngIf",P.submitted&&((u=y.get("quantity"))==null?null:u.errors))}}function Ke(i,d){if(i&1){let e=M();n(0,"div",50)(1,"h4",51),p(2,"i",52),r(3),t(),n(4,"div",53),m(5,Je,17,11,"div",54),t(),n(6,"button",55),_("click",function(){g(e);let l=c();return f(l.addItem())}),p(7,"i",56),r(8," Add Another Item "),t()()}if(i&2){let e,o=c();a(3),v(" ",((e=o.form.get("type"))==null?null:e.value)==="equipment"?"Equipment":"Resources"," Items "),a(2),s("ngForOf",o.itemsArray.controls)}}function Xe(i,d){i&1&&p(0,"span",65)}function Ze(i,d){if(i&1){let e=M();n(0,"div",66)(1,"h4",67),r(2,"Request Actions"),t(),n(3,"div",68)(4,"button",69),_("click",function(){g(e);let l=c();return f(l.openApproveModal())}),p(5,"i",70),r(6," Approve Request "),t(),n(7,"button",71),_("click",function(){g(e);let l=c();return f(l.openRejectModal())}),p(8,"i",28),r(9," Reject Request "),t()()()}}function et(i,d){if(i&1&&(n(0,"tr")(1,"td"),r(2),t(),n(3,"td"),r(4),t(),n(5,"td"),r(6),t()()),i&2){let e=d.$implicit,o=d.index;a(2),b(o+1),a(2),b(e.name),a(2),b(e.quantity)}}function tt(i,d){if(i&1&&(n(0,"div")(1,"h6",87),r(2,"Items"),t(),n(3,"table",88)(4,"thead")(5,"tr")(6,"th"),r(7,"#"),t(),n(8,"th"),r(9,"Name"),t(),n(10,"th"),r(11,"Quantity"),t()()(),n(12,"tbody"),m(13,et,7,3,"tr",89),t()()()),i&2){let e=c(2);a(13),s("ngForOf",e.request==null||e.request.details==null?null:e.request.details.items)}}function nt(i,d){i&1&&p(0,"span",65)}function it(i,d){if(i&1){let e=M();n(0,"div",72),_("click",function(){g(e);let l=c();return f(l.cancelModal())}),n(1,"div",73),_("click",function(l){return g(e),f(l.stopPropagation())}),n(2,"div",74)(3,"div",75)(4,"h5",76),p(5,"i",77),r(6," Approve Request"),t(),n(7,"button",78),_("click",function(){g(e);let l=c();return f(l.cancelModal())}),r(8,"\xD7"),t()(),n(9,"div",79)(10,"div",9)(11,"div",80)(12,"p"),r(13,"Are you sure you want to approve this request?"),t()(),n(14,"div",81)(15,"p")(16,"strong"),r(17,"Type:"),t(),r(18),t(),n(19,"p")(20,"strong"),r(21,"Employee:"),t(),r(22),t(),n(23,"p")(24,"strong"),r(25,"Title:"),t(),r(26),t()(),m(27,tt,14,1,"div",45),n(28,"div",82)(29,"label"),r(30,"Comments (Optional):"),t(),n(31,"textarea",83),W("ngModelChange",function(l){g(e);let u=c();return G(u.approvalComments,l)||(u.approvalComments=l),f(l)}),t()()()(),n(32,"div",84)(33,"button",85),_("click",function(){g(e);let l=c();return f(l.cancelModal())}),r(34,"Cancel"),t(),n(35,"button",86),_("click",function(){g(e);let l=c();return f(l.approveRequest())}),m(36,nt,1,0,"span",25),p(37,"i",70),r(38," Confirm Approval "),t()()()()()}if(i&2){let e=c();a(18),v(" ",e.request==null?null:e.request.type,""),a(4),E(" ",e.request==null||e.request.employee==null||e.request.employee.account==null?null:e.request.employee.account.firstName," ",e.request==null||e.request.employee==null||e.request.employee.account==null?null:e.request.employee.account.lastName,""),a(4),v(" ",e.request==null?null:e.request.title,""),a(),s("ngIf",(e.request==null||e.request.type==null?null:e.request.type.toLowerCase())==="equipment"||(e.request==null||e.request.type==null?null:e.request.type.toLowerCase())==="resources"),a(4),B("ngModel",e.approvalComments),a(4),s("disabled",e.submitting),a(),s("ngIf",e.submitting)}}function rt(i,d){if(i&1&&(n(0,"tr")(1,"td"),r(2),t(),n(3,"td"),r(4),t(),n(5,"td"),r(6),t()()),i&2){let e=d.$implicit,o=d.index;a(2),b(o+1),a(2),b(e.name),a(2),b(e.quantity)}}function ot(i,d){if(i&1&&(n(0,"div")(1,"h6",87),r(2,"Items"),t(),n(3,"table",88)(4,"thead")(5,"tr")(6,"th"),r(7,"#"),t(),n(8,"th"),r(9,"Name"),t(),n(10,"th"),r(11,"Quantity"),t()()(),n(12,"tbody"),m(13,rt,7,3,"tr",89),t()()()),i&2){let e=c(2);a(13),s("ngForOf",e.request==null||e.request.details==null?null:e.request.details.items)}}function lt(i,d){i&1&&p(0,"span",65)}function at(i,d){if(i&1){let e=M();n(0,"div",72),_("click",function(){g(e);let l=c();return f(l.cancelModal())}),n(1,"div",73),_("click",function(l){return g(e),f(l.stopPropagation())}),n(2,"div",74)(3,"div",75)(4,"h5",76),p(5,"i",90),r(6," Reject Request"),t(),n(7,"button",78),_("click",function(){g(e);let l=c();return f(l.cancelModal())}),r(8,"\xD7"),t()(),n(9,"div",79)(10,"div",9)(11,"div",91)(12,"p"),r(13,"Are you sure you want to reject this request?"),t()(),n(14,"div",81)(15,"p")(16,"strong"),r(17,"Type:"),t(),r(18),t(),n(19,"p")(20,"strong"),r(21,"Employee:"),t(),r(22),t(),n(23,"p")(24,"strong"),r(25,"Title:"),t(),r(26),t()(),m(27,ot,14,1,"div",45),n(28,"div",82)(29,"label"),r(30,"Reason for Rejection: "),n(31,"span",92),r(32,"*"),t()(),n(33,"textarea",93),W("ngModelChange",function(l){g(e);let u=c();return G(u.rejectionReason,l)||(u.rejectionReason=l),f(l)}),t(),n(34,"small",94),r(35,"This information will be visible to the employee."),t()()()(),n(36,"div",84)(37,"button",85),_("click",function(){g(e);let l=c();return f(l.cancelModal())}),r(38,"Cancel"),t(),n(39,"button",95),_("click",function(){g(e);let l=c();return f(l.rejectRequest())}),m(40,lt,1,0,"span",25),p(41,"i",28),r(42," Confirm Rejection "),t()()()()()}if(i&2){let e=c();a(18),v(" ",e.request==null?null:e.request.type,""),a(4),E(" ",e.request==null||e.request.employee==null||e.request.employee.account==null?null:e.request.employee.account.firstName," ",e.request==null||e.request.employee==null||e.request.employee.account==null?null:e.request.employee.account.lastName,""),a(4),v(" ",e.request==null?null:e.request.title,""),a(),s("ngIf",(e.request==null||e.request.type==null?null:e.request.type.toLowerCase())==="equipment"||(e.request==null||e.request.type==null?null:e.request.type.toLowerCase())==="resources"),a(6),B("ngModel",e.rejectionReason),a(6),s("disabled",e.submitting||!e.rejectionReason),a(),s("ngIf",e.submitting)}}var Y=(()=>{class i{constructor(e,o,l,u,y,I){this.formBuilder=e,this.route=o,this.router=l,this.requestService=u,this.employeeService=y,this.alertService=I,this.isEditMode=!1,this.loading=!1,this.submitted=!1,this.employees=[],this.request=null,this.showApproveModal=!1,this.showRejectModal=!1,this.approvalComments="",this.rejectionReason="",this.submitting=!1,this.form=this.formBuilder.group({employeeId:["",h.required],type:["equipment",h.required],title:["",h.required],description:[""],priority:["medium"],items:this.formBuilder.array([this.createItemFormGroup()])})}ngOnInit(){if(this.id=this.route.snapshot.params.id,this.isEditMode=!!this.id,this.form.get("type")?.valueChanges.subscribe(e=>{this.updateFormForType(e)}),this.isEditMode){if(this.loading=!0,console.log(`Loading request with ID: ${this.id}`),!this.id||isNaN(+this.id)){console.error("Invalid request ID:",this.id),this.alertService.error("Invalid request ID"),this.loading=!1,this.router.navigate(["/admin/requests"]);return}this.requestService.getById(+this.id).pipe(C()).subscribe({next:e=>{if(console.log("Received request details:",e),!e){this.alertService.error("Request not found"),this.loading=!1,this.router.navigate(["/admin/requests"]);return}try{e.details=e.details||{},e.type||(e.type="equipment"),e.status||(e.status="pending"),e.title||(e.title="Untitled Request"),this.request=e,console.log("Request successfully loaded and processed:",this.request)}catch(o){console.error("Error processing request data:",o),this.alertService.error("Error processing request data"),this.loading=!1,setTimeout(()=>this.router.navigate(["/admin/requests"]),2e3);return}for(;this.itemsArray.length;)this.itemsArray.removeAt(0);e.details||(e.details={}),e.type?.toLowerCase()==="equipment"&&e.details?.items&&Array.isArray(e.details.items)?e.details.items.forEach(o=>{this.itemsArray.push(this.formBuilder.group({name:[o.name,h.required],quantity:[o.quantity,[h.required,h.min(1)]]}))}):this.itemsArray.push(this.createItemFormGroup()),this.form.patchValue({employeeId:e.employeeId,type:e.type,title:e.title||"",description:e.description||"",priority:e.priority||"medium"}),this.loading=!1},error:e=>{console.error("Error loading request details:",e),this.alertService.error("Error loading request details. Please try again."),this.loading=!1,setTimeout(()=>{this.router.navigate(["/admin/requests"])},2e3)}})}else this.loadEmployees()}get f(){return this.form.controls}get itemsArray(){return this.form.get("items")}createItemFormGroup(){return this.formBuilder.group({name:["",h.required],quantity:[1,[h.required,h.min(1)]]})}addItem(){this.itemsArray.push(this.createItemFormGroup())}removeItem(e){this.itemsArray.length>1&&this.itemsArray.removeAt(e)}updateFormForType(e){(e.toLowerCase()==="equipment"||e.toLowerCase()==="resources")&&this.itemsArray.length===0&&this.addItem()}loadEmployees(){this.employeeService.getAll().pipe(C()).subscribe({next:e=>{this.employees=e},error:e=>{this.alertService.error("Error loading employees"),console.error(e)}})}onSubmit(){if(this.submitted=!0,this.alertService.clear(),this.form.invalid)return;this.loading=!0;let e=this.form.value,o={employeeId:e.employeeId,type:e.type,title:e.title||`New ${e.type} request`,description:e.description,priority:e.priority||"medium"};(e.type.toLowerCase()==="equipment"||e.type.toLowerCase()==="resources")&&(o.items=e.items.map(l=>({name:l.name,quantity:l.quantity}))),this.isEditMode?this.updateRequest(o):this.createRequest(o)}createRequest(e){this.requestService.create(e).pipe(C()).subscribe({next:()=>{this.alertService.success("Request created successfully",{keepAfterRouteChange:!0}),this.router.navigate(["/admin/requests"])},error:o=>{this.alertService.error(o),this.loading=!1}})}updateRequest(e){this.requestService.update(+this.id,e).pipe(C()).subscribe({next:()=>{this.alertService.success("Request updated successfully",{keepAfterRouteChange:!0}),this.router.navigate(["/admin/requests"])},error:o=>{this.alertService.error(o),this.loading=!1}})}getStatusClass(e){switch(e.toLowerCase()){case"approved":return"status-success";case"rejected":return"status-danger";case"pending":return"status-warning";default:return"status-info"}}openApproveModal(){this.approvalComments="",this.showApproveModal=!0}openRejectModal(){this.rejectionReason="",this.showRejectModal=!0}cancelModal(){this.showApproveModal=!1,this.showRejectModal=!1}approveRequest(){this.id&&(this.submitting=!0,this.requestService.approve(+this.id,this.approvalComments).pipe(C()).subscribe({next:()=>{this.alertService.success("Request approved successfully",{keepAfterRouteChange:!0}),this.showApproveModal=!1,this.submitting=!1,this.router.navigate(["/admin/requests"])},error:e=>{this.alertService.error("Failed to approve request: "+e),this.submitting=!1}}))}rejectRequest(){!this.id||!this.rejectionReason||(this.submitting=!0,this.requestService.reject(+this.id,this.rejectionReason).pipe(C()).subscribe({next:()=>{this.alertService.success("Request rejected successfully",{keepAfterRouteChange:!0}),this.showRejectModal=!1,this.submitting=!1,this.router.navigate(["/admin/requests"])},error:e=>{this.alertService.error("Failed to reject request: "+e),this.submitting=!1}}))}static{this.\u0275fac=function(o){return new(o||i)(x(xe),x(L),x(D),x(O),x(Me),x($))}}static{this.\u0275cmp=S({type:i,selectors:[["app-request-form"]],decls:51,vars:19,consts:[[1,"main-content"],[1,"card"],[1,"card-header"],[1,"form-title"],[1,"card-body"],["class","request-summary",4,"ngIf"],[1,"request-form",3,"ngSubmit","formGroup"],[1,"form-grid"],[1,"form-column"],[1,"form-group"],["formControlName","type",1,"form-control",3,"ngClass","disabled"],["value","equipment"],["value","leave"],["value","transfer"],["value","promotion"],["value","resources"],["value","other"],["class","invalid-feedback",4,"ngIf"],["type","text","formControlName","title","placeholder","Enter a descriptive title",1,"form-control",3,"ngClass"],["formControlName","description","rows","4","placeholder","Provide details about this request",1,"form-control"],["class","form-group",4,"ngIf"],["class","items-section mt-4",4,"ngIf"],[1,"action-buttons"],[1,"main-actions"],["type","submit",1,"btn","btn-primary",3,"disabled"],["class","spinner-border spinner-border-sm mr-1",4,"ngIf"],[1,"fas","fa-save"],["routerLink","/admin/requests",1,"btn","btn-outline-secondary"],[1,"fas","fa-times"],["class","approval-actions",4,"ngIf"],["class","modal-backdrop",3,"click",4,"ngIf"],[1,"request-summary"],[1,"request-badge-container"],[1,"status-badge",3,"ngClass"],[1,"request-info-grid"],[1,"info-box"],[1,"info-content"],[1,"fas","fa-id-badge"],[1,"fas","fa-user"],[1,"fas","fa-envelope"],[1,"fas","fa-calendar-alt"],[1,"fas","fa-tag"],[1,"fas","fa-info-circle"],[1,"status-text",3,"ngClass"],[1,"invalid-feedback"],[4,"ngIf"],["formControlName","employeeId",1,"form-control",3,"ngClass"],["value",""],[3,"value",4,"ngFor","ngForOf"],[3,"value"],[1,"items-section","mt-4"],[1,"section-title"],[1,"fas","fa-box"],["formArrayName","items",1,"items-container"],["class","item-card",4,"ngFor","ngForOf"],["type","button",1,"btn","btn-outline-primary","mt-3",3,"click"],[1,"fas","fa-plus"],[1,"item-card"],[1,"item-form",3,"formGroupName"],[1,"item-header"],["type","button","class","btn btn-outline-danger btn-sm",3,"click",4,"ngIf"],[1,"item-fields"],["type","text","formControlName","name","placeholder","Enter item name",1,"form-control",3,"ngClass"],["type","number","formControlName","quantity","min","1","placeholder","Enter quantity",1,"form-control",3,"ngClass"],["type","button",1,"btn","btn-outline-danger","btn-sm",3,"click"],[1,"spinner-border","spinner-border-sm","mr-1"],[1,"approval-actions"],[1,"section-title","mt-4"],[1,"btn-group"],["type","button",1,"btn","btn-success",3,"click"],[1,"fas","fa-check"],["type","button",1,"btn","btn-danger",3,"click"],[1,"modal-backdrop",3,"click"],[1,"modal-dialog",3,"click"],[1,"modal-content"],[1,"modal-header"],[1,"modal-title"],[1,"fas","fa-check-circle"],["type","button",1,"close",3,"click"],[1,"modal-body"],[1,"alert","alert-info"],[1,"modal-info"],[1,"form-group","mt-3"],["rows","3","placeholder","Add any additional notes about this approval",1,"form-control",3,"ngModelChange","ngModel"],[1,"modal-footer"],["type","button",1,"btn","btn-outline-secondary",3,"click"],["type","button",1,"btn","btn-success",3,"click","disabled"],[1,"mt-3"],[1,"table","table-sm","table-striped"],[4,"ngFor","ngForOf"],[1,"fas","fa-times-circle"],[1,"alert","alert-warning"],[1,"text-danger"],["rows","3","required","","placeholder","Please provide a reason for rejecting this request",1,"form-control",3,"ngModelChange","ngModel"],[1,"text-muted"],["type","button",1,"btn","btn-danger",3,"click","disabled"]],template:function(o,l){if(o&1&&(n(0,"div",0)(1,"div",1)(2,"div",2)(3,"h2",3),r(4),t()(),n(5,"div",4),m(6,Ae,45,13,"div",5),n(7,"form",6),_("ngSubmit",function(){return l.onSubmit()}),n(8,"div",7)(9,"div",8)(10,"div",9)(11,"label"),r(12,"Request Type"),t(),n(13,"select",10)(14,"option",11),r(15,"Equipment"),t(),n(16,"option",12),r(17,"Leave"),t(),n(18,"option",13),r(19,"Transfer"),t(),n(20,"option",14),r(21,"Promotion"),t(),n(22,"option",15),r(23,"Resources"),t(),n(24,"option",16),r(25,"Other"),t()(),m(26,Ne,2,1,"div",17),t(),n(27,"div",9)(28,"label"),r(29,"Request Title"),t(),p(30,"input",18),m(31,Le,2,1,"div",17),t(),n(32,"div",9)(33,"label"),r(34,"Description"),t(),p(35,"textarea",19),t()(),n(36,"div",8),m(37,Ue,8,5,"div",20),t()(),m(38,Ke,9,2,"div",21),n(39,"div",22)(40,"div",23)(41,"button",24),m(42,Xe,1,0,"span",25),p(43,"i",26),r(44," Save Changes "),t(),n(45,"a",27),p(46,"i",28),r(47," Cancel "),t()(),m(48,Ze,10,0,"div",29),t()()()()(),m(49,it,39,8,"div",30)(50,at,43,8,"div",30)),o&2){let u;a(4),b(l.isEditMode?"Edit Request":"Add Request"),a(2),s("ngIf",l.isEditMode),a(),s("formGroup",l.form),a(6),s("ngClass",w(15,R,l.submitted&&l.f.type.errors))("disabled",l.isEditMode),a(13),s("ngIf",l.submitted&&l.f.type.errors),a(4),s("ngClass",w(17,R,l.submitted&&l.f.title.errors)),a(),s("ngIf",l.submitted&&l.f.title.errors),a(6),s("ngIf",!l.isEditMode),a(),s("ngIf",((u=l.form.get("type"))==null?null:u.value)==="equipment"||((u=l.form.get("type"))==null?null:u.value)==="resources"),a(3),s("disabled",l.loading),a(),s("ngIf",l.loading),a(6),s("ngIf",l.isEditMode&&(l.request==null||l.request.status==null?null:l.request.status.toLowerCase())==="pending"),a(),s("ngIf",l.showApproveModal),a(),s("ngIf",l.showRejectModal)}},dependencies:[A,j,N,ae,ge,fe,ie,se,ue,re,oe,ve,_e,de,pe,ce,me,le,z,V],styles:[`

    .main-content[_ngcontent-%COMP%] {
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .card[_ngcontent-%COMP%] {
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        border: none;
        margin-bottom: 20px;
    }
    
    .card-header[_ngcontent-%COMP%] {
        background-color: #f8f9fa;
        border-bottom: 1px solid #eaeaea;
        padding: 16px 20px;
        border-radius: 8px 8px 0 0;
    }
    
    .form-title[_ngcontent-%COMP%] {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
        color: #2c3e50;
    }
    
    .card-body[_ngcontent-%COMP%] {
        padding: 24px 20px;
    }
    
    

    .request-summary[_ngcontent-%COMP%] {
        background-color: #f8f9fa;
        border-radius: 6px;
        padding: 20px;
        margin-bottom: 30px;
        position: relative;
    }
    
    .request-badge-container[_ngcontent-%COMP%] {
        position: absolute;
        top: -12px;
        right: 20px;
    }
    
    .request-info-grid[_ngcontent-%COMP%] {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }
    
    .info-box[_ngcontent-%COMP%] {
        background-color: #ffffff;
        border-radius: 6px;
        padding: 16px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.05);
    }
    
    .info-box[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {
        margin-top: 0;
        margin-bottom: 12px;
        color: #3498db;
        font-size: 16px;
        font-weight: 600;
        padding-bottom: 8px;
        border-bottom: 1px solid #eaeaea;
    }
    
    .info-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
        margin-bottom: 8px;
        font-size: 14px;
    }
    
    .info-content[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {
        color: #6c757d;
        width: 20px;
        text-align: center;
        margin-right: 8px;
    }
    
    

    .request-form[_ngcontent-%COMP%] {
        padding-top: 10px;
    }
    
    .form-grid[_ngcontent-%COMP%] {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 24px;
    }
    
    .form-group[_ngcontent-%COMP%] {
        margin-bottom: 20px;
    }
    
    label[_ngcontent-%COMP%] {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #4a5568;
        font-size: 14px;
    }
    
    .form-control[_ngcontent-%COMP%] {
        display: block;
        width: 100%;
        padding: 10px 12px;
        font-size: 14px;
        line-height: 1.5;
        color: #495057;
        background-color: #fff;
        border: 1px solid #ced4da;
        border-radius: 5px;
        transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    }
    
    .form-control[_ngcontent-%COMP%]:focus {
        outline: 0;
        border-color: #80bdff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
    
    .form-control[_ngcontent-%COMP%]:disabled {
        background-color: #e9ecef;
        opacity: 1;
    }
    
    .form-control[_ngcontent-%COMP%]::placeholder {
        color: #adb5bd;
    }
    
    

    .status-badge[_ngcontent-%COMP%] {
        display: inline-block;
        padding: 6px 10px;
        border-radius: 20px;
        color: white;
        text-align: center;
        font-size: 12px;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        font-weight: 600;
        min-width: 100px;
    }
    
    .status-text[_ngcontent-%COMP%] {
        font-weight: 600;
    }
    
    .status-success[_ngcontent-%COMP%] {
        background-color: #28a745;
    }
    
    .status-warning[_ngcontent-%COMP%] {
        background-color: #ffc107;
        color: #212529;
    }
    
    .status-danger[_ngcontent-%COMP%] {
        background-color: #dc3545;
    }
    
    .status-info[_ngcontent-%COMP%] {
        background-color: #17a2b8;
    }
    
    

    .section-title[_ngcontent-%COMP%] {
        font-size: 18px;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 16px;
        padding-bottom: 8px;
        border-bottom: 1px solid #eaeaea;
    }
    
    .items-container[_ngcontent-%COMP%] {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
    }
    
    .item-card[_ngcontent-%COMP%] {
        background-color: #f8f9fa;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid #eaeaea;
    }
    
    .item-header[_ngcontent-%COMP%] {
        background-color: #f1f3f5;
        padding: 10px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .item-header[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%] {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #3d5170;
    }
    
    .item-form[_ngcontent-%COMP%] {
        padding: 0;
    }
    
    .item-fields[_ngcontent-%COMP%] {
        padding: 12px;
    }
    
    

    .action-buttons[_ngcontent-%COMP%] {
        margin-top: 30px;
        border-top: 1px solid #eaeaea;
        padding-top: 20px;
    }
    
    .main-actions[_ngcontent-%COMP%] {
        display: flex;
        gap: 10px;
    }
    
    .approval-actions[_ngcontent-%COMP%] {
        margin-top: 20px;
    }
    
    .btn-group[_ngcontent-%COMP%] {
        display: flex;
        gap: 10px;
    }
    
    .btn[_ngcontent-%COMP%] {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        border: 1px solid transparent;
        padding: 8px 16px;
        font-size: 14px;
        line-height: 1.5;
        border-radius: 5px;
        transition: all 0.2s ease-in-out;
    }
    
    .btn[_ngcontent-%COMP%]   i[_ngcontent-%COMP%] {
        margin-right: 6px;
    }
    
    .btn-primary[_ngcontent-%COMP%] {
        color: #fff;
        background-color: #007bff;
        border-color: #007bff;
    }
    
    .btn-primary[_ngcontent-%COMP%]:hover {
        background-color: #0069d9;
        border-color: #0062cc;
    }
    
    .btn-outline-secondary[_ngcontent-%COMP%] {
        color: #6c757d;
        border-color: #6c757d;
        background-color: transparent;
    }
    
    .btn-outline-secondary[_ngcontent-%COMP%]:hover {
        color: #fff;
        background-color: #6c757d;
        border-color: #6c757d;
    }
    
    .btn-outline-primary[_ngcontent-%COMP%] {
        color: #007bff;
        border-color: #007bff;
        background-color: transparent;
    }
    
    .btn-outline-primary[_ngcontent-%COMP%]:hover {
        color: #fff;
        background-color: #007bff;
        border-color: #007bff;
    }
    
    .btn-outline-danger[_ngcontent-%COMP%] {
        color: #dc3545;
        border-color: #dc3545;
        background-color: transparent;
    }
    
    .btn-outline-danger[_ngcontent-%COMP%]:hover {
        color: #fff;
        background-color: #dc3545;
        border-color: #dc3545;
    }
    
    .btn-success[_ngcontent-%COMP%] {
        color: #fff;
        background-color: #28a745;
        border-color: #28a745;
    }
    
    .btn-success[_ngcontent-%COMP%]:hover {
        background-color: #218838;
        border-color: #1e7e34;
    }
    
    .btn-danger[_ngcontent-%COMP%] {
        color: #fff;
        background-color: #dc3545;
        border-color: #dc3545;
    }
    
    .btn-danger[_ngcontent-%COMP%]:hover {
        background-color: #c82333;
        border-color: #bd2130;
    }
    
    .btn-sm[_ngcontent-%COMP%] {
        padding: 4px 8px;
        font-size: 12px;
    }
    
    

    .is-invalid[_ngcontent-%COMP%] {
        border-color: #dc3545;
    }
    
    .invalid-feedback[_ngcontent-%COMP%] {
        display: block;
        width: 100%;
        margin-top: 0.25rem;
        font-size: 80%;
        color: #dc3545;
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
        width: 100%;
        margin: 1.75rem auto;
    }
    
    .modal-content[_ngcontent-%COMP%] {
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }
    
    .modal-header[_ngcontent-%COMP%] {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        border-bottom: 1px solid #eaeaea;
    }
    
    .modal-title[_ngcontent-%COMP%] {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: #2c3e50;
    }
    
    .modal-body[_ngcontent-%COMP%] {
        padding: 20px;
    }
    
    .modal-footer[_ngcontent-%COMP%] {
        padding: 16px 20px;
        border-top: 1px solid #eaeaea;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
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
    
    

    .alert[_ngcontent-%COMP%] {
        position: relative;
        padding: 12px 16px;
        margin-bottom: 16px;
        border: 1px solid transparent;
        border-radius: 5px;
    }
    
    .alert-info[_ngcontent-%COMP%] {
        color: #0c5460;
        background-color: #d1ecf1;
        border-color: #bee5eb;
    }
    
    .alert-warning[_ngcontent-%COMP%] {
        color: #856404;
        background-color: #fff3cd;
        border-color: #ffeeba;
    }
    
    

    .table[_ngcontent-%COMP%] {
        width: 100%;
        margin-bottom: 1rem;
        color: #212529;
        border-collapse: collapse;
    }
    
    .table-sm[_ngcontent-%COMP%]   th[_ngcontent-%COMP%], .table-sm[_ngcontent-%COMP%]   td[_ngcontent-%COMP%] {
        padding: 6px 10px;
        font-size: 13px;
    }
    
    .table-striped[_ngcontent-%COMP%]   tbody[_ngcontent-%COMP%]   tr[_ngcontent-%COMP%]:nth-of-type(odd) {
        background-color: rgba(0, 0, 0, 0.05);
    }
    
    .modal-info[_ngcontent-%COMP%] {
        background-color: #f8f9fa;
        padding: 12px 15px;
        border-radius: 5px;
        margin-bottom: 16px;
    }
    
    .modal-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
        margin-bottom: 8px;
        font-size: 14px;
    }
    
    .modal-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:last-child {
        margin-bottom: 0;
    }
    
    

    .mt-2[_ngcontent-%COMP%] {
        margin-top: 0.5rem;
    }
    
    .mt-3[_ngcontent-%COMP%] {
        margin-top: 1rem;
    }
    
    .mt-4[_ngcontent-%COMP%] {
        margin-top: 1.5rem;
    }
    
    .text-danger[_ngcontent-%COMP%] {
        color: #dc3545;
    }
    
    .text-muted[_ngcontent-%COMP%] {
        color: #6c757d;
        font-size: 12px;
    }
    
    

    @media (max-width: 768px) {
        .form-grid[_ngcontent-%COMP%], .request-info-grid[_ngcontent-%COMP%] {
            grid-template-columns: 1fr;
        }
        
        .items-container[_ngcontent-%COMP%] {
            grid-template-columns: 1fr;
        }
    }`]})}}return i})();var st=[{path:"",component:Ee,children:[{path:"",component:Oe},{path:"add",component:Y},{path:"edit/:id",component:Y}]}],Ot=(()=>{class i{static{this.\u0275fac=function(o){return new(o||i)}}static{this.\u0275mod=Z({type:i})}static{this.\u0275inj=K({providers:[O],imports:[te,he,be,Q,Q.forChild(st)]})}}return i})();export{Ot as RequestsModule};
