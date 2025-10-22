import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
<<<<<<< HEAD

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
=======
import { ReminderComponent } from './reminders/reminder.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReminderComponent],
>>>>>>> Linda's-code
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mean-project');
}
