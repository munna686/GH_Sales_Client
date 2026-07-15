import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule],
    template: `
        <div class="card sales-dashboard-home">
            <h1>Sales Dashboard</h1>
            <p>
                Project baseline is ready. Login, layout, route structure, and API-driven sidebar menu are active.
            </p>
            <p class="hint">Use API menu entries to progressively enable sales modules.</p>
        </div>
    `,
    styles: [
        `
            .sales-dashboard-home {
                min-height: 12rem;
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: 0.75rem;
            }

            h1 {
                font-size: 1.75rem;
                font-weight: 700;
                margin: 0;
            }

            p {
                margin: 0;
                color: var(--text-color-secondary);
            }

            .hint {
                font-size: 0.875rem;
            }
        `
    ]
})
export class Dashboard {}
