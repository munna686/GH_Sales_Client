import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-hrm-overview-widget',
    standalone: true,
    imports: [CommonModule, CardModule],
    template: `
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 md:col-span-6 lg:col-span-3">
                <div class="card mb-0 stat-card-primary text-white border-0">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="text-lg font-medium mb-1">Total Employees</div>
                            <div class="text-3xl font-bold">{{ totalEmployees }}</div>
                            <div class="text-sm mt-2 opacity-90">
                                <i class="pi pi-arrow-up text-xs"></i> +12% from last month
                            </div>
                        </div>
                        <div class="bg-white bg-opacity-20 rounded-lg p-3">
                            <i class="pi pi-users text-3xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-span-12 md:col-span-6 lg:col-span-3">
                <div class="card mb-0 stat-card-success text-white border-0">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="text-lg font-medium mb-1">Present Today</div>
                            <div class="text-3xl font-bold">{{ presentToday }}</div>
                            <div class="text-sm mt-2 opacity-90">
                                <i class="pi pi-check text-xs"></i> {{ attendanceRate }}% attendance
                            </div>
                        </div>
                        <div class="bg-white bg-opacity-20 rounded-lg p-3">
                            <i class="pi pi-check-circle text-3xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-span-12 md:col-span-6 lg:col-span-3">
                <div class="card mb-0 stat-card-warning text-white border-0">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="text-lg font-medium mb-1">On Leave</div>
                            <div class="text-3xl font-bold">{{ onLeave }}</div>
                            <div class="text-sm mt-2 opacity-90">
                                <i class="pi pi-calendar text-xs"></i> {{ pendingLeaves }} pending requests
                            </div>
                        </div>
                        <div class="bg-white bg-opacity-20 rounded-lg p-3">
                            <i class="pi pi-calendar-times text-3xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-span-12 md:col-span-6 lg:col-span-3">
                <div class="card mb-0 stat-card-info text-white border-0">
                    <div class="flex justify-between items-start">
                        <div>
                            <div class="text-lg font-medium mb-1">Departments</div>
                            <div class="text-3xl font-bold">{{ totalDepartments }}</div>
                            <div class="text-sm mt-2 opacity-90">
                                <i class="pi pi-building text-xs"></i> Across organization
                            </div>
                        </div>
                        <div class="bg-white bg-opacity-20 rounded-lg p-3">
                            <i class="pi pi-sitemap text-3xl"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host ::ng-deep .stat-card-primary {
            background: var(--primary-color);
        }
        :host ::ng-deep .stat-card-success {
            background: #10b981;
        }
        :host ::ng-deep .stat-card-warning {
            background: #f59e0b;
        }
        :host ::ng-deep .stat-card-info {
            background: #3b82f6;
        }
        :host ::ng-deep .card {
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        :host ::ng-deep .card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
    `]
})
export class HrmOverviewWidget implements OnInit {
    totalEmployees: number = 0;
    presentToday: number = 0;
    onLeave: number = 0;
    totalDepartments: number = 0;
    attendanceRate: number = 0;
    pendingLeaves: number = 0;

    ngOnInit() {
        // Simulated data - replace with actual service calls
        this.totalEmployees = 247;
        this.presentToday = 231;
        this.onLeave = 16;
        this.totalDepartments = 12;
        this.attendanceRate = Math.round((this.presentToday / this.totalEmployees) * 100);
        this.pendingLeaves = 5;
    }
}
