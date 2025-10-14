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

  constructor(private http: HttpClient) {
    //* Se inicializa el token desde el almacenamiento local si existe
    const tokenStored = localStorage.getItem('token');
    if(tokenStored) this.token = tokenStored;
  }

  //^ Helpers token
  setToken(token: string){
    this.token = token;
    localStorage.setItem('token', token);
  }

  getToken() : string | null{
    return this.token;
  }
  
  clearToken(){
    this.token = null;
    localStorage.removeItem('token');
  }

  //^ Helpers usuario actual
  getCurrentUser(): User | null{
    return this._currentUser.value;
  }

  //? Alias sincrónico
  public getCurrentUserValue(): User | null{
    return this._currentUser.value;
  }

  setCurrentUser(user: User){
    this._currentUser.next(user);
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }

  clearCurrentUser(){
    this._currentUser.next(null);
    localStorage.removeItem('user');
  }

  //^ API Methods
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
        this.setCurrentUser(res.data);
      }
      return res;
    }).catch(err => {
      this.clearToken();
      this.clearCurrentUser();
      throw err;
    });
  }

  //^ Util Methods
  //? Método util para guards el cual asegura que, si existe token, se cargue el usuario actual.
  //? Retorna una promesa.
  ensureCurrentUserLoaded(): Promise<User | null>{
    if(this._currentUser.value){
      return Promise.resolve(this._currentUser.value);
    }
    const token = this.getToken();
    if (!token) return Promise.resolve(null);
    
    //* Si hay token, se intenta cargar el usuario actual
    return this.loadCurrentUser().then(res => res.data || null).catch(() => null);
  }
}