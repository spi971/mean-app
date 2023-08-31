import { Component, OnInit } from '@angular/core';
import { LoginUser } from '../user.model';
import { FormGroup, NgForm } from '@angular/forms';

//no template, the component will be load with the router
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoading: boolean;
  email: string;
  password: string;

  constructor() {}

  ngOnInit() {}

  formValuesHandler(event: NgForm) {
    const { form } = event;
    this.onLogin(form);
  }

  onLogin(form: FormGroup) {
    const { email, password } = form.value;

    const userLogin: LoginUser = {
      email: email,
      password: password,
    };
    console.log(userLogin);
  }
}
