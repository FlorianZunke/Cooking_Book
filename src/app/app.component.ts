import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Cooking Book';

  // Injiziere AuthService (Angular 14+ standalone style)
  private authService = inject(AuthService);

  // Exponiere isLoggedIn Signal für Template
  readonly isLoggedIn = this.authService.isLoggedIn;

  // Logout-Methode
  logout(): void {
    this.authService.logout();
  }
}
