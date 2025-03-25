import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { NavigationService } from '../core/navigation.service';
import UserCredentials from '../auth/interfaces/user-credentials.interface';

@Component({
  selector: 'app-welcome-page',
  imports: [NgIf, NgTemplateOutlet],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
})
export class WelcomePageComponent implements OnInit {
  userName: UserCredentials | null = JSON.parse(localStorage.getItem('userCredentials') as string)?.firstName;

  isLogged!: boolean;

  constructor(
    private navigation: NavigationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.navigation.getPathName(this.route);
    this.navigation.isLogged$.subscribe((value) => {
      this.isLogged = value;
      return this.isLogged;
    });
  }

  startGame() {
    this.router.navigate(['/puzzle-game']);
  }
}
