import { Component, Renderer2, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { IdleTimeoutService } from '@/services/idleTimeout.service';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AppTopbar } from './app.topbar';
import { AppSidebar } from './app.sidebar';
import { AppFooter } from './app.footer';
import { LayoutService } from '../service/layout.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, AppFooter, Dialog, ButtonModule],
    template: `<div class="layout-wrapper" [ngClass]="containerClass">
        <app-topbar></app-topbar>
        <app-sidebar></app-sidebar>

        <!-- Global spinner and session warning dialog moved here -->
        
        <p-dialog header="Session Expiring Soon" [(visible)]="showWarning" [modal]="true" [closable]="false" [dismissableMask]="false" styleClass="w-96 text-center">
            <div class="p-3">
                <h3>⚠️ You will be logged out in {{ countdown }} seconds</h3>
                <p>Do you want to stay logged in?</p>
                <p-button [style]="{ 'margin-left': '10px' }" label="Stay Logged In" icon="pi pi-refresh" (click)="stayLoggedIn()"></p-button>
            </div>
        </p-dialog>

        <div class="layout-main-container">
            <div class="layout-main">
                <router-outlet></router-outlet>
            </div>
            <app-footer></app-footer>
        </div>
        <div class="layout-mask animate-fadein"></div>
    </div> `
})
export class AppLayout {
    showWarning: boolean = false;
    countdown: number = 10;
    overlayMenuOpenSubscription: Subscription;

    menuOutsideClickListener: any;

    @ViewChild(AppSidebar) appSidebar!: AppSidebar;

    @ViewChild(AppTopbar) appTopBar!: AppTopbar;

    private idleSubs: Subscription[] = [];

    constructor(
        public layoutService: LayoutService,
        public renderer: Renderer2,
        public router: Router,
        private idleService: IdleTimeoutService
    ) {
        this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
            if (!this.menuOutsideClickListener) {
                this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                    if (this.isOutsideClicked(event)) {
                        this.hideMenu();
                    }
                });
            }

            if (this.layoutService.layoutState().staticMenuMobileActive) {
                this.blockBodyScroll();
            }
        });

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
            const nav = event as NavigationEnd;
            const currentUrl = nav.urlAfterRedirects || nav.url;
            // hide menu on any navigation end
            this.hideMenu();
            // start/stop idle watching based on route (don't watch on root/login)
            if (currentUrl !== '/' && currentUrl !== '') {
                this.idleService.startWatching();
            } else {
                this.idleService.stopWatching();
            }
        });
    }

    ngOnInit(): void {
        // subscribe to idle service observables to update UI
        this.idleSubs.push(this.idleService.showWarning$.subscribe(show => this.showWarning = show));
        this.idleSubs.push(this.idleService.countdown$.subscribe(sec => this.countdown = sec));
    }

    isOutsideClicked(event: MouseEvent) {
        const sidebarEl = document.querySelector('.layout-sidebar');
        const topbarEl = document.querySelector('.layout-menu-button');
        const eventTarget = event.target as Node;

        return !(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget));
    }

    hideMenu() {
        this.layoutService.layoutState.update((prev) => ({ ...prev, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
            this.menuOutsideClickListener = null;
        }
        this.unblockBodyScroll();
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    get containerClass() {
        return {
            'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
            'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
            'layout-static-inactive': this.layoutService.layoutState().staticMenuDesktopInactive && this.layoutService.layoutConfig().menuMode === 'static',
            'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
            'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive
        };
    }

    ngOnDestroy() {
        if (this.overlayMenuOpenSubscription) {
            this.overlayMenuOpenSubscription.unsubscribe();
        }

        // cleanup idle subscriptions
        this.idleSubs.forEach(s => s.unsubscribe());

        if (this.menuOutsideClickListener) {
            this.menuOutsideClickListener();
        }
    }

    stayLoggedIn() {
        this.idleService.resetTimer();
        this.showWarning = false;
    }
}
