import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User, LoginUser } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl: string = 'http://localhost:3000/api/user/';

  constructor(private http: HttpClient, private router: Router) {}

  createUser(username: string, email: string, password: string) {
    const userData: User = {
      username: username,
      email: email,
      password: password,
    };
    this.http
      .post<{ message: string; result: any }>(this.apiUrl + 'signup', userData)
      .subscribe((serverResponseData) => {
        console.log(serverResponseData);
      });
  }
}
