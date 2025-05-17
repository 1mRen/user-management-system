import { Component } from "@angular/core";

@Component({
    selector: "app-employees",
    template: `
        <div class="employees-container">
            <h1 class="employee-header">EMPLOYEES</h1>
            <router-outlet></router-outlet>
        </div>
    `,
    styles: [`
        .employees-container {
            padding: 0;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            background-color: #fff;
            margin-bottom: 1rem;
        }
        .employee-header {
            background-color: #f8f9fa;
            padding: 1rem;
            margin: 0;
            font-size: 1.5rem;
            font-weight: bold;
            border-bottom: 1px solid #dee2e6;
        }
    `]
})
export class EmployeesComponent {} 