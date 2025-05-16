import { Component } from "@angular/core";

@Component({
    selector: "app-departments",
    template: `
        <div class="departments-container">
            <div class="header">
                <h2>Departments</h2>
                <button class="btn btn-primary" routerLink="add">Add Department</button>
            </div>
            <router-outlet></router-outlet>
        </div>
    `,
    styles: [`
        .departments-container {
            padding: 1rem;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        .btn-primary {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 0.25rem;
            cursor: pointer;
        }
        .btn-primary:hover {
            background-color: #0056b3;
        }
    `]
})
export class DepartmentsComponent {} 