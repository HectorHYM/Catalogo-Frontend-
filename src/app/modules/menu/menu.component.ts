import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SettingsButtonComponent } from "./layouts/settings-button/settings-button.component";
import { SidebarComponent } from "@shared/components/sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, SettingsButtonComponent, SidebarComponent, RouterOutlet],
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  sidebarOpen: boolean = false;
  toggleSidebar(){ this.sidebarOpen = !this.sidebarOpen; }
}