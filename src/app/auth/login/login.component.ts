import { Component, OnInit } from '@angular/core';
import { LoginUser } from '../user.model';
import { FormGroup, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

//no template, the component will be load with the router
@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  isLoading: boolean;
  email: string;
  password: string;

  constructor(private authService: AuthService) {}

  ngOnInit() {}

  formValuesHandler(event: NgForm) {
    const { form } = event;
    this.onLogin(form);
  }

  onLogin(form: FormGroup) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const { email, password } = form.value;
    this.authService.loginUser(email, password);
  }
}
