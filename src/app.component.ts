import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { SpinnerService } from '@/services/spinner.service';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, NgxSpinnerComponent, AsyncPipe],
    template: `
        <!-- Card-style loading overlay -->
        @if (spinnerService.spinner$ | async) {
            <div class="loading-overlay">
                <div class="loading-card">
                    <div class="logo-switcher">
                        <img src="assets/logo/GH.png"    alt="GH Logo"    class="loading-logo logo-gh" />
                        <img src="assets/logo/bloop.png" alt="Bloop Logo" class="loading-logo logo-bloop" />
                    </div>
                    <div class="loading-ring">
                        <div></div><div></div><div></div><div></div>
                    </div>
                    <p class="loading-text">Golden Harvest &mdash; Loading...</p>
                </div>
            </div>
        }

        <!-- Hidden ngx-spinner so its service still works -->
        <ngx-spinner bdColor="transparent" size="medium" color="transparent" type="ball-scale-multiple" [fullScreen]="false"></ngx-spinner>

        <router-outlet></router-outlet>
    `,
    styles: [`
        .loading-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: rgba(255, 255, 255, 0.35);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .loading-card {
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
            padding: 3rem 4rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1.75rem;
            min-width: 280px;
        }

        /* Logo switcher — fades between GH and bloop every 1.5s */
        .logo-switcher {
            position: relative;
            width: 120px;
            height: 60px;
        }

        .loading-logo {
            position: absolute;
            inset: 0;
            width: 120px;
            height: 60px;
            object-fit: contain;
        }

        .logo-gh {
            animation: logo-fade 3s ease-in-out infinite;
        }

        .logo-bloop {
            animation: logo-fade 3s ease-in-out infinite reverse;
        }

        @keyframes logo-fade {
            0%,  45% { opacity: 1; }
            55%, 100% { opacity: 0; }
        }

        /* Ring spinner */
        .loading-ring {
            display: inline-block;
            position: relative;
            width: 48px;
            height: 48px;
        }

        .loading-ring div {
            box-sizing: border-box;
            display: block;
            position: absolute;
            width: 40px;
            height: 40px;
            margin: 4px;
            border: 4px solid transparent;
            border-top-color: #6c63ff;
            border-radius: 50%;
            animation: loading-ring-spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
        }

        .loading-ring div:nth-child(1) { animation-delay: -0.30s; }
        .loading-ring div:nth-child(2) { animation-delay: -0.20s; }
        .loading-ring div:nth-child(3) { animation-delay: -0.10s; }

        @keyframes loading-ring-spin {
            0%   { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .loading-text {
            margin: 0;
            font-size: 0.9rem;
            color: #6b7280;
            letter-spacing: 0.3px;
        }
    `]
})
export class AppComponent {
    constructor(public spinnerService: SpinnerService) {}
}