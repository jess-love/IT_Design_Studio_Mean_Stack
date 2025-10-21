import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClassSchedule } from './class-schedule/class-schedule';

@Component({
  selector: 'app-root',
  imports: [ ClassSchedule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Scholar Path');
}
