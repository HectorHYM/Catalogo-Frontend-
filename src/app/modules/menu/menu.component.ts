import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RoleDirective } from "@core/directives/role.directive";
import { User } from '@core/models/user';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-menu',
  imports: [RoleDirective, CommonModule],
  standalone: true,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit{
  user: User | null = null;

  constructor(private userSvc: UserService) {}
  ngOnInit(): void {
    this.user = this.userSvc.getCurrentUser();
    console.log("Sesión de usuario actual: ", this.user);
  }
}
