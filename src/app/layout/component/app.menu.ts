import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { StorageUtil } from '@/utility/StorageUtil';
import { MenuRolesService } from '../../pages/service/menuRoles.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator"  [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];
    user: any = StorageUtil.getItem('user');
    constructor(private menuRoleService : MenuRolesService) {}

    ngOnInit() {
        this.getUserMenuRole();
    }

    private transformMenu(apiResponse: any[]): any[] {
        return apiResponse.map(menu => {
            const transformed: any = {
            menuId: menu.menuId,
            label: menu.label,
            icon: menu.icon,
            routerLink: menu.routerLink
            };

            if (menu.items && menu.items.length > 0) {
                transformed.items = this.transformMenu(menu.items);
            }

            return transformed;
        });
    }




    getUserMenuRole(){
        // Temporary: keep API call commented and show dummy menu for sales baseline.
        // this.menuRoleService.getMenuByRole(this.user.roleId).subscribe({
        //     next: (res) => {
        //         console.log(res);
        //         this.model = this.transformMenu(res);
        //     },
        //     error: (err) => {
        //         console.log(err);
        //     }
        // });

        this.model = [
            {
                label: 'Dashboard',
                icon: 'pi pi-home',
                routerLink: ['/dashboard']
            },
            {
                label: 'Sales',
                icon: 'pi pi-chart-line',
                items: [
                    {
                        label: 'Orders',
                        icon: 'pi pi-shopping-cart',
                        routerLink: ['/dashboard/uikit/sales-order'],
                        menuId:11
                    },
                    {
                        label: 'Indent',
                        icon: 'pi pi-warehouse',
                        routerLink: ['/dashboard/uikit/sales-indent'],
                        menuId:469
                    }
                ]
            },
            {
                label: 'Settings',
                icon: 'pi pi-cog',
                routerLink: ['/dashboard/uikit']
            }
        ];
    }
}
