import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TimelineModule } from 'primeng/timeline';
import { AvatarModule } from 'primeng/avatar';

interface Activity {
    employee: string;
    action: string;
    time: string;
    icon: string;
    color: string;
}

@Component({
    selector: 'app-recent-activities-widget',
    standalone: true,
    imports: [CommonModule, CardModule, TimelineModule, AvatarModule],
    template: `
        <p-card header="Recent Activities" styleClass="h-full">
            <p-timeline [value]="activities" class="custom-timeline">
                <ng-template pTemplate="content" let-activity>
                    <div class="flex items-start gap-3">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 rounded-full flex items-center justify-center" 
                                 [ngClass]="'bg-' + activity.color + '-100'">
                                <i [class]="activity.icon + ' text-' + activity.color + '-600'"></i>
                            </div>
                        </div>
                        <div class="flex-1">
                            <div class="font-semibold text-gray-900">{{ activity.employee }}</div>
                            <div class="text-sm text-gray-600">{{ activity.action }}</div>
                            <div class="text-xs text-gray-400 mt-1">
                                <i class="pi pi-clock"></i> {{ activity.time }}
                            </div>
                        </div>
                    </div>
                </ng-template>
            </p-timeline>
        </p-card>
    `,
    styles: [`
        :host ::ng-deep .custom-timeline .p-timeline-event-content {
            padding: 0.5rem 0;
        }
        :host ::ng-deep .custom-timeline .p-timeline-event-marker {
            border: 2px solid var(--primary-color);
            background-color: white;
        }
    `]
})
export class RecentActivitiesWidget implements OnInit {
    activities: Activity[] = [];

    ngOnInit() {
        this.activities = [
            {
                employee: 'Kamal Ahmed',
                action: 'Applied for annual leave (5 days)',
                time: '10 minutes ago',
                icon: 'pi pi-calendar',
                color: 'yellow'
            },
            {
                employee: 'Fatima Rahman',
                action: 'Checked in at 09:05 AM',
                time: '25 minutes ago',
                icon: 'pi pi-check-circle',
                color: 'green'
            },
            {
                employee: 'Rahim Khan',
                action: 'Submitted salary advance request',
                time: '1 hour ago',
                icon: 'pi pi-money-bill',
                color: 'sky'
            },
            {
                employee: 'Ayesha Begum',
                action: 'Updated profile information',
                time: '2 hours ago',
                icon: 'pi pi-user-edit',
                color: 'teal'
            },
            {
                employee: 'Tariq Hasan',
                action: 'Completed monthly evaluation',
                time: '3 hours ago',
                icon: 'pi pi-star',
                color: 'yellow'
            }
        ];
    }
}
