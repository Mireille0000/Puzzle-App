import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'pzl-app',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NgOptimizedImage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
}
