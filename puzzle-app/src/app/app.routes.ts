import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { PuzzleGamePageComponent } from './puzzle-game/puzzle-game-page.component';
import { loggedUserPagesGuard } from './auth/guards/logged-user-pages.guard';
import { ErrorPageComponent } from './error-page/error-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'puzzle-game', component: PuzzleGamePageComponent, canActivate: [loggedUserPagesGuard] },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', component: ErrorPageComponent },
];
