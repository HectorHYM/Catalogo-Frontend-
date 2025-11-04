import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

type ErrMsgMapper = string | ((err: any) => string); //? Solo puede ser string una función que retorne string

//? Manejador de error genérico para controles del formulariog
export function getControlErrors(form: FormGroup, controlName: string, map: Record<string, ErrMsgMapper>): string[]{
    const control = form.get(controlName);
    if(!control || !control.errors) return [];

    return Object.keys(control.errors).map(key => {
      const mapper = map[key]; //? Valor de la clave en el map dependiendo del error del control que llegue
      if(!mapper) return null; //? Si no existe la clave en el map, se retorna null
      const errValue = control.getError(key); //? Valor del error actual
      return typeof mapper === 'function' ? mapper(errValue) : mapper; //? Si el mapeo es una función, se ejecuta con el valor del error, si no, se retorna el string
    }).filter((m): m is string => !!m); //? Filtrado de nulos, se asegura que el array solo contenga strings
}

export function patternValidator(key: string, regex: RegExp): ValidatorFn{
    return (control : AbstractControl) : ValidationErrors | null => {
      return regex.test(control.value) ? null : { [key]: true };
    } 
}