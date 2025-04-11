import {
  Component, ElementRef, inject, OnInit, viewChild,
} from '@angular/core';
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
  private loginService: LoginService = inject(LoginService);

  firstNavLink: string = '';

  logInLogOut: string = '';

  currentLink: string = '';

  isLogged!: boolean; //

  canvasLogo = viewChild<ElementRef<HTMLCanvasElement>>('logoPuzzle');

  constructor(private navigation: NavigationService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.renderPuzzleLogo();
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

  renderPuzzleLogo() {
    const puzzleCtx = this.canvasLogo()?.nativeElement.getContext('2d');
    if (puzzleCtx) {
      puzzleCtx.moveTo(10, 10);
      puzzleCtx.bezierCurveTo(10, 95, 50, 34, 45, 80);
      puzzleCtx.bezierCurveTo(45, 115, 10, 80, 20, 145);
      puzzleCtx.lineTo(250, 145);
      puzzleCtx.bezierCurveTo(230, 100, 270, 105, 275, 80);
      puzzleCtx.bezierCurveTo(275, 40, 240, 70, 250, 10);
      puzzleCtx.lineTo(10, 10);
      puzzleCtx.closePath();
      puzzleCtx.clip();

      puzzleCtx.fillStyle = 'rgb(191, 96, 55)';
      puzzleCtx.fill();
      puzzleCtx.font = 'bold 35px Winky Rough';
      puzzleCtx.fillStyle = 'rgba(228, 206, 206, 0.9)';
      puzzleCtx.fillText('Puzzle Game', 55, 80);
      puzzleCtx.lineWidth = 4;
      puzzleCtx.strokeStyle = ' #d68e30';
      puzzleCtx.stroke();
    }
  }

  logOut() {
    this.logInLogOut = 'Log in';
    this.isLogged = false;
    this.loginService.deleteUserCredentials();
  }
}
