import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { User, CreateUserDto, UpdateUserDto, UserRole } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  showCreateModal = false;
  showEditModal = false;
  showResetPasswordModal = false;
  selectedUser: User | null = null;
  canManage = false;

  newUser: CreateUserDto = {
    username: '',
    password: '',
    role: UserRole.ECONOMIST,
    fullName: '',
    email: ''
  };

  editUser: UpdateUserDto = {};
  newPassword = '';

  roles = Object.values(UserRole);
  roleLabels: Record<UserRole, string> = {
    [UserRole.ECONOMIST]: 'Экономист',
    [UserRole.ACCOUNTANT]: 'Бухгалтер',
    [UserRole.MANAGER]: 'Начальник управления',
    [UserRole.ADMIN]: 'Системный администратор'
  };

  constructor(
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.canManage = this.auth.canAccessAdminFeatures();
    if (this.canManage) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    this.api.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  openCreateModal(): void {
    this.newUser = {
      username: '',
      password: '',
      role: UserRole.ECONOMIST,
      fullName: '',
      email: ''
    };
    this.showCreateModal = true;
  }

  createUser(): void {
    this.api.createUser(this.newUser).subscribe(() => {
      this.loadUsers();
      this.showCreateModal = false;
    });
  }

  openEditModal(user: User): void {
    this.selectedUser = user;
    this.editUser = {
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      email: user.email,
      isActive: user.isActive
    };
    this.showEditModal = true;
  }

  updateUser(): void {
    if (!this.selectedUser) return;
    this.api.updateUser(this.selectedUser.id, this.editUser).subscribe(() => {
      this.loadUsers();
      this.showEditModal = false;
      this.selectedUser = null;
    });
  }

  openResetPasswordModal(user: User): void {
    this.selectedUser = user;
    this.newPassword = '';
    this.showResetPasswordModal = true;
  }

  resetPassword(): void {
    if (!this.selectedUser) return;
    this.api.resetUserPassword(this.selectedUser.id, this.newPassword).subscribe(() => {
      this.showResetPasswordModal = false;
      this.selectedUser = null;
      alert('Пароль успешно изменен');
    });
  }

  deleteUser(id: number): void {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      this.api.deleteUser(id).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  getRoleLabel(role: UserRole): string {
    return this.roleLabels[role] || role;
  }
}



