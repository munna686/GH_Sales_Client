import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-uikit-not-found',
    standalone: true,
    imports: [RouterModule],
    template: `
        <div class="flex min-h-screen items-center justify-center overflow-hidden bg-surface-50 dark:bg-surface-950 px-6 py-12">
            <div class="max-w-2xl rounded-3xl border border-surface-200/80 bg-surface-0 p-10 text-center shadow-2xl dark:border-surface-800 dark:bg-surface-900">
                <div class="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <i class="pi pi-exclamation-triangle text-3xl"></i>
                </div>
                <div class="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-primary">404</div>
                <h1 class="mb-3 text-3xl font-bold text-surface-900 dark:text-surface-0">Page not found</h1>
                <p class="mb-8 text-surface-600 dark:text-surface-300">The uikit page you are looking for does not exist.</p>
                <a routerLink="/dashboard" class="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 font-medium text-primary-contrast transition-colors hover:bg-primary-emphasis">
                    Back to dashboard
                </a>
            </div>
        </div>
    `
})
export class NotFoundComponent {}