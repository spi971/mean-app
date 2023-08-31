import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Router } from '@angular/router';
import { User, LoginUser } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl: string = 'http://localhost:3000/api/user/';
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  createUser(username: string, email: string, password: string) {
    const userData: User = {
      username: username,
      email: email,
      password: password,
    };
    this.http
      .post<{ message: string; result: any }>(`${this.apiUrl}signup`, userData)
      .subscribe((serverResponseData) => {
        console.log(serverResponseData);
      });
  }

  loginUser(email: string, password: string) {
    const userData: LoginUser = {
      email: email,
      password: password,
    };
    this.http
      .post<{ message: string; token: string }>(`${this.apiUrl}login`, userData)
      .subscribe((response) => {
        const token = response.token;
        this.token = token;
      });
  }
}
