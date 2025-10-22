import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AssignmentTracker } from './components/assignment-tracker/assignment-tracker'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
            AssignmentTracker,
            ReactiveFormsModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('mean-project');
}
