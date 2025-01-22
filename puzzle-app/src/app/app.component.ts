import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginPageComponent } from './auth/login-page/login-page.component';

@Component({
  selector: 'pzl-app',
  imports: [RouterOutlet, LoginPageComponent, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'puzzle-app';
}
