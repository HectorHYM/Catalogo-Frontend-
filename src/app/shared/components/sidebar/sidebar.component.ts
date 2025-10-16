import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RoleDirective } from "@core/directives/role.directive";
import { User } from '@core/models/user';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-sidebar',
  imports: [RoleDirective, CommonModule],
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit{
  user: User | null = null;
  @Input() isOpen: boolean = false;

  constructor(private userSvc: UserService) {}
  ngOnInit(): void {
    this.user = this.userSvc.getCurrentUser();
    //^ log
    //console.log("Sesión de usuario actual: ", this.user);
  }
}
