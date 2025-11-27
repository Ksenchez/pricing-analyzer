import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { UserRole } from '../models/user.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  
  username = '';
  role = '';

  constructor(private router: Router, private auth: AuthService) {}
  
  ngOnInit(): void {
    const user = this.auth.getUser();
    if (user) {
      this.username = user.username;
      this.role = user.role;
    }
  }

  logout() {
    this.auth.logout();
  }

  canAccessEconomistFeatures(): boolean {
    return this.auth.canAccessEconomistFeatures();
  }

  canAccessAccountantFeatures(): boolean {
    return this.auth.canAccessAccountantFeatures();
  }

  canAccessManagerFeatures(): boolean {
    return this.auth.canAccessManagerFeatures();
  }

  canAccessAdminFeatures(): boolean {
    return this.auth.canAccessAdminFeatures();
  }

  getRoleLabel(): string {
    const roleLabels: Record<string, string> = {
      'ECONOMIST': 'Экономист',
      'ACCOUNTANT': 'Бухгалтер',
      'MANAGER': 'Начальник управления',
      'ADMIN': 'Системный администратор'
    };
    return roleLabels[this.role] || this.role;
  }
}