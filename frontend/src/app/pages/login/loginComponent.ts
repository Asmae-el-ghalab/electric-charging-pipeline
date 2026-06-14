// src/app/components/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './loginComponent.html',
  styleUrls: ['./loginComponent.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Vérifier si déjà connecté
    if (this.authService.isLoggedIn()) {
      console.log('🔐 Utilisateur déjà connecté, redirection...');
      this.redirectBasedOnRole();
    }
  }

  onSubmit(): void {
    // Vérifier si le formulaire est valide
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const loginData = {
      email: this.loginForm.get('email')?.value,
      motDePasse: this.loginForm.get('motDePasse')?.value
    };

    console.log('🔄 Tentative de connexion pour:', loginData.email);
    
    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('✅ Réponse de connexion reçue:', response);
        this.isLoading = false;
        
        // Vérifier s'il y a une erreur
        if (response.error) {
          this.errorMessage = response.error;
          console.error('❌ Erreur:', response.error);
          return;
        }
        
        // Vérifier que le token est présent
        if (!response.token) {
          this.errorMessage = 'Réponse invalide du serveur';
          console.error('❌ Pas de token dans la réponse');
          return;
        }
        
        console.log('🎉 Connexion réussie!');
        
        // Attendre un peu avant de rediriger
        setTimeout(() => {
          this.redirectBasedOnRole();
        }, 500);
      },
      error: (error) => {
        console.error('❌ Erreur HTTP:', error);
        this.isLoading = false;
        
        if (error.error?.error) {
          this.errorMessage = error.error.error;
        } else if (error.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else if (error.status === 500) {
          this.errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    });
  }

  redirectBasedOnRole(): void {
    const token = this.authService.getToken();
    const role = this.authService.getUserRole();
    const userName = this.authService.getUserName();
    
    console.log('🔍 Redirection - Informations:', {
      'Token présent': !!token,
      'Rôle': role,
      'Nom': userName,
      'Token value': token ? token.substring(0, 20) + '...' : 'null'
    });
    
    if (!token) {
      console.error('❌ Pas de token trouvé, redirection vers login');
      this.router.navigate(['/login']);
      return;
    }
    
    // Rediriger selon le rôle
    if (this.authService.isAdmin()) {
      console.log('👑 Redirection vers Dashboard Admin');
      this.router.navigate(['/admin/dashboard']);
    } else if (this.authService.isConducteur()) {
      console.log('🚗 Redirection vers Dashboard Conducteur');
      this.router.navigate(['/conducteur/dashboard']);
    } else if (this.authService.isPassager()) {
      console.log('👤 Redirection vers Dashboard Passager');
      this.router.navigate(['/passager/dashboard']);
    } else {
      console.warn('⚠️ Rôle non reconnu:', role);
      this.router.navigate(['/accueil']);
    }
  }

  // Getters pour le formulaire
  get email() { return this.loginForm.get('email'); }
  get motDePasse() { return this.loginForm.get('motDePasse'); }

  // Helper methods
  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}