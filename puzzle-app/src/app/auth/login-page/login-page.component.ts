import {
  Component, inject,
} from '@angular/core';
import {
  FormControl, FormGroup, ReactiveFormsModule, Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { isEnglishAlphabet, isCapitalized } from './custom-validators/name-validators';
import {
  hasDigit, hasLowercaseLetter, hasSpecialCharacter, hasUppercaseLetter,
} from './custom-validators/password-validators';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'pzl-login-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
  loginForm = new FormGroup({
    firstName: new FormControl<string>(
      '',
      [
        Validators.minLength(3),
        isCapitalized(/^[A-Z]{1}.*/),
        isEnglishAlphabet(/^[A-Za-z\-/]+$/),
        Validators.required,
      ],
    ),
    lastName: new FormControl<string>(
      '',
      [Validators.minLength(3),
        isCapitalized(/^[A-Z]{1}.*/),
        isEnglishAlphabet(/^[A-Za-z\-/]+$/),
        Validators.required,
      ],
    ),
    password: new FormControl<string>(
      '',
      [
        Validators.required,
        hasDigit(/(?=.*?[0-9])/),
        hasUppercaseLetter(/(?=.*?[A-Z])/),
        hasLowercaseLetter(/(?=.*?[a-z])/),
        hasSpecialCharacter(/(?=.*?[#?!@$%^&*-])/),
        Validators.minLength(8),
      ],
    ),
  });

  loginService: LoginService = inject(LoginService);

  get firstName() {
    return this.loginForm.get('firstName');
  }

  get lastName() {
    return this.loginForm.get('lastName');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    console.log(this.loginForm.value);
    const userCredentials = this.loginForm.value;
    this.loginService.saveUserCredentials(userCredentials);
  }
}
