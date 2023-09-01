import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Router } from '@angular/router';
import { User, LoginUser } from './user.model';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl: string = 'http://localhost:3000/api/user/';
  private token: string;
  private isLogged: boolean = false;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  navigateTo(path: string) {
    return this.router.navigate([path]);
  }

  getToken(): string {
    return this.token;
  }

  getAuthStatus(): boolean {
    return this.isLogged;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  canActivate(): boolean | Observable<boolean> | Promise<boolean> {
    const isLooged = this.getAuthStatus();
    if (!isLooged) {
      this.navigateTo('login');
    }
    return isLooged;
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
        this.navigateTo('login');
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
        if (token) {
          this.authStatusListener.next(true);
          this.isLogged = true;
          this.navigateTo('/');
        }
      });
  }

  logoutUser() {
    this.token = null;
    this.isLogged = false;
    this.authStatusListener.next(false);
    this.navigateTo('/');
  }
}
