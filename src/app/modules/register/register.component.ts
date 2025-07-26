import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

//& COMMIT
export class RegisterComponent {
  form : FormGroup;
  submitting : boolean = false;
  successMsg : string = '';
  errorMsg : string = '';
  role : string = 'client';

  constructor(fb : FormBuilder, private userSvc : UserService){
    this.form = fb.group({
      name: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(50)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(7), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: [this.passwordMatchValidator]
    });
  }

  //* Método para validar que las contraseñas coincidan
  private passwordMatchValidator(form: AbstractControl){
    const pwd = form.get('password')?.value;
    const confirmPwd = form.get('confirmPassword')?.value;
    return pwd == confirmPwd ? null : { passwordMisMatch: true};
  }

  onSubmit() : void{
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

      //* Comprobando errores a nivel de formulario (password mismatch)
      if(this.form.errors){
        console.group('Errores a nivel de formulario');
        console.error('Errores: ', this.form.errors);
        //^LOG
        console.error('Valor de password: ', this.form.get('password')?.value);
        console.error('Valor de confirmPassword: ', this.form.get('confirmPassword')?.value);
        console.groupEnd();
      }

      return
    };

    this.submitting = true;
    this.successMsg = this.errorMsg = '';

    const {confirmPassword, ...payload} = this.form.value;
    //? Se añade el rol al payload
    const body = {
      ...payload,
      role: this.role
    }

    //^LOG
    console.log("Enviando datos de registro:", body);

    this.userSvc.register(body).subscribe({
      next: res => {
        this.successMsg = `Usuario registrado exitosamente con correo: ${res.email}`;
        console.log(this.successMsg);
        this.form.reset();
      },
      error: err => {
        this.errorMsg = err.error?.error || "Error al registrar el usuario";
        console.error(this.errorMsg);
      },
      complete: () => {
        this.submitting = false;
      }
    });
  }
}