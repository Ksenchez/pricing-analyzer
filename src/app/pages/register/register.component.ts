import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterDto } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form: RegisterDto = {
    username: '',
    password: ''
  };

  error: string = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.auth.register(this.form).subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => this.error = err.error || 'Ошибка регистрации'
    });
  }
}
