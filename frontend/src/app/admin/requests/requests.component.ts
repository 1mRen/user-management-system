import { Component } from "@angular/core";

@Component({
    selector: "app-requests",
    template: `
        <div class="requests-container">
            <h1 class="request-header">REQUESTS</h1>
            <router-outlet></router-outlet>
        </div>
    `,
    styles: [`
        .requests-container {
            padding: 0;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            background-color: #fff;
            margin-bottom: 1rem;
        }
        .request-header {
            background-color: #f8f9fa;
            padding: 1rem;
            margin: 0;
            font-size: 1.5rem;
            font-weight: bold;
            border-bottom: 1px solid #dee2e6;
        }
    `]
})
export class RequestsComponent {} 