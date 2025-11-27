export enum UserRole {
  ECONOMIST = 'ECONOMIST', // Экономист
  ACCOUNTANT = 'ACCOUNTANT', // Бухгалтер
  MANAGER = 'MANAGER', // Начальник управления торговлей
  ADMIN = 'ADMIN' // Системный администратор
}

export interface User {
  id: number;
  username: string;
  role: UserRole;
  fullName?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
  role?: UserRole; // Только для админа при создании пользователей
  fullName?: string;
  email?: string;
}

export interface CreateUserDto {
  username: string;
  password: string;
  role: UserRole;
  fullName?: string;
  email?: string;
}

export interface UpdateUserDto {
  username?: string;
  role?: UserRole;
  fullName?: string;
  email?: string;
  isActive?: boolean;
}
    