import { Component, HostBinding, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';

@Component({
  selector: 'pzl-app',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, NgOptimizedImage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private router = inject(Router);

  @HostBinding('style.background') get background() {
    if (this.router.url === '/puzzle-game') return 'linear-gradient( #c8b08f, #5e7f94)';
    else return;
  }
}
