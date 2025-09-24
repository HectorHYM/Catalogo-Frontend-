import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { GeneralResponse } from '@core/interfaces/generalResponse';
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

    await this.userSvc.login(body).then((res: GeneralResponse<string>) => {
        console.log('Respuesta del servidor: ', res);
        this.snackBarService.openSuccessSnackBack(res.msg);

        this.form.reset();
        this.router.navigate(['/init']);
    }, (error) => {
        const res = error.error as GeneralResponse<string>;
        console.error('Error en la petición: ', res);
        this.snackBarService.openErrorSnackBack(res.msg || 'Error al iniciar sesión. Inténtelo más tarde.');
    });

    return true;
  }
}
