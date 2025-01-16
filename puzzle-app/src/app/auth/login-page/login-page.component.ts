import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  loginForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    password: new FormControl(''),
  })


  onSubmit() {
    console.log(this.loginForm.value);
  }
}
