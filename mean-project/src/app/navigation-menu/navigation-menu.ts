import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router'; 


@Component({
  selector: 'app-navigation-menu',
  standalone: true,
  imports: [MatButtonModule, MatMenuModule, RouterModule],
  templateUrl: './navigation-menu.html',
  styleUrl: './navigation-menu.css'
})
export class NavigationMenu {

}
