import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GeneralResponse } from '@core/interfaces/generalResponse';
import { UserService } from '@core/services/user.service';
import { SnackbarService } from '@core/services/snackbar.service';
import { Activate } from '@core/models/activate';
import { getControlErrors, patternValidator } from '@core/utils/input-errors-validator';

type ErrMsgMapper = string | ((err: any) => string); //? Solo puede ser string una función que retorne string

@Component({
  selector: 'app-password',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent implements OnInit{
  form : FormGroup;
  submitting : boolean = false;
  stringMsg : string | null = '';
  errorMsg : string = '';
  token : string | null = null;
  flow: 'set' | 'recover' | null = null;

  constructor(fb : FormBuilder, private userSvc : UserService, private router : Router, private snackBarService : SnackbarService){
    this.form = fb.group({
      password: ['', [Validators.required, Validators.minLength(8), this.hasLowerCase(), this.hasUpperCase(), this.hasSpecialChar(), this.hasNumber()]],
      repeat_password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).+$/)]]
    }, { validators: this.passwordMatchValidator });

    //~  this.form = FormBuilder.group({Campo1: [''. [Validadores de control]]}, {Validadores de formulario: []?}?);
  }

  //? Mapa de errores específicos para los controles del formulario
  private CONTROL_ERRORS_MAP: Record<string, ErrMsgMapper> = {
    required: 'La contraseña es obligatoria.',
    minlength: (err) => `La contraseña debe llevar al menos ${err.requiredLength} caracteres.`,
    lowercase: 'La contraseña debe llevar una minuscula.',
    uppercase: 'La contraseña debe llevar una mayuscula.',
    special: 'La contraseña debe llevar un caracter especial.',
    number: 'La contraseña debe de llevar un número.',
  }

  //* Obtención de errores específicos para cada control
  public getPasswordErrors() : string[]{
    return getControlErrors(this.form ,'password', this.CONTROL_ERRORS_MAP);
  }

  public getRepeatPasswordErrors() : string[]{
    const errors : string[] = [];
    const control = this.form.get('repeat_password');
    const comparativeControl = this.form.get('password');

    if(control?.value !== comparativeControl?.value){
      errors.push('Las contraseñas deben coincidir');
    }
    
    return errors;
  }

  //* Validadores de patron para la contraseña
  public hasLowerCase() : ValidatorFn{
    return patternValidator('lowercase', /[a-z]/);
  }

  public hasUpperCase() : ValidatorFn{
    return patternValidator('uppercase', /[A-Z]/);
  }

  public hasSpecialChar() : ValidatorFn{
    return patternValidator('special', /[^a-zA-Z0-9]/);
  }

  public hasNumber() : ValidatorFn{
    return patternValidator('number', /[0-9]/);
  }

  get password() { return this.form.get('password')!; }
  get repeat_password() { return this.form.get('repeat_password')!; }

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    this.token = urlParams.get('token');
    this.flow = urlParams.get('flow') as 'set' | 'recover' | null;
  }

  //* Método para validar que las contraseñas coincidan
  private passwordMatchValidator(form: AbstractControl){
    const pwd = form.get('password')?.value;
    const confirmPwd = form.get('repeat_password')?.value;
    return pwd == confirmPwd ? null : { passwordMisMatch: true};
  }

  async onSubmit() : Promise<Boolean>{
    this.submitting = true;
    this.stringMsg = this.errorMsg = '';
    const token = this.token;
    const password = this.form.value.password;

    if(this.form.invalid){
      console.error("Formulario inválido");
      this.form.markAllAsTouched(); //? Marca todos los controles como tocados para mostrar errores

      //* Se recorren todos los controles del FormGroup para obtener sus errores
      Object.entries(this.form.controls).forEach(([name, control]) => {
        if(control.invalid){
          console.group(`Control inválido: ${name}`);
          console.error('Valor actual: ', control.value);
          console.error('Errores: ', control.errors);
          console.groupEnd();
        }
      });

      //* Comprobando errores a nivel de formulario (password mismatch)
      if(this.form.errors){
        //^LOG
        console.group('Errores a nivel de formulario');
        console.error('Errores: ', this.form.errors);
        console.groupEnd();
      }

      this.submitting = false;
      return false;
    }

    const body : Activate = {
      token: token,
      password: password
    }

    //^LOG
    // console.log("Enviando datos de registro:", body);

    //? Cambio de Observable a Promise para manejar mejor los errores
    await this.userSvc.activate(body).then((res: GeneralResponse) => {
        this.stringMsg = res.msg;

        this.snackBarService.openSuccessSnackBack(this.stringMsg);

        //^ LOG
        console.log(res);

        //* Se limpia el token de la URL para evitar leaks
        const url = window.location.pathname;
        window.history.replaceState({}, document.title, url);

        this.form.reset();
        //* Se redirige a home para el inicio de sesión
        this.router.navigate(['/']);

    }, (error) => {
        const res = error.error as GeneralResponse<string>;
        this.errorMsg = res.msg || "Error al establecer contraseña y activar cuenta de usuario. Intentelo más tarde.";
        this.snackBarService.openErrorSnackBack(this.errorMsg);

        console.error(this.errorMsg);
    });

    return true;
  }
}
