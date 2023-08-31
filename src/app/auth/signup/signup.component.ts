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
    const { username } = usernameInput.viewModel;
    this.onSignup(form, username);
  }

  onSignup(form: FormGroup, username: string) {
    if (form.invalid) {
      return;
    }
    const { email, password } = form.value;
    this.authService.createUser(username, email, password);
  }
}
