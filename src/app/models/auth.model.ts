// Auth-Model für die Cooking Book App
// Dieses Modell definiert die Datenstrukturen für Benutzer-Authentifizierung

export interface User {
  // Eindeutige ID des Benutzers (wird später vom Backend generiert)
  id: string;

  // E-Mail-Adresse des Benutzers (wird als Login-Name verwendet)
  email: string;

  // Vollständiger Name des Benutzers (z.B. "Max Mustermann")
  name: string;

  // Zeitstempel der Registrierung (ISO-String)
  createdAt: string;

  // Optional: Zeitstempel der letzten Anmeldung
  lastLoginAt?: string;
}

// Interface für Login-Anfragen
// Enthält nur die Daten, die für den Login benötigt werden
export interface LoginRequest {
  email: string;
  password: string;
}

// Interface für Registrierungs-Anfragen
// Enthält die Daten für die Erstellung eines neuen Benutzerkontos
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Interface für die Antwort nach erfolgreichem Login
// Enthält den Benutzer und ein Token für die Session-Verwaltung
export interface LoginResponse {
  user: User;
  token: string; // JWT-Token oder ähnliches für Authentifizierung
}

// Interface für die Antwort nach erfolgreicher Registrierung
// Ähnlich wie LoginResponse, aber ohne Token (oder mit, je nach Backend)
export interface RegisterResponse {
  user: User;
  token?: string; // Optional, falls sofort eingeloggt
}