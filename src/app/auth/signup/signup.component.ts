import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm, NgModel } from '@angular/forms';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: 'signup.component.html',
  styleUrls: ['signup.component.css'],
})
export class SignupComponent implements OnInit {
  isLoading: boolean;
  username: string;
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  formValuesHandler(event: NgForm, usernameInput: NgModel) {
    const { form } = event;
    this.onSignup(form, usernameInput.viewModel);
  }

  onSignup(form: FormGroup, username: string) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const { email, password } = form.value;
    this.authService.createUser(username, email, password);
  }
}
