import { Routes } from '@angular/router';
import { LoginPageComponent } from './auth/login-page/login-page.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';

export const routes: Routes = [
  {path: 'login', component: LoginPageComponent},
  {path: 'welcome', component: WelcomePageComponent},
  {path: '', redirectTo: 'welcome', pathMatch: 'full'}
];
