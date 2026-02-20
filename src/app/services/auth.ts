import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, finalize } from 'rxjs';
import { ApiService } from './api';
import { User } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private api: ApiService) {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  register(data: any): Observable<any> {
    return this.api.post<any>('register', data).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  login(credentials: any): Observable<any> {
    return this.api.post<any>('login', credentials).pipe(
      tap(res => this.handleAuth(res))
    );
  }

  logout(): Observable<any> {
    return this.api.post<any>('logout', {}).pipe(
      finalize(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
      })
    );
  }

  private handleAuth(res: any) {
    if (res.token) {
      localStorage.setItem('auth_token', res.token);
    }
    if (res.user) {
      localStorage.setItem('user', JSON.stringify(res.user));
      this.currentUserSubject.next(res.user);
    }
  }

  updateProfile(data: any): Observable<User> {
    return this.api.put<User>('user/profile', data).pipe(
      tap(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
