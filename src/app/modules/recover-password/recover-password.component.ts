import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GeneralResponse } from '@core/interfaces/generalResponse';
import { Recover } from '@core/models/recover';
import { SnackbarService } from '@core/services/snackbar.service';
import { UserService } from '@core/services/user.service';
import { getControlErrors } from '@core/utils/input-errors-validator';
import { ActivatedRoute, Router } from '@angular/router';

type ErrMsgMapper = string | ((err: any) => string); //? Solo puede ser string una función que retorne string

@Component({
  selector: 'app-recover-password',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.css'
})
export class RecoverPasswordComponent implements OnInit{
  form : FormGroup;
  submitting : boolean = false;
  errorMsg : string = '';
  flow: 'set' | 'recover' = 'recover';

  constructor(fb: FormBuilder, private userSvc: UserService, private sbService: SnackbarService, private router: Router, private route: ActivatedRoute) { 
    this.form = fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get email() { return this.form.get('email')!; }

  private CONTROL_ERRORS_MAP: Record<string, ErrMsgMapper> = {
    required: 'El correo es obligatorio.',
    email: 'El correo debe tener un formato válido.'
  }

  public getEmailErrors() : string[]{
    return getControlErrors(this.form, 'email', this.CONTROL_ERRORS_MAP);
  } 

  ngOnInit(): void {
    this.flow = this.route.snapshot.data['flow'] || 'recover';
  }

  async onSubmit(): Promise<boolean>{
    this.submitting = true;
    const email = this.form.value.email;

    if(this.form.invalid){
      //^LOG
      //console.error("Formulario inválido");
      this.form.markAllAsTouched(); //? Marca todos los controles como tocados para mostrar errores

      //* Se recorren todos los controles del FormGroup para obtener sus errores
      //^LOG
      /*Object.entries(this.form.controls).forEach(([name, control]) => {
        if(control.invalid){
          console.group(`Control inválido: ${name}`);
          console.error('Valor actual: ', control.value);
          console.error('Errores: ', control.errors);
          console.groupEnd();
        }
      });*/

      this.submitting = false;
      return false;
    }

    const body: Recover = {
      email: email,
      tokenType: 'recover',
      flow: this.flow
    }

    await this.userSvc.recoverPassword(body).then((res: GeneralResponse<string>) => {
      //^LOG
      //console.log("Datos enviados:", body);
      this.sbService.openSuccessSnackBack(res.msg);
      this.form.reset();
      //* Se redirige a home para el inicio de sesión
      this.router.navigate(['/']);
    }, error => {
      const res = error.error as GeneralResponse;
      this.errorMsg = res.msg || 'Error en el servidor. Inténtelo más tarde.';
      this.sbService.openErrorSnackBack(this.errorMsg);
    });

    this.submitting = false;
    return true;
  }
}
