import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

interface LeaveRecord {
    employee: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    status: string;
    severity: string;
}

@Component({
    selector: 'app-leave-calendar-widget',
    standalone: true,
    imports: [CommonModule, CardModule, TableModule, TagModule],
    template: `
        <p-card header="Upcoming Leaves" styleClass="h-full">
            <p-table [value]="leaveRecords" [rows]="5" [paginator]="false" styleClass="p-datatable-sm">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Employee</th>
                        <th>Leave Type</th>
                        <th>Duration</th>
                        <th>Status</th>
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-leave>
                    <tr>
                        <td>
                            <div class="flex items-center gap-2">
                                <i class="pi pi-user text-gray-500"></i>
                                <span class="font-medium">{{ leave.employee }}</span>
                            </div>
                        </td>
                        <td>{{ leave.leaveType }}</td>
                        <td class="text-sm text-gray-600">
                            {{ leave.startDate }} - {{ leave.endDate }}
                        </td>
                        <td>
                            <p-tag [value]="leave.status" [severity]="leave.severity"></p-tag>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </p-card>
    `
})
export class LeaveCalendarWidget implements OnInit {
    leaveRecords: LeaveRecord[] = [];

    ngOnInit() {
        this.leaveRecords = [
            {
                employee: 'Kamal Ahmed',
                leaveType: 'Annual Leave',
                startDate: 'Feb 10',
                endDate: 'Feb 14',
                status: 'Approved',
                severity: 'success'
            },
            {
                employee: 'Nasrin Akter',
                leaveType: 'Sick Leave',
                startDate: 'Feb 12',
                endDate: 'Feb 13',
                status: 'Pending',
                severity: 'warning'
            },
            {
                employee: 'Mahmud Hasan',
                leaveType: 'Casual Leave',
                startDate: 'Feb 15',
                endDate: 'Feb 15',
                status: 'Approved',
                severity: 'success'
            },
            {
                employee: 'Sharmin Islam',
                leaveType: 'Annual Leave',
                startDate: 'Feb 18',
                endDate: 'Feb 22',
                status: 'Pending',
                severity: 'warning'
            },
            {
                employee: 'Rafiq Uddin',
                leaveType: 'Medical Leave',
                startDate: 'Feb 20',
                endDate: 'Feb 21',
                status: 'Approved',
                severity: 'success'
            }
        ];
    }
}
