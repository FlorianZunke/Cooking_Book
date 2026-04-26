// AuthGuard für geschützte Routen
// Verhindert Zugriff auf bestimmte Bereiche ohne Authentifizierung
// Implementiert CanActivate Interface von Angular Router

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root' // Singleton-Service
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, // Zugriff auf Auth-Status
    private router: Router // Für Navigation bei fehlender Auth
  ) {}

  // CanActivate-Methode: Wird vor jeder Navigation zu einer geschützten Route aufgerufen
  canActivate(): boolean {
    if (this.authService.isLoggedIn()) { // Signals sind Funktionen - rufen mit () auf
      // Benutzer ist eingeloggt: Zugriff erlauben
      return true;
    } else {
      // Benutzer nicht eingeloggt: Zu Login weiterleiten
      this.router.navigate(['/login']);
      return false;
    }
  }
}