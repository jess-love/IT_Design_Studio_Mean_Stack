import { Routes } from '@angular/router';
import { StudyGroup } from './study-group/study-group';

export const routes: Routes = [
  { path: '', redirectTo: 'study-groups', pathMatch: 'full' },
  { path: 'study-groups', component: StudyGroup }
];