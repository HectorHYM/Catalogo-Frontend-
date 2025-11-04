import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private visibleSubject : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); //? Estado inicial no visible
  readonly visible$ : Observable<boolean> = this.visibleSubject.asObservable(); //? Observable para que otros componentes se suscriban

  private requestCount : number = 0; //? Contador de solicitudes activas
  private showTimeOut : any; //? Timeout para mostrar el loader
  private shownAt : number = 0; //? Marca de tiempo cuando el loader se mostró
  private readonly delayMs : number = 100; //? Retardo antes de mostrar el loader y evitar flicker (en ms)
  private readonly minShowMs : number = 300; //? Tiempo mínimo que el loader debe estar visible (en ms)

  constructor() { }

  public show() : void{
    this.requestCount++;
    //? Si es la primera solicitud, se inicia el delay para mostrar el loader
    if(this.requestCount === 1){
      if(this.showTimeOut) clearTimeout(this.showTimeOut); //? Se limpia cualquier timeout previo
      this.showTimeOut = setTimeout(() => {
        this.shownAt = Date.now();
        this.visibleSubject.next(true);
        this.showTimeOut = undefined;
      }, this.delayMs);
    }
  }

  public hide() : void{
    if(this.requestCount <= 0) return; //? No hay solicitudes activas
    this.requestCount--;

    if(this.requestCount === 0){
      //? Si aún no se ha mostrado el loader, se cancela el timeout
      if(this.showTimeOut){
        clearTimeout(this.showTimeOut);
        this.showTimeOut = undefined;
        return;
      }
    }

    //? Si esta visible, se asegura que sea visible el tiempo mínimo
    const elapsed = Date.now() - this.shownAt;
    const remaining = this.minShowMs - elapsed;
    if(remaining > 0){
      setTimeout(() => this.visibleSubject.next(false), remaining)
    }else{
      this.visibleSubject.next(false);
    }
  }
}
