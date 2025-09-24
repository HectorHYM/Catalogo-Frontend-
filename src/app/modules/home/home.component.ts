import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GeneralResponse } from '@core/interfaces/generalResponse';
import { Login } from '@core/models/login';
import { User } from '@core/models/user';
import { SnackbarService } from '@core/services/snackbar.service';
import { UserService } from '@core/services/user.service';
import { getControlErrors } from '@core/utils/input-errors-validator';

type ErrMsgMapper = string | ((err: any) => string); //? Solo puede ser string una función que retorne string

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  form : FormGroup;
  submitting : boolean = false;

  constructor(fb : FormBuilder, private userSvc : UserService, private snackBarService : SnackbarService, private router : Router){
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  //? Mapa de errores específicos para los controles del formulario
  private CONTROL_ERRORS_MAP: Record<string, ErrMsgMapper> = {
    required: 'El correo es obligatorio.',
    email: 'El correo debe tener un formato válido.'
  }

  public getEmailErrors() : string[]{
    return getControlErrors(this.form, 'email', this.CONTROL_ERRORS_MAP);
  }

  get email() { return this.form.get('email')!; };
  get password() { return this.form.get('password')!; };

  async onSubmit() : Promise<boolean>{
    this.submitting = true;
    const email = this.form.value.email;
    const password = this.form.value.password;

    const body : Login = {
      email: email,
      password: password
    }

    if(this.form.invalid){
      this.form.markAllAsTouched();

      Object.entries(this.form.controls).forEach(([name, control]) => {
        if(control.invalid){
          console.group(`Control inválido: ${name}`);
          console.error('Valor actual: ', control.value);
          console.error('Errores: ', control.errors);
          console.groupEnd();
        }
      });

      if(this.form.errors){
        //^LOG
        console.group('Errores a nivel de formulario');
        console.error('Errores: ', this.form.errors);
        console.groupEnd();
      }

      return false;
    }

    try{
      //* 1) Se hace el login a la vez que el token se guarda en el servicio de usuario
      const currentUser = await this.userSvc.login(body);
      console.log('Respuesta del servidor al hacer login: ', currentUser);
      if(!currentUser || !currentUser.data){
        this.snackBarService.openErrorSnackBack(currentUser.msg || 'Error al iniciar sesión. Inténtelo más tarde.');
        return false;
      }
      
      const userData = await this.userSvc.loadCurrentUser();
      console.log('Respuesta del servidor al cargar el usuario: ', userData);
      if(!userData || !userData.data){
        this.snackBarService.openErrorSnackBack(userData.msg || 'Error al obtener sus datos. Inténtelo más tarde.');
        return false;
      }

      this.form.reset();
      this.snackBarService.openSuccessSnackBack(currentUser.msg || 'Sesión iniciada correctamente.');
      if(userData.data.role === 'client'){
        this.router.navigate(['/']);
      }else if(userData.data.role === 'admin'){
        this.router.navigate(['/users/register']);
      }else{
        this.router.navigate(['/']);
      }
    }catch(error){
      console.error('Error en petición de login o al cargar el usuario: ', error);
      this.snackBarService.openErrorSnackBack('Error al iniciar sesión. Inténtelo más tarde.');
      return false;
    }

    return true;
  }
}
