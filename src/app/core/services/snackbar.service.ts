import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar : MatSnackBar) {}

  public openSuccessSnackBack(msg : string) : void{
    this.snackBar.open(msg, undefined, {
        duration: 5000,
        panelClass: ['inter-medium', 'success-snackbar']
    });
  }

  public openErrorSnackBack(msg : string) : void{
    this.snackBar.open(msg, undefined, {
        duration: 5000,
        panelClass: ['inter-medium', 'error-snackbar']
    });
  }
}
