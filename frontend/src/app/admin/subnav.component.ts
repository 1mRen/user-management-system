import { Component } from "@angular/core";

@Component({
    selector: "app-subnav",
    template: `
        <nav class="subnav">
            <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Overview</a>
            <a routerLink="/admin/accounts" routerLinkActive="active">Accounts</a>
            <a routerLink="/admin/employees" routerLinkActive="active">Employees</a>
            <a routerLink="/admin/departments" routerLinkActive="active">Departments</a>
            <a routerLink="/admin/requests" routerLinkActive="active">Requests</a>
            
        </nav>
    `,
    styles: [`
        .subnav {
            padding: 1rem;
            background: #f8f9fa;
            border-bottom: 1px solid #dee2e6;
            display: flex;
            align-items: center;
        }
        .subnav a {
            margin-right: 1.5rem;
            text-decoration: none;
            color: #495057;
            padding: 0.5rem 0;
            position: relative;
        }
        .subnav a:hover {
            color: #007bff;
        }
        .subnav a.active {
            color: #007bff;
            font-weight: bold;
        }
        .subnav a.active::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #007bff;
        }
    `]
})
export class SubNavComponent {} 