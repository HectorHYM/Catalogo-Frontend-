import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Login } from '@core/models/login';
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
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  //? Mapa de errores específicos para los controles del formulario
  private CONTROL_ERRORS_MAP: Record<string, ErrMsgMapper> = {
    required: 'El correo es obligatorio.',
    email: 'El correo debe tener un formato válido.',
  }

  private PASSWORD_ERRORS_MAP: Record<string, ErrMsgMapper> = {
    required: 'La contraseña es obligatoria.',
    minlength: (err) => `La contraseña debe tener al menos ${err.requiredLength} caracteres.`
  }

  public getEmailErrors() : string[]{
    return getControlErrors(this.form, 'email', this.CONTROL_ERRORS_MAP);
  }

  public getPasswordErrors() : string[]{
    return getControlErrors(this.form, 'password', this.PASSWORD_ERRORS_MAP);
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

      //^LOG
      /*Object.entries(this.form.controls).forEach(([name, control]) => {
        if(control.invalid){
          console.group(`Control inválido: ${name}`);
          console.error('Valor actual: ', control.value);
          console.error('Errores: ', control.errors);
          console.groupEnd();
        }
      });*/
      //^LOG
      /*if(this.form.errors){
        console.group('Errores a nivel de formulario');
        console.error('Errores: ', this.form.errors);
        console.groupEnd();
      }*/

      this.submitting = false;
      return false;
    }

    try{
      //* 1) Se hace el login a la vez que el token se guarda en el servicio de usuario
      const currentUser = await this.userSvc.login(body);
      //^LOG
      //console.log('Respuesta del servidor al hacer login: ', currentUser);
      if(!currentUser || !currentUser.data){
        this.snackBarService.openErrorSnackBack(currentUser.msg || 'Cuenta no activa. Por favor establezca su contraseña.');
        return false;
      }
      
      const userData = await this.userSvc.loadCurrentUser();
      //^LOG
      //console.log('Respuesta del servidor al cargar el usuario: ', userData);
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
    }catch(error: any){
      console.error('Error en petición de login o al cargar el usuario: ', error);
      const serverMsg = error?.error?.msg || 'Error al iniciar sesión. Inténtelo más tarde.';
      this.snackBarService.openErrorSnackBack(serverMsg);
      return false;
    }finally{
      this.submitting = false;
    }

    return true;
  }
}
