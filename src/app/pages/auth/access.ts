import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-access',
    standalone: true,
    imports: [ButtonModule, RouterModule, RippleModule, AppFloatingConfigurator],
    styles: [`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Full viewport breakout — escapes sidebar/topbar layout ── */
        .access-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--surface-ground);
            font-family: 'DM Sans', sans-serif;
            overflow: hidden;
        }

        /* ── Animated grid ── */
        .grid-bg {
            position: absolute;
            inset: 0;
            background-image:
                linear-gradient(color-mix(in srgb, var(--primary-color) 5%, transparent) 1px, transparent 1px),
                linear-gradient(90deg, color-mix(in srgb, var(--primary-color) 5%, transparent) 1px, transparent 1px);
            background-size: 52px 52px;
            animation: grid-drift 24s linear infinite;
            pointer-events: none;
        }

        @keyframes grid-drift {
            0%   { transform: translate(0, 0); }
            100% { transform: translate(52px, 52px); }
        }

        /* ── Glow orbs ── */
        .orb {
            position: absolute;
            border-radius: 50%;
            filter: blur(90px);
            pointer-events: none;
        }

        .orb-tl {
            width: 500px; height: 500px;
            top: -160px; right: -80px;
            background: radial-gradient(circle,
                color-mix(in srgb, var(--primary-color) 16%, transparent) 0%,
                transparent 70%);
            animation: float-a 10s ease-in-out infinite;
        }

        .orb-br {
            width: 380px; height: 380px;
            bottom: -120px; left: -60px;
            background: radial-gradient(circle,
                color-mix(in srgb, var(--primary-color) 10%, transparent) 0%,
                transparent 70%);
            animation: float-b 13s ease-in-out infinite;
        }

        @keyframes float-a {
            0%, 100% { transform: translate(0, 0); }
            50%       { transform: translate(-24px, 24px); }
        }

        @keyframes float-b {
            0%, 100% { transform: translate(0, 0); }
            50%       { transform: translate(18px, -18px); }
        }

        /* ── Card ── */
        .access-card {
            position: relative;
            z-index: 10;
            width: 100%;
            max-width: 440px;
            margin: 1.25rem;
            background: var(--surface-card);
            border: 1px solid var(--surface-border);
            border-radius: 24px;
            padding: 2.75rem 2.5rem 2.25rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            box-shadow:
                0 0 0 1px color-mix(in srgb, var(--primary-color) 8%, transparent),
                0 24px 64px rgba(0, 0, 0, 0.10),
                0 2px 8px rgba(0, 0, 0, 0.06);
            animation: card-rise 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes card-rise {
            from { opacity: 0; transform: translateY(32px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* top accent bar */
        .card-bar {
            position: absolute;
            top: 0; left: 50%;
            transform: translateX(-50%);
            width: 72px; height: 3px;
            background: var(--primary-color);
            border-radius: 0 0 6px 6px;
        }

        /* ── Lock icon ── */
        .lock-wrap {
            position: relative;
            width: 80px; height: 80px;
            display: flex; align-items: center; justify-content: center;
            margin-bottom: 1.5rem;
        }

        .lock-wrap::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: color-mix(in srgb, var(--primary-color) 10%, transparent);
            animation: pulse-ring 2.8s ease-in-out infinite;
        }

        .lock-wrap::after {
            content: '';
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            border: 1.5px dashed color-mix(in srgb, var(--primary-color) 35%, transparent);
            animation: spin-ring 14s linear infinite;
        }

        @keyframes pulse-ring {
            0%, 100% { transform: scale(1);   opacity: 1; }
            50%       { transform: scale(1.1); opacity: 0.6; }
        }

        @keyframes spin-ring {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
        }

        .lock-circle {
            position: relative;
            z-index: 1;
            width: 64px; height: 64px;
            border-radius: 50%;
            background: color-mix(in srgb, var(--primary-color) 14%, transparent);
            border: 1.5px solid color-mix(in srgb, var(--primary-color) 30%, transparent);
            display: flex; align-items: center; justify-content: center;
        }

        .lock-circle i {
            font-size: 1.375rem;
            color: var(--primary-color);
        }

        /* ── Error badge ── */
        .err-badge {
            font-family: 'Syne', sans-serif;
            font-size: 0.625rem;
            font-weight: 700;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: var(--primary-color);
            background: color-mix(in srgb, var(--primary-color) 10%, transparent);
            border: 1px solid color-mix(in srgb, var(--primary-color) 28%, transparent);
            padding: 4px 14px;
            border-radius: 100px;
            margin-bottom: 1.125rem;
            animation: badge-in 0.55s 0.2s cubic-bezier(0.22,1,0.36,1) both;
        }

        @keyframes badge-in {
            from { opacity: 0; transform: scale(0.85); }
            to   { opacity: 1; transform: scale(1); }
        }

        /* ── Heading ── */
        .access-title {
            font-family: 'Syne', sans-serif;
            font-size: clamp(2.25rem, 6vw, 3rem);
            font-weight: 800;
            letter-spacing: -1.5px;
            line-height: 1.05;
            color: var(--text-color);
            margin-bottom: 0.875rem;
            animation: fade-up 0.5s 0.25s both;
        }

        .access-title span {
            color: var(--primary-color);
            display: block;
        }

        /* ── Sub text ── */
        .access-sub {
            font-size: 0.875rem;
            font-weight: 400;
            color: var(--text-color-secondary);
            line-height: 1.65;
            max-width: 300px;
            margin-bottom: 0;
            animation: fade-up 0.5s 0.32s both;
        }

        @keyframes fade-up {
            from { opacity: 0; transform: translateY(14px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Divider ── */
        .divider {
            width: 36px; height: 1px;
            background: var(--surface-border);
            margin: 1.5rem auto;
            animation: fade-up 0.5s 0.35s both;
        }

        /* ── Chips ── */
        .chips {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
            justify-content: center;
            margin-bottom: 1.75rem;
            animation: fade-up 0.5s 0.38s both;
        }

        .chip {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 5px 12px;
            border-radius: 8px;
            font-size: 0.72rem;
            font-weight: 500;
            color: var(--text-color-secondary);
            background: var(--surface-ground);
            border: 1px solid var(--surface-border);
            white-space: nowrap;
        }

        .chip i { font-size: 0.65rem; }

        /* ── CTA ── */
        .cta-wrap {
            width: 100%;
            animation: fade-up 0.5s 0.42s both;
        }

        ::ng-deep .cta-wrap .p-button {
            font-family: 'DM Sans', sans-serif !important;
            font-size: 0.875rem !important;
            font-weight: 600 !important;
            width: 100% !important;
            padding: 0.8rem 1.5rem !important;
            border-radius: 12px !important;
            justify-content: center !important;
            transition: transform 0.18s ease, box-shadow 0.18s ease !important;
        }

        ::ng-deep .cta-wrap .p-button:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 10px 28px color-mix(in srgb, var(--primary-color) 32%, transparent) !important;
        }

        ::ng-deep .cta-wrap .p-button:active {
            transform: translateY(0) !important;
        }

        /* ── Footer note ── */
        .footer-note {
            margin-top: 1.25rem;
            font-size: 0.75rem;
            color: var(--text-color-secondary);
            opacity: 0.55;
            animation: fade-up 0.5s 0.46s both;
        }

        .footer-note a {
            color: var(--primary-color);
            opacity: 0.85;
            text-decoration: none;
        }

        .footer-note a:hover { opacity: 1; }
    `],
    template: `
        <app-floating-configurator />

        <!-- position:fixed — covers entire viewport including sidebar & topbar -->
        <div class="access-overlay">
            
            <div class="grid-bg"></div>
            <div class="orb orb-tl"></div>
            <div class="orb orb-br"></div>

            <div class="access-card">
                <div class="card-bar"></div>

                <div class="lock-wrap">
                    <div class="lock-circle">
                        <i class="pi pi-lock"></i>
                    </div>
                </div>

                <div class="err-badge">Error 403</div>

                <h1 class="access-title">
                    Access
                    <span>Denied</span>
                </h1>

                <p class="access-sub">
                    You don't have permission to view this page.
                    Contact your administrator to request access.
                </p>

                <div class="divider"></div>

                <div class="chips">
                    <span class="chip"><i class="pi pi-shield"></i> Restricted Area</span>
                    <span class="chip"><i class="pi pi-user"></i> Admin Required</span>
                    <span class="chip"><i class="pi pi-envelope"></i> Contact Support</span>
                </div>

                <div class="cta-wrap">
                    <p-button
                        label="Go to Dashboard"
                        icon="pi pi-home"
                        iconPos="left"
                        routerLink="/"
                    />
                </div>

                <p class="footer-note">
                    Need access? <a href="mailto:admin@company.com">Contact admin</a>
                </p>
            </div>
        </div>
    `
})
export class Access {}