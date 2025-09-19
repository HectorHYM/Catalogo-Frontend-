import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom} from 'rxjs';
import { environment } from '@environments/environment';
import { User } from '@core/models/user';
import { Activate } from '@core/models/activate';
import { GeneralResponse } from '@core/interfaces/generalResponse';
import { Login } from '@core/models/login';
import { Recover } from '@core/models/recover';

@Injectable({ providedIn: 'root' })
export class UserService {
  //* URL base para todas las peticiones relacionadas con usuarios
  private baseUrl = `${environment.apiUrl}/users`;
  //^ Almacenamiento de token temporal antes de añadir el refresh token
  private token: string | null = null;
  //^ Almacenamiento del usuario actual en un BehaviorSubject para reactividad
  private _currentUser = new BehaviorSubject<User | null>(null);
  public currentUser$ = this._currentUser.asObservable();

  setToken(token: string){
    this.token = token;
  }

  getToken() : string | null{
    return this.token;
  }
  
  clearToken(){
    this.token = null;
  }

  clearCurrentUser(){
    this._currentUser.next(null);
  }

  constructor(private http: HttpClient) {}

  //* Método para registrar un nuevo usuario
  //* Retorna un Observable convertido a Promesa con la respuesta del servidor
  register(user: User): Promise<GeneralResponse<User>> {
    return lastValueFrom(this.http.post<GeneralResponse<User>>(`${this.baseUrl}/register`, user));
  }

  //*Método para activar una cuenta de usuario estableciendo contraseña
  activate(activate: Activate): Promise<GeneralResponse<string>>{
    return lastValueFrom(this.http.post<GeneralResponse<string>>(`${this.baseUrl}/activate`, activate));
  }

  //* Metodo para iniciar sesión
  login(login: Login): Promise<GeneralResponse<string>>{
    return lastValueFrom(this.http.post<GeneralResponse<string>>(`${this.baseUrl}/login`, login)).then(res => {
      if(res.data){
        this.setToken(res.data);
      }
      return res;
    });
  }

  //* Método para recuperar contraseña
  recoverPassword(recover: Recover): Promise<GeneralResponse<string>>{
    return lastValueFrom(this.http.post<GeneralResponse<string>>(`${this.baseUrl}/recover-password`, recover));
  }

  //* Método para cargar el usuario actual basado en el token almacenado
  loadCurrentUser(): Promise<GeneralResponse<User>>{
    return lastValueFrom(this.http.get<GeneralResponse<User>>(`${this.baseUrl}/get-user`)).then(res => {
      if(res.data){
        this._currentUser.next(res.data);
      }
      return res;
    });
  }
}