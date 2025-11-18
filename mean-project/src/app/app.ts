
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NavigationMenu } from './navigation-menu/navigation-menu';
import { ReactiveFormsModule } from '@angular/forms';
 


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [  RouterOutlet, CommonModule, HttpClientModule, NavigationMenu, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class App {

  protected readonly title = signal('Scholar Path');
}

