import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Empty } from './app/pages/empty/empty';

import { Login } from './app/pages/auth/login';
import { AuthGuard } from './app/guards/auth.guard';
import { Access } from '@/pages/auth/access';

export const appRoutes: Routes = [
    { path: '', component: Login },
    { path: 'access-denied', component: Access },
    {
        path: 'dashboard',
        component: AppLayout,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
            { path: '**', component: Empty }
        ]
    },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '' }
];
