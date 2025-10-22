import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReminderComponent } from './reminders/reminder.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReminderComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('mean-project');
}