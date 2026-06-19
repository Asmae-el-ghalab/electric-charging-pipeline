// src/app/pages/register/registerComponent.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbarComponent';

@Component({
  selector: 'app-register',
  templateUrl: './registerComponent.html',
  styleUrls: ['./registerComponent.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,NavbarComponent
  ]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      vehicule: ['', [Validators.required, Validators.minLength(3)]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup): ValidationErrors | null {
    const password = group.get('motDePasse')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    // ✅ Vider les messages précédents
    this.errorMessage = '';
    this.successMessage = '';

    // ✅ Vérifier si le formulaire est valide
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;

    const userData = {
      nom: this.registerForm.get('nom')?.value?.trim(),
      email: this.registerForm.get('email')?.value?.trim(),
      motDePasse: this.registerForm.get('motDePasse')?.value,
      vehicule: this.registerForm.get('vehicule')?.value?.trim()
    };

    console.log('📤 Envoi des données d\'inscription:', userData);

    this.authService.register(userData).subscribe({
      next: (response: any) => {
        console.log('✅ Réponse reçue du serveur:', response);
        
        this.isLoading = false;
        
        // ✅ Afficher le message de succès
        if (response && response.success === true) {
          this.successMessage = response.message || '✅ Inscription réussie ! Veuillez vous connecter.';
        } else if (response && response.message) {
          this.successMessage = '✅ ' + response.message;
        } else {
          this.successMessage = '✅ Inscription réussie ! Vous allez être redirigé.';
        }
        
        // ✅ Réinitialiser le formulaire
        this.registerForm.reset();
        
        // ✅ Rediriger vers la page de connexion après 2 secondes
        setTimeout(() => {
          this.router.navigate(['/connexion']);
        }, 2500);
      },
      error: (error) => {
        console.error('❌ Erreur lors de l\'inscription:', error);
        this.isLoading = false;
        
        // ✅ Extraire le message d'erreur
        if (error.error && typeof error.error === 'object') {
          this.errorMessage = error.error.error || error.error.message || "Erreur lors de l'inscription";
        } else if (typeof error.error === 'string') {
          this.errorMessage = error.error;
        } else {
          this.errorMessage = error.message || "Erreur lors de l'inscription";
        }
        
        // ✅ Si l'erreur contient "déjà utilisé"
        if (this.errorMessage.includes('déjà utilisé')) {
          this.errorMessage = '❌ Cet email est déjà utilisé. Veuillez en utiliser un autre.';
        }
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  // ✅ Getters pour faciliter l'accès aux champs
  get nom() { return this.registerForm.get('nom'); }
  get email() { return this.registerForm.get('email'); }
  get motDePasse() { return this.registerForm.get('motDePasse'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get vehicule() { return this.registerForm.get('vehicule'); }
}