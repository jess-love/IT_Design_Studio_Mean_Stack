import { Routes } from '@angular/router';
import { NotFound } from './not-found/not-found';
import { Home } from './home/home';
import { ClassSchedule } from './class-schedule/class-schedule';
import { StudyGroup } from './study-group/study-group';
import { ReminderComponent } from './reminders/reminder.component';
import { AssignmentTracker } from './components/assignment-tracker/assignment-tracker';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'home',
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
        path: 'study-groups',
        component: StudyGroup
    },
    {   path: 'reminder',
        component: ReminderComponent
    },
    {   path: 'assignment',
        component: AssignmentTracker
    },
    {
        path: '**',
        component: NotFound
    }
];




