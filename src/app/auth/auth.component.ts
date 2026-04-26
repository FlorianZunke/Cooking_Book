// AuthComponent für Login und Registrierung
// Zeigt Formulare für Benutzer-Authentifizierung an
// Verwendet Reactive Forms für Validierung und Datenbindung

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginRequest, RegisterRequest } from '../models/auth.model';

@Component({
  selector: 'app-auth',
  standalone: true, // Standalone Component (Angular 19)
  imports: [CommonModule, ReactiveFormsModule], // Importiert Module für Template
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
  // Formulare für Login und Registrierung
  loginForm: FormGroup;
  registerForm: FormGroup;

  // Status-Variablen für UI
  isLoginMode = true; // Zeigt Login-Formular standardmäßig
  isLoading = false; // Zeigt Lade-Indikator während API-Calls
  errorMessage = ''; // Zeigt Fehlermeldungen an

  constructor(
    private fb: FormBuilder, // FormBuilder für einfache Form-Erstellung
    private authService: AuthService, // AuthService für Authentifizierung
    private router: Router // Router für Navigation nach Login
  ) {
    // Initialisiere Login-Formular
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Pflichtfeld, gültige E-Mail
      password: ['', [Validators.required, Validators.minLength(6)]] // Pflichtfeld, min. 6 Zeichen
    });

    // Initialisiere Registrierungs-Formular
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]], // Pflichtfeld, min. 2 Zeichen
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator // Benutzerdefinierte Validierung für Passwort-Bestätigung
    });
  }

  // Getter für einfachen Zugriff auf Form-Felder (für Template)
  get loginEmail() { return this.loginForm.get('email'); }
  get loginPassword() { return this.loginForm.get('password'); }

  get registerName() { return this.registerForm.get('name'); }
  get registerEmail() { return this.registerForm.get('email'); }
  get registerPassword() { return this.registerForm.get('password'); }
  get registerConfirmPassword() { return this.registerForm.get('confirmPassword'); }

  // Wechselt zwischen Login- und Registrierungsmodus
  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = ''; // Fehler zurücksetzen beim Wechsel
  }

  // Login-Handler (async mit Signals)
  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const request: LoginRequest = this.loginForm.value;

    try {
      const response = await this.authService.login(request);
      this.isLoading = false;
      // Navigation zur Hauptseite nach erfolgreichem Login
      this.router.navigate(['/recipes']);
    } catch (error: any) {
      this.isLoading = false;
      this.errorMessage = error.message || 'Login fehlgeschlagen';
    }
  }

  // Registrierungs-Handler (async mit Signals)
  async onRegister(): Promise<void> {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { confirmPassword, ...requestData } = this.registerForm.value;
    const request: RegisterRequest = requestData;

    try {
      const response = await this.authService.register(request);
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    } catch (error: any) {
      this.isLoading = false;
      this.errorMessage = error.message || 'Registrierung fehlgeschlagen';
    }
  }

  // Hilfsmethode: Markiert alle Felder als "touched" für Validierungsanzeige
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Benutzerdefinierte Validierung: Prüft, ob Passwort und Bestätigung übereinstimmen
  private passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
