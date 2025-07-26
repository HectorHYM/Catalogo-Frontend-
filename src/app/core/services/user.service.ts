import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { User } from '@core/models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  //* URL base para todas las peticiones relacionadas con usuarios
  private baseUrl = `${environment.apiUrl}/catalog/users`;

  constructor(private http: HttpClient) {}

  //* Método para registrar un nuevo usuario
  //* Retorna un Observable con la respuesta del servidor
  register(user: User): Observable<{ id: number, email: string}> {
    return this.http.post<{ id: number, email: string}>(`${this.baseUrl}/register`, user);
  }
}
