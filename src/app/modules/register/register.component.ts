import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { UserService } from '@core/services/user.service';
import { GeneralResponse } from '@core/interfaces/generalResponse';
import { SnackbarService } from '@core/services/snackbar.service';
import { Router } from '@angular/router';
import { getControlErrors } from '@core/utils/input-errors-validator';

type ErrMsgMapper = string | ((err: any) => string); //? Solo puede ser string una función que retorne string

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  form : FormGroup;
  submitting : boolean = false;
  successMsg : string = '';
  errorMsg : string = '';
  role : string = 'client';
  isActive : boolean = false;

  constructor(fb : FormBuilder, private userSvc : UserService, private snackBarService : SnackbarService, private router : Router){
    this.form = fb.group({
      name: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(50)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^\S+$/)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(7), Validators.maxLength(50)]]
    });
  }

  //? Mapa de errores específicos para los controles del formulario
  private CONTROL_NAME_ERRORS_MAP: Record<string, ErrMsgMapper> = {
    required: 'El nombre es obligatorio.',
    minlength: (err) => `El nombre debe llevar al menos ${err.requiredLength} caracteres.`,
    maxlength: (err) => `La nombre debe llevar como máximo ${err.requiredLength} caracteres.`,
  }

  private CONTROL_USERNAME_ERRORS_MAP: Record<string, ErrMsgMapper> = {
    required: 'El nombre de usuario es obligatorio.',
    minlength: (err) => `El nombre de usuario debe llevar al menos ${err.requiredLength} caracteres.`,
    maxlength: (err) => `La nombre de usuario debe llevar como máximo ${err.requiredLength} caracteres.`,
    pattern: 'El nombre de usuario no debe llevar espacios.',
  }

  private CONTROL_EMAIL_ERRORS_MAP: Record<string, ErrMsgMapper> = {
    required: 'El correo es obligatorio.',
    email: 'El correo debe tener un formato válido.',
    minlength: (err) => `El correo debe llevar al menos ${err.requiredLength} caracteres.`,
    maxlength: (err) => `El correo debe llevar como máximo ${err.requiredLength} caracteres.`,
  }

  //* Muestra de diversos error dinámicos para el formulario
  //? user control
  public getNameErrors() : string[]{
    return getControlErrors(this.form, 'name', this.CONTROL_NAME_ERRORS_MAP);
  }
  //? username control
  public getUsernameErrors() : string[]{
    return getControlErrors(this.form, 'username', this.CONTROL_USERNAME_ERRORS_MAP);
  }
  //? email control
  public getEmailErrors() : string[]{
    return getControlErrors(this.form, 'email', this.CONTROL_EMAIL_ERRORS_MAP);
  }

  get name() { return this.form.get('name')!; }
  get username() { return this.form.get('username')!; }
  get email() { return this.form.get('email')!; }

  async onSubmit() : Promise<boolean> {

    this.submitting = true;
    this.form.markAllAsTouched(); //? Marca todos los controles como tocados para mostrar errores
    if(this.form.invalid){ 
      console.error("Formulario inválido");

      //* Se recorren todos los controles del FormGroup para obtener sus errores
      Object.entries(this.form.controls).forEach(([name, control]) => {
        if(control.invalid){
          console.group(`Control inválido: ${name}`);
          console.error('Valor actual: ', control.value);
          console.error('Errores: ', control.errors);
          console.groupEnd();
        }
      });

      //* Comprobando errores a nivel de formulario
      if(this.form.errors){
        //^LOG
        console.group('Errores a nivel de formulario');
        console.error('Errores: ', this.form.errors);
        console.groupEnd();
      }
      
      this.submitting = false;
      return false;
    };

    this.successMsg = this.errorMsg = '';

    const payload = this.form.value;
    //? Se añade el rol al payload
    const body = {
      ...payload,
      role: this.role,
      isActive: this.isActive
    }

    //^LOG
    console.log("Enviando datos de registro:", body);

    //? Cambio de Observable a Promise para manejar mejor los errores
    await this.userSvc.register(body).then((res: GeneralResponse) => {
        this.successMsg = `Usuario registrado exitosamente con correo, correo enviado a ${res.data.email}`;
        this.snackBarService.openSuccessSnackBack(this.successMsg);
        console.log(this.successMsg);
        this.form.reset();
        this.router.navigate(['/']);
    }, (error) => {
        const res = error.error as GeneralResponse;
        this.errorMsg = res.msg || "Error al registrar el usuario, intentelo más tarde.";
        this.snackBarService.openErrorSnackBack(this.errorMsg);
        console.error(this.errorMsg);
        this.router.navigate(['/']);
    });

    this.submitting = false;

    return true;
  }
}