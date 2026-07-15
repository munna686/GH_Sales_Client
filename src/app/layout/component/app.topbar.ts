import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Popover } from 'primeng/popover';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { Tooltip } from 'primeng/tooltip';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { StorageUtil } from '@/utility/StorageUtil';
import { interval, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CalculatorDialogComponent } from '../../shared/calculator-dialog.component';
import { NotificationService } from '@/pages/service/notification.service';
import { IdleTimeoutService } from '@/services/idleTimeout.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator, Popover, Tooltip, ButtonModule, TagModule, CalculatorDialogComponent],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <p-button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </p-button>
            <a class="layout-topbar-logo" routerLink="/dashboard">
                <img [src]="companyLogoPath" [alt]="companyDisplayName + ' Logo'" width="48" height="32" style="object-fit:contain;">
                <span style="width: 500px; font-size: 1.2rem;">{{ companyDisplayName }}</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <!-- center clock -->
            <div class="layout-topbar-center hidden lg:flex lg:items-center lg:justify-center" style="flex:1;">
                <p-tag [value]="currentTimeDisplay" icon="pi pi-clock" severity="info"></p-tag>
            </div>
            <div class="layout-config-menu">
                <!-- <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button> -->
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action" (click)="openCalculator()">
                        <i class="pi pi-calculator"></i>
                        <span>Calculator</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action relative" (click)="notificationsPopover.toggle($event)">
                        <i class="pi pi-inbox"></i>
                        <span>Inbox</span>
                        @if (unreadNotificationCount > 0) {
                            <span class="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold leading-none text-primary-contrast shadow-sm">
                                {{ unreadNotificationCount }}
                            </span>
                        }
                    </button>
                    <p-popover #notificationsPopover>
                        <ng-template #content>
                            <div class="w-[24rem] max-w-[calc(100vw-2rem)] rounded-2xl bg-surface-0 dark:bg-surface-900">
                                <div class="mb-3 rounded-2xl bg-gradient-to-r from-primary/15 via-primary/10 to-transparent p-4">
                                    <div class="flex items-start justify-between gap-3">
                                        <div>
                                            <div class="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Inbox</div>
                                            <div class="mt-1 text-lg font-semibold text-surface-900 dark:text-surface-0">Notifications</div>
                                            <div class="mt-1 text-sm text-surface-600 dark:text-surface-300">Latest updates, kept short and clean.</div>
                                        </div>
                                        <p-tag [value]="unreadNotificationCount + ' unread'" severity="info" />
                                    </div>
                                </div>

                                @if (notifications.length > 0) {
                                    <div class="max-h-96 overflow-auto pr-1">
                                        <div class="space-y-2.5">
                                            @for (notification of notifications; track notification.notificationId) {
                                                <div class="group rounded-2xl border border-surface-200/80 bg-surface-0 px-3 py-2.5 transition-all duration-200 hover:border-primary/30 hover:bg-surface-50 dark:border-surface-700 dark:bg-surface-950/40 dark:hover:bg-surface-900/60">
                                                    <div class="flex gap-3">
                                                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" [ngClass]="getNotificationTone(notification).wrapperClass">
                                                            <i [class]="getNotificationTone(notification).iconClass"></i>
                                                        </div>
                                                        <div class="min-w-0 flex-1 py-0.5">
                                                            <div class="flex items-center gap-2">
                                                                <span class="truncate text-sm font-semibold text-surface-900 dark:text-surface-0">{{ getNotificationTitle(notification) }}</span>
                                                                @if (!notification.isRead) {
                                                                    <span class="h-2 w-2 shrink-0 rounded-full bg-primary"></span>
                                                                }
                                                                <p-tag [value]="getNotificationLabel(notification)" severity="info" styleClass="shrink-0 scale-90 origin-left" />
                                                            </div>
                                                            <p
                                                                class="mt-1 max-w-full truncate text-sm leading-5 text-surface-600 dark:text-surface-300"
                                                                [pTooltip]="notification.message"
                                                                tooltipPosition="top"
                                                                [showDelay]="250"
                                                                [hideDelay]="100"
                                                            >
                                                                {{ getNotificationPreview(notification.message) }}
                                                            </p>
                                                            <div class="mt-1 flex items-center gap-2 text-[11px] text-surface-500 dark:text-surface-400">
                                                                <span class="inline-flex items-center gap-1">
                                                                    <i class="pi pi-clock"></i>
                                                                    {{ formatNotificationDate(notification.createdAt) }}
                                                                </span>
                                                                @if (notification.createdBy) {
                                                                    <span class="truncate">{{ notification.createdBy }}</span>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                } @else {
                                    <div class="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-200 px-6 py-10 text-center dark:border-surface-700">
                                        <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-300">
                                            <i class="pi pi-inbox text-xl"></i>
                                        </div>
                                        <div class="text-base font-semibold text-surface-900 dark:text-surface-0">No notifications yet</div>
                                        <div class="mt-1 text-sm text-surface-500 dark:text-surface-400">New approval and payroll alerts will appear here.</div>
                                    </div>
                                }
                            </div>
                        </ng-template>
                    </p-popover>
                    <div class="layout-topbar-action" style="cursor:default;">
                        <button type="button" class="layout-topbar-action" (click)="profilePopover.toggle($event)">
                            @if (showProfileImage) {
                                <img [src]="profilePicUrl + user.pictureName" (error)="onProfileImageError()" alt="Employee Image" class="w-10 h-10 rounded-full object-cover" />
                            } @else {
                                <div class="w-10 h-10 rounded-full bg-primary text-primary-contrast flex items-center justify-center font-semibold text-sm">
                                    {{ getUserInitials() }}
                                </div>
                            }
                        </button>
                        <p-popover #profilePopover>
                            <ng-template #content>
                                <div class="min-w-56 p-2">
                                    <div class="text-sm text-surface-500">Signed in as</div>
                                    <div class="text-base font-semibold mb-3">{{ user?.userName || 'Sales User' }}</div>
                                    <button pButton type="button" label="Logout" icon="pi pi-sign-out" class="w-full" severity="danger" (click)="logout(profilePopover)"></button>
                                </div>
                            </ng-template>
                        </p-popover>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <app-calculator-dialog #calculatorDialog></app-calculator-dialog>
    `
})
export class AppTopbar implements OnInit, OnDestroy {
    @ViewChild('calculatorDialog') calculatorDialog!: CalculatorDialogComponent;
    @ViewChild('notificationsPopover') notificationsPopover!: Popover;
    @ViewChild('profilePopover') profilePopover!: Popover;
    user!: any;
    currentTimeSub?: Subscription;
    currentTimeDisplay: string = '';
    apiUrl = environment.apiUrl;
    profilePicUrl = this.apiUrl + 'UploadedImages/';
    notifications: any[] = [];
    profileImageError = false;
    companyDisplayName: string = 'Golden Harvest';
    companyLogoPath: string = 'assets/logo/GH.png';

    private readonly notificationTypeLabels: Record<number, string> = {
        1: 'Attendance',
        2: 'Leave',
        3: 'Payroll',
        4: 'Onboarding',
        5: 'Offboarding',
        6: 'Evaluation',
        7: 'Announcement',
        8: 'Salary Advance'
    };

    private readonly notificationTypeTones: Record<number, { wrapperClass: string; iconClass: string; severity: 'success' | 'info' | 'warn' | 'danger' | 'secondary' }> = {
        1: { wrapperClass: 'bg-sky-100 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400', iconClass: 'pi pi-calendar-check text-lg', severity: 'info' },
        2: { wrapperClass: 'bg-violet-100 text-violet-600 dark:bg-violet-400/10 dark:text-violet-400', iconClass: 'pi pi-calendar-minus text-lg', severity: 'secondary' },
        3: { wrapperClass: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400', iconClass: 'pi pi-wallet text-lg', severity: 'success' },
        4: { wrapperClass: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-400/10 dark:text-cyan-400', iconClass: 'pi pi-user-plus text-lg', severity: 'info' },
        5: { wrapperClass: 'bg-rose-100 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400', iconClass: 'pi pi-user-minus text-lg', severity: 'danger' },
        6: { wrapperClass: 'bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-300', iconClass: 'pi pi-chart-line text-lg', severity: 'warn' },
        7: { wrapperClass: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200', iconClass: 'pi pi-bullhorn text-lg', severity: 'secondary' },
        8: { wrapperClass: 'bg-orange-100 text-orange-600 dark:bg-orange-400/10 dark:text-orange-300', iconClass: 'pi pi-money-bill text-lg', severity: 'warn' }
    };


    constructor(
        public layoutService: LayoutService,
        private notificationService: NotificationService,
        private idleTimeoutService: IdleTimeoutService
    ) {}

    ngOnInit() {
        this.loadCompanyBranding();
        this.getUserName();

        // start global current time clock
        this.currentTimeDisplay = this.formatNowToHHMMSS();
        this.currentTimeSub = interval(1000).subscribe(() => {
            this.currentTimeDisplay = this.formatNowToHHMMSS();
        });
        this.getNotifications();
    }

    

    ngOnDestroy() {
        this.currentTimeSub?.unsubscribe();
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    getNotifications() {
        const employeeId = this.user?.employeeId;
        if (employeeId) {
            this.notificationService.getNotifications(employeeId).subscribe(
                (response) => {
                    this.notifications = Array.isArray(response.data) ? response.data : [];
                    console.log('Notifications:', this.notifications);
                },
                (error) => {
                    console.error('Error fetching notifications:', error);
                }
            );
        }
    }

    getUserName() {
    this.user = StorageUtil.getLoggedInUser();
    this.profileImageError = false;
    this.loadCompanyBranding();
    }

    get showProfileImage(): boolean {
        return !!this.user?.pictureName && !this.profileImageError;
    }

    onProfileImageError() {
        this.profileImageError = true;
    }

    getUserInitials(): string {
        const name = (this.user?.userName || 'Sales User').trim();
        const parts = name.split(/\s+/).filter(Boolean);
        if (parts.length === 0) {
            return 'SU';
        }
        if (parts.length === 1) {
            return parts[0].slice(0, 2).toUpperCase();
        }
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }

    logout(popover?: Popover) {
        popover?.hide();
        this.idleTimeoutService.logoutUser();
    }

    get unreadNotificationCount(): number {
        return this.notifications.filter((notification) => !notification.isRead).length;
    }

    getNotificationTitle(notification: any): string {
        return this.notificationTypeLabels[notification?.notificationType] ?? 'Notification';
    }

    getNotificationLabel(notification: any): string {
        return this.notificationTypeLabels[notification?.notificationType] ?? 'Update';
    }

    getNotificationPreview(message: string): string {
        if (!message) {
            return 'New notification';
        }

        const compact = message.replace(/\s+/g, ' ').trim();
        return compact.length > 62 ? `${compact.slice(0, 62).trimEnd()}...` : compact;
    }

    getNotificationTone(notification: any) {
        return this.notificationTypeTones[notification?.notificationType] ?? {
            wrapperClass: 'bg-primary-100 text-primary dark:bg-primary/10 dark:text-primary-200',
            iconClass: 'pi pi-bell text-lg',
            severity: 'info' as const
        };
    }
    getCompanyId(): number {
        return StorageUtil.getCompanyId();
    }

    private loadCompanyBranding() {
        const companyId = this.getCompanyId();
        if (companyId === 2) {
            this.companyDisplayName = 'Golden Harvest Ice Cream Ltd.';
            this.companyLogoPath = 'assets/logo/bloop.png';
            return;
        }

        this.companyDisplayName = 'Golden Harvest Agro Industries Ltd.';
        this.companyLogoPath = 'assets/logo/GH.png';
    }

    formatNotificationDate(createdAt: string): string {
        if (!createdAt) {
            return 'Just now';
        }

        const date = new Date(createdAt);
        if (Number.isNaN(date.getTime())) {
            return createdAt;
        }

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfNotificationDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const diffDays = Math.round((startOfToday.getTime() - startOfNotificationDay.getTime()) / 86400000);

        if (diffDays === 0) {
            return `Today, ${this.formatClockTime(date)}`;
        }

        if (diffDays === 1) {
            return `Yesterday, ${this.formatClockTime(date)}`;
        }

        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        }).format(date);
    }

    private formatClockTime(date: Date): string {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: '2-digit'
        }).format(date);
    }

    private formatNowToHHMMSS(): string {
        const d = new Date();
        let hours = d.getHours();
        const minutes = d.getMinutes();
        const seconds = d.getSeconds();

        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; 

        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)} ${ampm}`;
    }



    openCalculator() {
        if (this.calculatorDialog) {
            this.calculatorDialog.open();
        }
    }
}
