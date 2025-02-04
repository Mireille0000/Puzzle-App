import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import UserCredentials from '../interfaces/user-credentials.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private router: Router) {}

  saveUserCredentials(data: Partial<UserCredentials>) {
    if (data.firstName as string && data.lastName as string && data.password as string) {
      localStorage.setItem('userCredentials', JSON.stringify(data));
      this.router.navigate(['/welcome']);
    }
  }

  deleteUserCredentials() {
    if (localStorage.getItem('userCredentials')) {
      this.router.navigate(['/login']);
      localStorage.clear();
    }
  }
}
