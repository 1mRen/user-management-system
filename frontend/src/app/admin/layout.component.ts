import { Component } from "@angular/core";

@Component({
    selector: "app-admin-layout",
    template: `
        <div class="admin-layout">
            <router-outlet name="subnav"></router-outlet>
            <div class="content">
                <router-outlet></router-outlet>
            </div>
        </div>
    `,
    styles: [`
        .admin-layout {
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .content {
            flex: 1;
            padding: 1rem;
        }
    `]
})
export class LayoutComponent {}
