import { Routes } from '@angular/router';
import { ClassSchedule } from './class-schedule/class-schedule';
import { NotFound } from './not-found/not-found';
import { Home } from './home/home';

export const routes: Routes = [
    {
        path: '',  // default route
        component: Home
    },
    {
        path: 'home',  // default route
        component: Home
    },
    {
        path: 'addClassSchedule',
        component: ClassSchedule
    },
    {
        path: 'editClassSchedule/:_id',
        component: ClassSchedule
    },
    {
        path: '**',
        component: NotFound
    }
];
