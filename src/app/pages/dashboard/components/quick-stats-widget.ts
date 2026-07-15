import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';

@Component({
    selector: 'app-quick-stats-widget',
    standalone: true,
    imports: [CommonModule, CardModule, ChartModule],
    template: `
        <div class="grid grid-cols-12 gap-4">
            <div class="col-span-12 lg:col-span-6">
                <p-card header="Attendance This Month" styleClass="h-full">
                    <p-chart type="line" [data]="attendanceData" [options]="chartOptions"></p-chart>
                </p-card>
            </div>
            <div class="col-span-12 lg:col-span-6">
                <p-card header="Leave Distribution" styleClass="h-full">
                    <p-chart type="doughnut" [data]="leaveData" [options]="doughnutOptions"></p-chart>
                </p-card>
            </div>
        </div>
    `
})
export class QuickStatsWidget implements OnInit {
    attendanceData: any;
    leaveData: any;
    chartOptions: any;
    doughnutOptions: any;

    ngOnInit() {
        this.attendanceData = {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
                {
                    label: 'Attendance Rate (%)',
                    data: [95, 93, 96, 94],
                    fill: true,
                    borderColor: 'var(--primary-color)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4
                }
            ]
        };

        this.leaveData = {
            labels: ['Annual Leave', 'Sick Leave', 'Casual Leave', 'Medical Leave'],
            datasets: [
                {
                    data: [45, 25, 20, 10],
                    backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#3b82f6'],
                    hoverBackgroundColor: ['#4f46e5', '#059669', '#d97706', '#2563eb']
                }
            ]
        };

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value: any) {
                            return value + '%';
                        }
                    }
                }
            }
        };

        this.doughnutOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                }
            }
        };
    }
}
