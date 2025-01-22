import { Injectable } from '@angular/core';
import UserCredentials from '../interfaces/user-credentials.interface';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  saveUserCredentials(data: Partial<UserCredentials>) {
    if (data.firstName as string && data.lastName as string && data.password as string) {
      localStorage.setItem('userCredentials', JSON.stringify(data));
    }
  }

  deleteUserCredentials() {
    if (localStorage.length) {
      localStorage.clear();
    }
  }
}
