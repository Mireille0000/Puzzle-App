import { Injectable } from '@angular/core';
import UserCredentials from '../interfaces/user-credentials.interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private router: Router) {}
  saveUserCredentials(data: Partial<UserCredentials>) {
    if (data.firstName as string && data.lastName as string && data.password as string) {
      localStorage.setItem('userCredentials', JSON.stringify(data));
      this.router.navigate(['/welcome'])
    }
  }

  deleteUserCredentials() {
    if (localStorage.length) {
      this.router.navigate(['/login']);
      localStorage.clear();
    }
  }
}
