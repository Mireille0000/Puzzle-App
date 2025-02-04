import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import UserCredentials from '../auth/interfaces/user-credentials.interface';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  currentPathName$ = new BehaviorSubject<string>('');

  firstNavItem$ = new BehaviorSubject<string>('');

  secondNavItem$ = new BehaviorSubject<string>('');

  currentLink$ = new BehaviorSubject<string>('');

  isLogged$ = new BehaviorSubject<boolean>(false);

  defineLogInLogOutLink(): string {
    let link = '';
    const userInfo: UserCredentials = JSON.parse(localStorage.getItem('userCredentials') as string);
    if (userInfo) {
      this.isLogged$.next(true);
      link = 'Log out';
      return link;
    }
    this.isLogged$.next(false);
    link = 'Log in';
    return link;
  }

  getPathName(route: ActivatedRoute) {
    route.url.subscribe((data) => {
      this.currentPathName$.next(data[0].path);
      switch (data[0].path) {
        case 'login':
          this.firstNavItem$.next('Back to Main');
          this.secondNavItem$.next('About');
          this.currentLink$.next('');
          break;
        case 'welcome':
          this.firstNavItem$.next('About');
          this.secondNavItem$.next(this.defineLogInLogOutLink());
          this.currentLink$.next('/login');
          break;
        case 'puzzle-game':
          this.firstNavItem$.next('Back to Main');
          this.secondNavItem$.next(this.defineLogInLogOutLink());
          this.currentLink$.next('/login');
          break;
        default:
          this.firstNavItem$.next('Back to Main');
          this.secondNavItem$.next(this.defineLogInLogOutLink());
          this.currentLink$.next('/login');
      }

      return this.currentPathName$;
    });
  }
}
