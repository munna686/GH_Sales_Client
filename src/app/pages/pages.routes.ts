import { Routes } from '@angular/router';
import { Empty } from './empty/empty';

export default [
    { path: '', component: Empty },
    { path: 'empty', component: Empty },
    { path: '**', component: Empty }
] as Routes;
