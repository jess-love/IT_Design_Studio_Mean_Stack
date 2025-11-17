import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { StudyGroup } from './study-group/study-group';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, StudyGroup],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  showPortal = false;
}