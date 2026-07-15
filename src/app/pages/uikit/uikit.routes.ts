import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { SalesOrderComponent } from './sales-order-component/sales-order-component';
import { PermissionGuard } from '@/guards/permission.guard';
import { SalesIndentComponent } from './sales-indent-component/sales-indent-component';

export default [
    { path: '', pathMatch: 'full', redirectTo: 'sales-order' },
    { path: 'sales-order', component: SalesOrderComponent, canActivate: [PermissionGuard], data: { menuId: 11 } },
    { path: 'sales-indent', component: SalesIndentComponent, canActivate: [PermissionGuard], data: { menuId: 469 } },
    { path: '**', component: NotFoundComponent }
] as Routes;
