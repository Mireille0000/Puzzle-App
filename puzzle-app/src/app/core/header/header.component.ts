import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationService } from '../navigation.service';
import { from, map, multicast, Observable, Subject, Subscription } from 'rxjs';
import { LoginService } from '../../auth/services/login.service';
import { NgIf } from '@angular/common';


@Component({
  selector: 'pzl-header',
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  firstNavLink: string = '';
  logInLogOut: string = '';
  currentLink: string = '';
  isLogged!: boolean; //
  loginService: LoginService = inject(LoginService);

  constructor(private navigation: NavigationService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // change
    this.navigation.getPathName(this.route);
    this.navigation.firstNavItem$.subscribe((value) => this.firstNavLink = value);
    this.navigation.secondNavItem$.subscribe((value) => this.logInLogOut = value);
    this.navigation.currentLink$.subscribe((value) => this.currentLink = value);
    this.navigation.isLogged$.subscribe((value) => this.isLogged = value);
  }

  logOut() {
    this.logInLogOut = 'Log in';
    this.isLogged = false;
    this.loginService.deleteUserCredentials();
  }
}
