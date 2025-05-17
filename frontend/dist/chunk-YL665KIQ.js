import{a as Pe}from"./chunk-B35XQXPZ.js";import{a as Ee,b as Oe,e as B}from"./chunk-4EMUCHMP.js";import{$ as V,A as t,Aa as Me,B as p,Ba as we,Da as z,E as M,Ea as Se,F as _,Fa as D,G as c,Ga as $,H as G,Ia as H,K as o,L as v,M as x,N as E,O as re,P as W,Q,R as Y,T as O,V as T,W as j,Z as A,_ as N,aa as L,ba as le,ca as ae,e as ee,h as q,ia as se,j as C,ja as h,k as F,ka as de,l as te,la as ce,m as ne,ma as me,n as ie,na as pe,o as S,oa as ue,p as oe,pa as ge,q as g,qa as fe,r as f,ra as _e,sa as xe,t as a,ta as ve,u as b,ua as be,v as m,va as he,w as s,wa as ye,xa as Ce,ya as qe,z as n}from"./chunk-U6ZOIJ5K.js";var Ie=(()=>{class i{static{this.\u0275fac=function(l){return new(l||i)}}static{this.\u0275cmp=S({type:i,selectors:[["app-requests"]],decls:4,vars:0,consts:[[1,"requests-container"],[1,"request-header"]],template:function(l,r){l&1&&(n(0,"div",0)(1,"h1",1),o(2,"REQUESTS"),t(),p(3,"router-outlet"),t())},dependencies:[Se],styles:[".requests-container[_ngcontent-%COMP%]{padding:0;border:1px solid #dee2e6;border-radius:4px;background-color:#fff;margin-bottom:1rem}.request-header[_ngcontent-%COMP%]{background-color:#f8f9fa;padding:1rem;margin:0;font-size:1.5rem;font-weight:700;border-bottom:1px solid #dee2e6}"]})}}return i})();var P=(()=>{class i{constructor(e){this.http=e,this.apiUrl=`${Ee.apiUrl}/requests`,console.log("RequestService initialized with API URL:",this.apiUrl)}handleError(e){return console.error("API Error:",e),e.error instanceof ErrorEvent?console.error("Client-side error:",e.error.message):console.error(`Backend returned code ${e.status}, body was: ${JSON.stringify(e.error)}`),ee(()=>new Error("Something went wrong. Please try again later."))}getAll(){return console.log("Making API request to:",this.apiUrl),this.http.get(this.apiUrl).pipe(F(e=>console.log("Received data:",e)),q(this.handleError))}getById(e){return console.log(`Getting request details for ID: ${e}`),this.http.get(`${this.apiUrl}/${e}`).pipe(F(l=>console.log("Received request details:",l)),q(this.handleError))}create(e){return console.log("Creating request with data:",e),this.http.post(this.apiUrl,e).pipe(F(l=>console.log("Create response:",l)),q(this.handleError))}update(e,l){return this.http.put(`${this.apiUrl}/${e}`,l).pipe(q(this.handleError))}delete(e){return this.http.delete(`${this.apiUrl}/${e}`).pipe(q(this.handleError))}approve(e,l){return this.http.put(`${this.apiUrl}/${e}`,{status:"approved",details:l?{comments:l}:void 0}).pipe(q(this.handleError))}reject(e,l){return this.http.put(`${this.apiUrl}/${e}`,{status:"rejected",details:{reason:l}}).pipe(q(this.handleError))}static{this.\u0275fac=function(l){return new(l||i)(ie(ae))}}static{this.\u0275prov=te({token:i,factory:i.\u0275fac,providedIn:"root"})}}return i})();function Ae(i,d){if(i&1){let e=M();n(0,"tr")(1,"td"),o(2),t(),n(3,"td"),o(4),t(),n(5,"td"),o(6),T(7,"date"),t(),n(8,"td")(9,"span",6),o(10),t()(),n(11,"td",7)(12,"button",8),_("click",function(){let r=g(e).$implicit,u=c();return f(u.viewDetails(r.id))}),o(13,"Edit"),t()()()}if(i&2){let e=d.$implicit,l=c();a(2),E("",e.employee==null||e.employee.account==null?null:e.employee.account.firstName," ",e.employee==null||e.employee.account==null?null:e.employee.account.lastName,""),a(2),v(e.type),a(2),v(j(7,6,e.created,"M/d/yyyy")),a(3),s("ngClass",l.getStatusClass(e.status)),a(),x(" ",e.status," ")}}function Ne(i,d){i&1&&p(0,"span",11)}function Ve(i,d){i&1&&(n(0,"span"),o(1,"No requests found"),t())}function Le(i,d){if(i&1&&(n(0,"tr")(1,"td",9),m(2,Ne,1,0,"span",10)(3,Ve,2,0,"span",3),t()()),i&2){let e=c();a(2),s("ngIf",e.loading),a(),s("ngIf",!e.loading)}}var Fe=(()=>{class i{constructor(e,l,r,u,w){this.requestService=e,this.alertService=l,this.accountService=r,this.router=u,this.route=w,this.requests=[],this.loading=!1}ngOnInit(){let e=this.accountService.accountValue;if(!e){this.alertService.error("You must be logged in to view requests"),this.router.navigate(["/account/login"]);return}if(e.role!=="Admin"){this.alertService.error("You must have admin privileges to view requests"),this.router.navigate(["/"]);return}this.loading=!0,this.loadRequests()}loadRequests(){console.log("Loading requests..."),this.alertService.clear(),this.requestService.getAll().pipe(C()).subscribe({next:e=>{console.log("Requests loaded successfully:",e),this.requests=e,this.loading=!1,e.length===0&&console.log("No requests found")},error:e=>{console.error("Error loading requests:",e),this.alertService.error("Failed to load requests: "+(e.message||"Unknown error")),this.loading=!1}})}viewDetails(e){this.router.navigate(["edit",e],{relativeTo:this.route})}getStatusClass(e){switch(e.toLowerCase()){case"approved":return"status-success";case"rejected":return"status-danger";case"pending":return"status-warning";default:return"status-info"}}static{this.\u0275fac=function(l){return new(l||i)(b(P),b(B),b(Oe),b(D),b(z))}}static{this.\u0275cmp=S({type:i,selectors:[["app-request-list"]],decls:20,vars:2,consts:[[1,"table-responsive"],[1,"table","table-bordered"],[4,"ngFor","ngForOf"],[4,"ngIf"],[1,"mt-2"],["routerLink","add",1,"btn","btn-success"],[1,"status-badge",3,"ngClass"],[1,"action-buttons"],[1,"btn","btn-info",3,"click"],["colspan","5",1,"text-center"],["class","spinner-border spinner-border-lg align-center",4,"ngIf"],[1,"spinner-border","spinner-border-lg","align-center"]],template:function(l,r){l&1&&(n(0,"div",0)(1,"table",1)(2,"thead")(3,"tr")(4,"th"),o(5,"Employee"),t(),n(6,"th"),o(7,"Type"),t(),n(8,"th"),o(9,"Date"),t(),n(10,"th"),o(11,"Status"),t(),n(12,"th"),o(13,"Actions"),t()()(),n(14,"tbody"),m(15,Ae,14,9,"tr",2)(16,Le,4,2,"tr",3),t()()(),n(17,"div",4)(18,"a",5),o(19,"Create Request"),t()()),l&2&&(a(15),s("ngForOf",r.requests),a(),s("ngIf",!r.requests||r.requests.length===0))},dependencies:[A,N,V,$,L],styles:[`.table[_ngcontent-%COMP%] {
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
    }`]})}}return i})();var R=i=>({"is-invalid":i});function ze(i,d){if(i&1&&(n(0,"div",34)(1,"div",35)(2,"span",36),o(3),t()(),n(4,"div",37)(5,"div",38)(6,"h4"),o(7,"Employee Information"),t(),n(8,"div",39)(9,"p"),p(10,"i",40),n(11,"strong"),o(12,"ID:"),t(),o(13),t(),n(14,"p"),p(15,"i",41),n(16,"strong"),o(17,"Name:"),t(),o(18),t(),n(19,"p"),p(20,"i",42),n(21,"strong"),o(22,"Email:"),t(),o(23),t()()(),n(24,"div",38)(25,"h4"),o(26,"Request Details"),t(),n(27,"div",39)(28,"p"),p(29,"i",43),n(30,"strong"),o(31,"Date:"),t(),o(32),T(33,"date"),t(),n(34,"p"),p(35,"i",44),n(36,"strong"),o(37,"Type:"),t(),o(38),t(),n(39,"p"),p(40,"i",45),n(41,"strong"),o(42,"Status:"),t(),n(43,"span",46),o(44),t()()()()()()),i&2){let e=c();a(2),s("ngClass",e.getStatusClass((e.request==null?null:e.request.status)||"")),a(),x(" ",e.request==null?null:e.request.status," "),a(10),x(" ",(e.request==null||e.request.employee==null?null:e.request.employee.employeeNumber)||"N/A",""),a(5),E(" ",(e.request==null||e.request.employee==null||e.request.employee.account==null?null:e.request.employee.account.firstName)||""," ",(e.request==null||e.request.employee==null||e.request.employee.account==null?null:e.request.employee.account.lastName)||"",""),a(5),x(" ",(e.request==null||e.request.employee==null||e.request.employee.account==null?null:e.request.employee.account.email)||"N/A",""),a(9),x(" ",j(33,10,e.request==null?null:e.request.created,"MMM d, yyyy"),""),a(6),x(" ",e.request==null?null:e.request.type,""),a(5),s("ngClass",e.getStatusClass((e.request==null?null:e.request.status)||"")),a(),v(e.request==null?null:e.request.status)}}function De(i,d){i&1&&(n(0,"div"),o(1,"Type is required"),t())}function $e(i,d){if(i&1&&(n(0,"div",47),m(1,De,2,0,"div",48),t()),i&2){let e=c();a(),s("ngIf",e.f.type.errors.required)}}function Be(i,d){i&1&&(n(0,"div"),o(1,"Title is required"),t())}function Ue(i,d){if(i&1&&(n(0,"div",47),m(1,Be,2,0,"div",48),t()),i&2){let e=c();a(),s("ngIf",e.f.title.errors.required)}}function Ge(i,d){if(i&1&&(n(0,"option",52),o(1),t()),i&2){let e=d.$implicit;s("value",e.id),a(),re(" ",e.employeeNumber," - ",e.account==null?null:e.account.firstName," ",e.account==null?null:e.account.lastName," ")}}function We(i,d){i&1&&(n(0,"div"),o(1,"Employee is required"),t())}function Qe(i,d){if(i&1&&(n(0,"div",47),m(1,We,2,0,"div",48),t()),i&2){let e=c(2);a(),s("ngIf",e.f.employeeId.errors.required)}}function Ye(i,d){if(i&1&&(n(0,"div",11)(1,"label"),o(2,"Select Employee"),t(),n(3,"select",49)(4,"option",50),o(5,"-- Select an employee --"),t(),m(6,Ge,2,4,"option",51),t(),m(7,Qe,2,1,"div",20),t()),i&2){let e=c();a(3),s("ngClass",O(3,R,e.submitted&&e.f.employeeId.errors)),a(3),s("ngForOf",e.employees),a(),s("ngIf",e.submitted&&e.f.employeeId.errors)}}function He(i,d){if(i&1){let e=M();n(0,"button",68),_("click",function(){g(e);let r=c().index,u=c(2);return f(u.removeItem(r))}),p(1,"i",31),o(2," Remove "),t()}}function Je(i,d){if(i&1&&(n(0,"div"),o(1),t()),i&2){let e,l=c(4);a(),x("",((e=l.form.get("type"))==null?null:e.value)==="leave"?"Leave type":"Name"," is required")}}function Ke(i,d){if(i&1&&(n(0,"div",47),m(1,Je,2,1,"div",48),t()),i&2){let e,l=c().$implicit;a(),s("ngIf",(e=l.get("name"))==null||e.errors==null?null:e.errors.required)}}function Xe(i,d){if(i&1&&(n(0,"div"),o(1),t()),i&2){let e,l=c(4);a(),x("",((e=l.form.get("type"))==null?null:e.value)==="leave"?"Number of days":"Quantity"," is required")}}function Ze(i,d){if(i&1&&(n(0,"div"),o(1),t()),i&2){let e,l=c(4);a(),x("Minimum ",((e=l.form.get("type"))==null?null:e.value)==="leave"?"days":"quantity"," is 1")}}function et(i,d){if(i&1&&(n(0,"div",47),m(1,Xe,2,1,"div",48)(2,Ze,2,1,"div",48),t()),i&2){let e,l,r=c().$implicit;a(),s("ngIf",(e=r.get("quantity"))==null||e.errors==null?null:e.errors.required),a(),s("ngIf",(l=r.get("quantity"))==null||l.errors==null?null:l.errors.min)}}function tt(i,d){if(i&1&&(n(0,"div",61)(1,"div",62)(2,"div",63)(3,"h5"),o(4),t(),m(5,He,3,0,"button",64),t(),n(6,"div",65)(7,"div",11)(8,"label"),o(9),t(),p(10,"input",66),m(11,Ke,2,1,"div",20),t(),n(12,"div",11)(13,"label"),o(14),t(),p(15,"input",67),m(16,et,3,2,"div",20),t()()()()),i&2){let e,l,r,u,w,I,K,X,k=d.$implicit,Z=d.index,y=c(2);a(),s("formGroupName",Z),a(3),x("Item #",Z+1,""),a(),s("ngIf",y.itemsArray.length>1),a(4),v(((e=y.form.get("type"))==null?null:e.value)==="leave"?"Leave Type":"Item Name"),a(),G("placeholder",((l=y.form.get("type"))==null?null:l.value)==="leave"?"Enter leave type (e.g. Vacation, Sick, Personal)":"Enter item name"),s("ngClass",O(11,R,y.submitted&&((r=k.get("name"))==null?null:r.errors))),a(),s("ngIf",y.submitted&&((u=k.get("name"))==null?null:u.errors)),a(3),v(((w=y.form.get("type"))==null?null:w.value)==="leave"?"Days":"Quantity"),a(),G("placeholder",((I=y.form.get("type"))==null?null:I.value)==="leave"?"Enter number of days":"Enter quantity"),s("ngClass",O(13,R,y.submitted&&((K=k.get("quantity"))==null?null:K.errors))),a(),s("ngIf",y.submitted&&((X=k.get("quantity"))==null?null:X.errors))}}function nt(i,d){if(i&1){let e=M();n(0,"div",53)(1,"h4",8),p(2,"i",54),o(3),t(),n(4,"div",55)(5,"div",56),m(6,tt,17,15,"div",57),t(),n(7,"div",58)(8,"button",59),_("click",function(){g(e);let r=c();return f(r.addItem())}),p(9,"i",60),o(10),t()()()()}if(i&2){let e,l,r=c();a(3),x(" ",((e=r.form.get("type"))==null?null:e.value)==="leave"?"Leave":((e=r.form.get("type"))==null?null:e.value)==="equipment"?"Equipment":"Resources"," Items "),a(3),s("ngForOf",r.itemsArray.controls),a(4),x(" Add Another ",((l=r.form.get("type"))==null?null:l.value)==="leave"?"Leave Period":"Item"," ")}}function it(i,d){i&1&&p(0,"span",69)}function ot(i,d){if(i&1){let e=M();n(0,"div",70)(1,"h4",71),o(2,"Request Actions"),t(),n(3,"div",72)(4,"button",73),_("click",function(){g(e);let r=c();return f(r.openApproveModal())}),p(5,"i",74),o(6," Approve Request "),t(),n(7,"button",75),_("click",function(){g(e);let r=c();return f(r.openRejectModal())}),p(8,"i",31),o(9," Reject Request "),t()()()}}function rt(i,d){if(i&1&&(n(0,"tr")(1,"td"),o(2),t(),n(3,"td"),o(4),t(),n(5,"td"),o(6),t()()),i&2){let e=d.$implicit,l=d.index;a(2),v(l+1),a(2),v(e.name),a(2),v(e.quantity)}}function lt(i,d){if(i&1&&(n(0,"div")(1,"h6",91),o(2,"Items"),t(),n(3,"table",92)(4,"thead")(5,"tr")(6,"th"),o(7,"#"),t(),n(8,"th"),o(9,"Name"),t(),n(10,"th"),o(11,"Quantity"),t()()(),n(12,"tbody"),m(13,rt,7,3,"tr",93),t()()()),i&2){let e=c(2);a(13),s("ngForOf",e.request==null||e.request.details==null?null:e.request.details.items)}}function at(i,d){i&1&&p(0,"span",69)}function st(i,d){if(i&1){let e=M();n(0,"div",76),_("click",function(){g(e);let r=c();return f(r.cancelModal())}),n(1,"div",77),_("click",function(r){return g(e),f(r.stopPropagation())}),n(2,"div",78)(3,"div",79)(4,"h5",80),p(5,"i",81),o(6," Approve Request"),t(),n(7,"button",82),_("click",function(){g(e);let r=c();return f(r.cancelModal())}),o(8,"\xD7"),t()(),n(9,"div",83)(10,"div",11)(11,"div",84)(12,"p"),o(13,"Are you sure you want to approve this request?"),t()(),n(14,"div",85)(15,"p")(16,"strong"),o(17,"Type:"),t(),o(18),t(),n(19,"p")(20,"strong"),o(21,"Employee:"),t(),o(22),t(),n(23,"p")(24,"strong"),o(25,"Title:"),t(),o(26),t()(),m(27,lt,14,1,"div",48),n(28,"div",86)(29,"label"),o(30,"Comments (Optional):"),t(),n(31,"textarea",87),Y("ngModelChange",function(r){g(e);let u=c();return Q(u.approvalComments,r)||(u.approvalComments=r),f(r)}),t()()()(),n(32,"div",88)(33,"button",89),_("click",function(){g(e);let r=c();return f(r.cancelModal())}),o(34,"Cancel"),t(),n(35,"button",90),_("click",function(){g(e);let r=c();return f(r.approveRequest())}),m(36,at,1,0,"span",28),p(37,"i",74),o(38," Confirm Approval "),t()()()()()}if(i&2){let e=c();a(18),x(" ",e.request==null?null:e.request.type,""),a(4),E(" ",e.request==null||e.request.employee==null||e.request.employee.account==null?null:e.request.employee.account.firstName," ",e.request==null||e.request.employee==null||e.request.employee.account==null?null:e.request.employee.account.lastName,""),a(4),x(" ",e.request==null?null:e.request.title,""),a(),s("ngIf",(e.request==null||e.request.type==null?null:e.request.type.toLowerCase())==="equipment"||(e.request==null||e.request.type==null?null:e.request.type.toLowerCase())==="resources"),a(4),W("ngModel",e.approvalComments),a(4),s("disabled",e.submitting),a(),s("ngIf",e.submitting)}}function dt(i,d){if(i&1&&(n(0,"tr")(1,"td"),o(2),t(),n(3,"td"),o(4),t(),n(5,"td"),o(6),t()()),i&2){let e=d.$implicit,l=d.index;a(2),v(l+1),a(2),v(e.name),a(2),v(e.quantity)}}function ct(i,d){if(i&1&&(n(0,"div")(1,"h6",91),o(2,"Items"),t(),n(3,"table",92)(4,"thead")(5,"tr")(6,"th"),o(7,"#"),t(),n(8,"th"),o(9,"Name"),t(),n(10,"th"),o(11,"Quantity"),t()()(),n(12,"tbody"),m(13,dt,7,3,"tr",93),t()()()),i&2){let e=c(2);a(13),s("ngForOf",e.request==null||e.request.details==null?null:e.request.details.items)}}function mt(i,d){i&1&&p(0,"span",69)}function pt(i,d){if(i&1){let e=M();n(0,"div",76),_("click",function(){g(e);let r=c();return f(r.cancelModal())}),n(1,"div",77),_("click",function(r){return g(e),f(r.stopPropagation())}),n(2,"div",78)(3,"div",79)(4,"h5",80),p(5,"i",94),o(6," Reject Request"),t(),n(7,"button",82),_("click",function(){g(e);let r=c();return f(r.cancelModal())}),o(8,"\xD7"),t()(),n(9,"div",83)(10,"div",11)(11,"div",95)(12,"p"),o(13,"Are you sure you want to reject this request?"),t()(),n(14,"div",85)(15,"p")(16,"strong"),o(17,"Type:"),t(),o(18),t(),n(19,"p")(20,"strong"),o(21,"Employee:"),t(),o(22),t(),n(23,"p")(24,"strong"),o(25,"Title:"),t(),o(26),t()(),m(27,ct,14,1,"div",48),n(28,"div",86)(29,"label"),o(30,"Reason for Rejection: "),n(31,"span",96),o(32,"*"),t()(),n(33,"textarea",97),Y("ngModelChange",function(r){g(e);let u=c();return Q(u.rejectionReason,r)||(u.rejectionReason=r),f(r)}),t(),n(34,"small",98),o(35,"This information will be visible to the employee."),t()()()(),n(36,"div",88)(37,"button",89),_("click",function(){g(e);let r=c();return f(r.cancelModal())}),o(38,"Cancel"),t(),n(39,"button",99),_("click",function(){g(e);let r=c();return f(r.rejectRequest())}),m(40,mt,1,0,"span",28),p(41,"i",31),o(42," Confirm Rejection "),t()()()()()}if(i&2){let e=c();a(18),x(" ",e.request==null?null:e.request.type,""),a(4),E(" ",e.request==null||e.request.employee==null||e.request.employee.account==null?null:e.request.employee.account.firstName," ",e.request==null||e.request.employee==null||e.request.employee.account==null?null:e.request.employee.account.lastName,""),a(4),x(" ",e.request==null?null:e.request.title,""),a(),s("ngIf",(e.request==null||e.request.type==null?null:e.request.type.toLowerCase())==="equipment"||(e.request==null||e.request.type==null?null:e.request.type.toLowerCase())==="resources"),a(6),W("ngModel",e.rejectionReason),a(6),s("disabled",e.submitting||!e.rejectionReason),a(),s("ngIf",e.submitting)}}var J=(()=>{class i{constructor(e,l,r,u,w,I){this.formBuilder=e,this.route=l,this.router=r,this.requestService=u,this.employeeService=w,this.alertService=I,this.isEditMode=!1,this.loading=!1,this.submitted=!1,this.employees=[],this.request=null,this.showApproveModal=!1,this.showRejectModal=!1,this.approvalComments="",this.rejectionReason="",this.submitting=!1,this.form=this.formBuilder.group({employeeId:["",h.required],type:["equipment",h.required],title:["",h.required],description:[""],priority:["medium"],items:this.formBuilder.array([this.createItemFormGroup()])})}ngOnInit(){if(this.id=this.route.snapshot.params.id,this.isEditMode=!!this.id,this.form.get("type")?.valueChanges.subscribe(e=>{this.updateFormForType(e),setTimeout(()=>{this.adjustDropdownVisibility()},100)}),this.isEditMode){if(this.loading=!0,console.log(`Loading request with ID: ${this.id}`),!this.id||isNaN(+this.id)){console.error("Invalid request ID:",this.id),this.alertService.error("Invalid request ID"),this.loading=!1,this.router.navigate(["/admin/requests"]);return}this.requestService.getById(+this.id).pipe(C()).subscribe({next:e=>{if(console.log("Received request details:",e),!e){this.alertService.error("Request not found"),this.loading=!1,this.router.navigate(["/admin/requests"]);return}try{e.details=e.details||{},e.type||(e.type="equipment"),e.status||(e.status="pending"),e.title||(e.title="Untitled Request"),this.request=e,console.log("Request successfully loaded and processed:",this.request)}catch(l){console.error("Error processing request data:",l),this.alertService.error("Error processing request data"),this.loading=!1,setTimeout(()=>this.router.navigate(["/admin/requests"]),2e3);return}for(;this.itemsArray.length;)this.itemsArray.removeAt(0);e.details||(e.details={}),e.type?.toLowerCase()==="equipment"&&e.details?.items&&Array.isArray(e.details.items)?e.details.items.forEach(l=>{this.itemsArray.push(this.formBuilder.group({name:[l.name,h.required],quantity:[l.quantity,[h.required,h.min(1)]]}))}):this.itemsArray.push(this.createItemFormGroup()),this.form.patchValue({employeeId:e.employeeId,type:e.type,title:e.title||"",description:e.description||"",priority:e.priority||"medium"}),this.loading=!1},error:e=>{console.error("Error loading request details:",e),this.alertService.error("Error loading request details. Please try again."),this.loading=!1,setTimeout(()=>{this.router.navigate(["/admin/requests"])},2e3)}})}else this.loadEmployees();setTimeout(()=>{this.adjustDropdownVisibility()},200)}get f(){return this.form.controls}get itemsArray(){return this.form.get("items")}createItemFormGroup(){return this.formBuilder.group({name:["",h.required],quantity:[1,[h.required,h.min(1)]]})}addItem(){this.itemsArray.push(this.createItemFormGroup())}removeItem(e){this.itemsArray.length>1&&this.itemsArray.removeAt(e)}updateFormForType(e){(e.toLowerCase()==="equipment"||e.toLowerCase()==="resources"||e.toLowerCase()==="leave")&&this.itemsArray.length===0&&this.addItem()}loadEmployees(){this.employeeService.getAll().pipe(C()).subscribe({next:e=>{this.employees=e},error:e=>{this.alertService.error("Error loading employees"),console.error(e)}})}onSubmit(){if(this.submitted=!0,this.alertService.clear(),this.form.invalid)return;this.loading=!0;let e=this.form.value,l={employeeId:e.employeeId,type:e.type,title:e.title||`New ${e.type} request`,description:e.description,priority:e.priority||"medium"};(e.type.toLowerCase()==="equipment"||e.type.toLowerCase()==="resources")&&(l.items=e.items.map(r=>({name:r.name,quantity:r.quantity}))),this.isEditMode?this.updateRequest(l):this.createRequest(l)}createRequest(e){this.requestService.create(e).pipe(C()).subscribe({next:()=>{this.alertService.success("Request created successfully",{keepAfterRouteChange:!0}),this.router.navigate(["/admin/requests"])},error:l=>{this.alertService.error(l),this.loading=!1}})}updateRequest(e){this.requestService.update(+this.id,e).pipe(C()).subscribe({next:()=>{this.alertService.success("Request updated successfully",{keepAfterRouteChange:!0}),this.router.navigate(["/admin/requests"])},error:l=>{this.alertService.error(l),this.loading=!1}})}getStatusClass(e){switch(e.toLowerCase()){case"approved":return"status-success";case"rejected":return"status-danger";case"pending":return"status-warning";default:return"status-info"}}openApproveModal(){this.approvalComments="",this.showApproveModal=!0}openRejectModal(){this.rejectionReason="",this.showRejectModal=!0}cancelModal(){this.showApproveModal=!1,this.showRejectModal=!1}approveRequest(){this.id&&(this.submitting=!0,this.requestService.approve(+this.id,this.approvalComments).pipe(C()).subscribe({next:()=>{this.alertService.success("Request approved successfully",{keepAfterRouteChange:!0}),this.showApproveModal=!1,this.submitting=!1,this.router.navigate(["/admin/requests"])},error:e=>{this.alertService.error("Failed to approve request: "+e),this.submitting=!1}}))}rejectRequest(){!this.id||!this.rejectionReason||(this.submitting=!0,this.requestService.reject(+this.id,this.rejectionReason).pipe(C()).subscribe({next:()=>{this.alertService.success("Request rejected successfully",{keepAfterRouteChange:!0}),this.showRejectModal=!1,this.submitting=!1,this.router.navigate(["/admin/requests"])},error:e=>{this.alertService.error("Failed to reject request: "+e),this.submitting=!1}}))}adjustDropdownVisibility(){try{let e=document.querySelectorAll("select.form-control");for(let l=0;l<e.length;l++){let r=e[l];r.classList.add("custom-select"),r.parentElement&&(r.parentElement.style.position="relative",r.parentElement.style.width="100%",r.parentElement.style.display="block",r.style.textOverflow="ellipsis",r.style.overflow="hidden",r.style.paddingRight="35px")}}catch(e){console.error("Error adjusting dropdown visibility:",e)}}static{this.\u0275fac=function(l){return new(l||i)(b(qe),b(z),b(D),b(P),b(Pe),b(B))}}static{this.\u0275cmp=S({type:i,selectors:[["app-request-form"]],decls:55,vars:19,consts:[[1,"main-content"],[1,"card"],[1,"card-header"],[1,"form-title"],[1,"card-body"],["class","request-summary",4,"ngIf"],[1,"request-form",3,"ngSubmit","formGroup"],[1,"section-container"],[1,"section-title"],[1,"form-grid"],[1,"form-column"],[1,"form-group"],[1,"custom-select-wrapper"],["formControlName","type",1,"form-control","custom-select",3,"ngClass","disabled"],["value","equipment"],["value","leave"],["value","transfer"],["value","promotion"],["value","resources"],["value","other"],["class","invalid-feedback",4,"ngIf"],["type","text","formControlName","title","placeholder","Enter a descriptive title",1,"form-control",3,"ngClass"],["class","form-group",4,"ngIf"],["formControlName","description","rows","4","placeholder","Provide details about this request",1,"form-control"],["class","section-container mt-4",4,"ngIf"],[1,"action-buttons"],[1,"main-actions"],["type","submit",1,"btn","btn-primary",3,"disabled"],["class","spinner-border spinner-border-sm mr-1",4,"ngIf"],[1,"fas","fa-save"],["routerLink","/admin/requests",1,"btn","btn-outline-secondary"],[1,"fas","fa-times"],["class","approval-actions",4,"ngIf"],["class","modal-backdrop",3,"click",4,"ngIf"],[1,"request-summary"],[1,"request-badge-container"],[1,"status-badge",3,"ngClass"],[1,"request-info-grid"],[1,"info-box"],[1,"info-content"],[1,"fas","fa-id-badge"],[1,"fas","fa-user"],[1,"fas","fa-envelope"],[1,"fas","fa-calendar-alt"],[1,"fas","fa-tag"],[1,"fas","fa-info-circle"],[1,"status-text",3,"ngClass"],[1,"invalid-feedback"],[4,"ngIf"],["formControlName","employeeId",1,"form-control",3,"ngClass"],["value",""],[3,"value",4,"ngFor","ngForOf"],[3,"value"],[1,"section-container","mt-4"],[1,"fas","fa-box"],[1,"equipment-container"],["formArrayName","items",1,"items-list"],["class","item-card",4,"ngFor","ngForOf"],[1,"add-item-button"],["type","button",1,"btn","btn-outline-primary",3,"click"],[1,"fas","fa-plus"],[1,"item-card"],[1,"item-form",3,"formGroupName"],[1,"item-header"],["type","button","class","btn btn-outline-danger btn-sm",3,"click",4,"ngIf"],[1,"item-fields"],["type","text","formControlName","name",1,"form-control",3,"ngClass","placeholder"],["type","number","formControlName","quantity","min","1",1,"form-control",3,"ngClass","placeholder"],["type","button",1,"btn","btn-outline-danger","btn-sm",3,"click"],[1,"spinner-border","spinner-border-sm","mr-1"],[1,"approval-actions"],[1,"section-title","mt-4"],[1,"btn-group"],["type","button",1,"btn","btn-success",3,"click"],[1,"fas","fa-check"],["type","button",1,"btn","btn-danger",3,"click"],[1,"modal-backdrop",3,"click"],[1,"modal-dialog",3,"click"],[1,"modal-content"],[1,"modal-header"],[1,"modal-title"],[1,"fas","fa-check-circle"],["type","button",1,"close",3,"click"],[1,"modal-body"],[1,"alert","alert-info"],[1,"modal-info"],[1,"form-group","mt-3"],["rows","3","placeholder","Add any additional notes about this approval",1,"form-control",3,"ngModelChange","ngModel"],[1,"modal-footer"],["type","button",1,"btn","btn-outline-secondary",3,"click"],["type","button",1,"btn","btn-success",3,"click","disabled"],[1,"mt-3"],[1,"table","table-sm","table-striped"],[4,"ngFor","ngForOf"],[1,"fas","fa-times-circle"],[1,"alert","alert-warning"],[1,"text-danger"],["rows","3","required","","placeholder","Please provide a reason for rejecting this request",1,"form-control",3,"ngModelChange","ngModel"],[1,"text-muted"],["type","button",1,"btn","btn-danger",3,"click","disabled"]],template:function(l,r){if(l&1&&(n(0,"div",0)(1,"div",1)(2,"div",2)(3,"h2",3),o(4),t()(),n(5,"div",4),m(6,ze,45,13,"div",5),n(7,"form",6),_("ngSubmit",function(){return r.onSubmit()}),n(8,"div",7)(9,"h4",8),o(10,"Basic Information"),t(),n(11,"div",9)(12,"div",10)(13,"div",11)(14,"label"),o(15,"Request Type"),t(),n(16,"div",12)(17,"select",13)(18,"option",14),o(19,"Equipment Request"),t(),n(20,"option",15),o(21,"Leave Request"),t(),n(22,"option",16),o(23,"Transfer Request"),t(),n(24,"option",17),o(25,"Promotion Request"),t(),n(26,"option",18),o(27,"Resources Request"),t(),n(28,"option",19),o(29,"Other Request"),t()()(),m(30,$e,2,1,"div",20),t(),n(31,"div",11)(32,"label"),o(33,"Request Title"),t(),p(34,"input",21),m(35,Ue,2,1,"div",20),t()(),n(36,"div",10),m(37,Ye,8,5,"div",22),n(38,"div",11)(39,"label"),o(40,"Description"),t(),p(41,"textarea",23),t()()()(),m(42,nt,11,3,"div",24),n(43,"div",25)(44,"div",26)(45,"button",27),m(46,it,1,0,"span",28),p(47,"i",29),o(48," Save Changes "),t(),n(49,"a",30),p(50,"i",31),o(51," Cancel "),t()(),m(52,ot,10,0,"div",32),t()()()()(),m(53,st,39,8,"div",33)(54,pt,43,8,"div",33)),l&2){let u;a(4),v(r.isEditMode?"Edit Request":"Add Request"),a(2),s("ngIf",r.isEditMode),a(),s("formGroup",r.form),a(10),s("ngClass",O(15,R,r.submitted&&r.f.type.errors))("disabled",r.isEditMode),a(13),s("ngIf",r.submitted&&r.f.type.errors),a(4),s("ngClass",O(17,R,r.submitted&&r.f.title.errors)),a(),s("ngIf",r.submitted&&r.f.title.errors),a(2),s("ngIf",!r.isEditMode),a(5),s("ngIf",((u=r.form.get("type"))==null?null:u.value)==="equipment"||((u=r.form.get("type"))==null?null:u.value)==="resources"||((u=r.form.get("type"))==null?null:u.value)==="leave"),a(3),s("disabled",r.loading),a(),s("ngIf",r.loading),a(6),s("ngIf",r.isEditMode&&(r.request==null||r.request.status==null?null:r.request.status.toLowerCase())==="pending"),a(),s("ngIf",r.showApproveModal),a(),s("ngIf",r.showRejectModal)}},dependencies:[A,N,V,pe,be,he,se,ue,ve,de,ce,Ce,ye,ge,xe,fe,_e,me,$,L],styles:[`

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
        width: 100%;
    }
    
    .form-column[_ngcontent-%COMP%] {
        width: 100%;
        min-width: 0; 

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
        max-width: 100%;
        overflow: visible;
        text-overflow: ellipsis;
    }
    
    select.form-control[_ngcontent-%COMP%] {
        padding-right: 30px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        box-sizing: border-box;
        width: 100%;
    }
    
    .select-full-width[_ngcontent-%COMP%] {
        width: 100% !important;
        min-width: 100% !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
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
    
    

    .section-container[_ngcontent-%COMP%] {
        background-color: #ffffff;
        border-radius: 8px;
        padding: 20px;
        margin-bottom: 24px;
        border: 1px solid #eaeaea;
        box-shadow: 0 1px 3px rgba(0,0,0,0.04);
    }
    
    .section-title[_ngcontent-%COMP%] {
        font-size: 18px;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eaeaea;
    }
    
    .equipment-container[_ngcontent-%COMP%] {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
    
    .items-list[_ngcontent-%COMP%] {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
    }
    
    .item-card[_ngcontent-%COMP%] {
        background-color: #f8f9fa;
        border-radius: 6px;
        overflow: hidden;
        border: 1px solid #eaeaea;
        transition: box-shadow 0.2s ease;
    }
    
    .item-card[_ngcontent-%COMP%]:hover {
        box-shadow: 0 4px 8px rgba(0,0,0,0.08);
    }
    
    .item-header[_ngcontent-%COMP%] {
        background-color: #f1f3f5;
        padding: 10px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eaeaea;
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
        padding: 16px;
    }
    
    .add-item-button[_ngcontent-%COMP%] {
        margin-top: 10px;
        display: flex;
        justify-content: flex-start;
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
    
    

    @media (max-width: 992px) {
        .form-grid[_ngcontent-%COMP%], .request-info-grid[_ngcontent-%COMP%] {
            grid-template-columns: 1fr;
            gap: 15px;
        }
        
        .items-list[_ngcontent-%COMP%] {
            grid-template-columns: 1fr;
        }
        
        .card-body[_ngcontent-%COMP%] {
            padding: 16px 15px;
        }
        
        .section-container[_ngcontent-%COMP%] {
            padding: 15px;
        }
        
        .item-fields[_ngcontent-%COMP%] {
            padding: 12px;
        }
        
        .request-summary[_ngcontent-%COMP%] {
            padding: 15px;
            margin-bottom: 20px;
        }
        
        .action-buttons[_ngcontent-%COMP%] {
            flex-direction: column;
            gap: 10px;
        }
        
        .main-actions[_ngcontent-%COMP%] {
            flex-wrap: wrap;
        }
        
        .btn-group[_ngcontent-%COMP%] {
            flex-direction: column;
        }
    }
    
    

    .custom-select-wrapper[_ngcontent-%COMP%] {
        position: relative;
        width: 100%;
        display: block;
    }
    
    .custom-select-wrapper[_ngcontent-%COMP%]::after {
        content: "\u25BC";
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translateY(-50%);
        pointer-events: none;
        font-size: 10px;
        color: #6c757d;
    }
    
    .custom-select[_ngcontent-%COMP%] {
        width: 100%;
        padding: 10px 35px 10px 12px !important;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
    }
    
    

    select.form-control[_ngcontent-%COMP%] {
        box-sizing: border-box;
        appearance: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        background-image: none;
        padding: 05px 35px 05px 12px !important;
    }
    
    select.form-control[_ngcontent-%COMP%]   option[_ngcontent-%COMP%] {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        max-width: 100%;
        box-sizing: border-box;
        padding: 10px 12px;
        color: #333;
        font-size: 14px;
        line-height: 1.5;
    }
    
    @media (max-width: 992px) {
        .custom-select[_ngcontent-%COMP%], select.form-control[_ngcontent-%COMP%] {
            max-width: 100%;
            width: 100%;
        }
    }`]})}}return i})();var ut=[{path:"",component:Ie,children:[{path:"",component:Fe},{path:"add",component:J},{path:"edit/:id",component:J}]}],Ft=(()=>{class i{static{this.\u0275fac=function(l){return new(l||i)}}static{this.\u0275mod=oe({type:i})}static{this.\u0275inj=ne({providers:[P],imports:[le,we,Me,H,H.forChild(ut)]})}}return i})();export{Ft as RequestsModule};
