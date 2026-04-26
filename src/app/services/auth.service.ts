// AuthService für die Cooking Book App
// Verwaltet Benutzer-Authentifizierung mit Angular Signals (reaktiv ohne RxJS)
// Keine Persistierung - Daten verschwinden beim Neuladen der Seite

import { Injectable, signal, computed } from '@angular/core';
import { User, LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root' // Singleton-Service, verfügbar in der gesamten App
})
export class AuthService {
  // Signal für den aktuellen Benutzer (ersetzt BehaviorSubject)
  // Signals sind die moderne, effizientere Alternative zu Observables für lokale State-Management
  private currentUserSignal = signal<User | null>(null);

  // Computed Signal für Login-Status (automatisch aktualisiert bei Änderungen)
  // Basiert auf currentUserSignal - true wenn User vorhanden
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);

  // Öffentliches Signal für Komponenten-Zugriff (readonly für Sicherheit)
  readonly currentUser = this.currentUserSignal.asReadonly();

  // In-Memory Speicher für User (ersetzt localStorage)
  // Einfache Map für Demo-Zwecke - in Produktion würde dies ein Backend sein
  private users = new Map<string, User>();

  constructor() {
    // Kein Laden aus localStorage - alles startet leer
  }

  // Login-Methode mit Promise (statt Observable)
  // Signals funktionieren gut mit Promises für asynchrone Operationen
  async login(request: LoginRequest): Promise<LoginResponse> {
    // Simulierte API-Verzögerung
    await this.delay(500);

    // Finde User mit E-Mail
    const user = Array.from(this.users.values()).find(u => u.email === request.email);

    if (!user) {
      throw new Error('Benutzer nicht gefunden');
    }

    // Dummy-Passwort-Check (nicht sicher!)
    if (request.password !== 'password123') {
      throw new Error('Falsches Passwort');
    }

    // Generiere einfachen Token
    const token = this.generateToken(user);

    // Setze aktuellen User (Signal wird automatisch aktualisiert)
    this.currentUserSignal.set(user);

    return { user, token };
  }

  // Registrierungs-Methode
  async register(request: RegisterRequest): Promise<RegisterResponse> {
    await this.delay(500);

    // Prüfe, ob E-Mail bereits existiert
    const existingUser = Array.from(this.users.values()).find(u => u.email === request.email);
    if (existingUser) {
      throw new Error('E-Mail bereits registriert');
    }

    // Erstelle neuen User
    const newUser: User = {
      id: this.generateId(),
      email: request.email,
      name: request.name,
      createdAt: new Date().toISOString()
    };

    // Speichere in In-Memory Map
    this.users.set(newUser.id, newUser);

    // Generiere Token und setze als aktuellen User
    const token = this.generateToken(newUser);
    this.currentUserSignal.set(newUser);

    return { user: newUser, token };
  }

  // Logout-Methode
  logout(): void {
    // Setze Signal auf null (alle computed Signals aktualisieren sich automatisch)
    this.currentUserSignal.set(null);
  }

  // Hilfsmethoden

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private generateToken(user: User): string {
    // Einfacher Token für Demo
    return btoa(`${user.id}:${Date.now()}`);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}