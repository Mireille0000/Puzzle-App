import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIf } from '@angular/common';
import { NavigationService } from '../navigation.service';
import { LoginService } from '../../auth/services/login.service';

@Component({
  selector: 'pzl-header',
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  firstNavLink: string = '';

  logInLogOut: string = '';

  currentLink: string = '';

  isLogged!: boolean; //

  loginService: LoginService = inject(LoginService);

  constructor(private navigation: NavigationService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // change
    this.navigation.getPathName(this.route);
    this.navigation.firstNavItem$.subscribe((value) => {
      this.firstNavLink = value;
      return this.firstNavLink;
    });
    this.navigation.secondNavItem$.subscribe((value) => {
      this.logInLogOut = value;
      return this.logInLogOut;
    });
    this.navigation.currentLink$.subscribe((value) => {
      this.currentLink = value;
      return this.currentLink;
    });
    this.navigation.isLogged$.subscribe((value) => {
      this.isLogged = value;
      return this.isLogged;
    });
  }

  logOut() {
    this.logInLogOut = 'Log in';
    this.isLogged = false;
    this.loginService.deleteUserCredentials();
  }
}
