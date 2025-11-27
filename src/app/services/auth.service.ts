import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginDto, RegisterDto, User, UserRole } from '../models/user.model';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = 'http://localhost:5001/api/auth'; // меняй порт под себя

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(dto: LoginDto): Observable<User> {
    return this.http.post<User>(`${this.api}/login`, dto).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', user.id.toString()); // В реальном приложении здесь будет JWT токен
      })
    );
  }

  register(dto: RegisterDto): Observable<User> {
    return this.http.post<User>(`${this.api}/register`, dto);
  }

  getUser(): User | null {
    const json = localStorage.getItem('user');
    return json ? JSON.parse(json) : null;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getUser();
  }

  // Проверка ролей
  hasRole(role: UserRole): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  // Проверка на одну из ролей
  hasAnyRole(roles: UserRole[]): boolean {
    const user = this.getUser();
    if (!user) return false;
    return roles.includes(user.role);
  }

  // Проверка прав доступа
  canAccessEconomistFeatures(): boolean {
    return this.hasRole(UserRole.ECONOMIST) || this.hasRole(UserRole.ADMIN);
  }

  canAccessAccountantFeatures(): boolean {
    return this.hasRole(UserRole.ACCOUNTANT) || this.hasRole(UserRole.ADMIN);
  }

  canAccessManagerFeatures(): boolean {
    return this.hasRole(UserRole.MANAGER) || this.hasRole(UserRole.ADMIN);
  }

  canAccessAdminFeatures(): boolean {
    return this.hasRole(UserRole.ADMIN);
  }

  // Проверка возможности утверждения цен
  canApprovePrices(): boolean {
    return this.hasRole(UserRole.MANAGER) || this.hasRole(UserRole.ADMIN);
  }

  // Универсальная проверка доступа
  canAccess(roles: UserRole[]): boolean {
    return this.hasAnyRole(roles);
  }
}
