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
  private tokenTimer: ReturnType<typeof setTimeout>;

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
    const isLogged: boolean = this.getAuthStatus();
    if (!isLogged) {
      this.navigateTo('login');
    }
    return isLogged;
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
      .post<{ message: string; token: string; expiresIn: number }>(
        `${this.apiUrl}login`,
        userData
      )
      .subscribe((response) => {
        const token: string = response.token;
        this.token = token;
        if (token) {
          const tokenDuration: number = response.expiresIn;
          this.setTimer(tokenDuration);
          this.authStatusListener.next(true);
          this.isLogged = true;
          const now = new Date();
          const expirationData = new Date(now.getTime() + tokenDuration * 1000);
          this.saveAuthData(token, expirationData);
          this.navigateTo('/');
        }
      });
  }

  autoLoginUser() {
    const loginInfo = this.getAuthData();
    if (!loginInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = loginInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = loginInfo.token;
      this.authStatusListener.next(true);
      this.isLogged = true;
      this.setTimer(expiresIn / 1000);
    }
  }

  logoutUser() {
    this.token = null;
    this.isLogged = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.navigateTo('/');
  }

  private setTimer(tokenDuration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, tokenDuration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    if (!token || !expirationDate) {
      return false;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }
}
