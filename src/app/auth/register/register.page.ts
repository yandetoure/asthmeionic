import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  user = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  };
  loading = false;
  errorMessage = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  async register() {
    if (this.user.password !== this.user.password_confirmation) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.auth.register(this.user).subscribe({
      next: (res) => {
        this.loading = false;
        this.router.navigateByUrl('/', { replaceUrl: true });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || "Une erreur est survenue lors de l'inscription.";
        console.error('Register error:', err);
      }
    });
  }
}
