import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appRole]'
})
export class RoleDirective implements OnInit, OnDestroy{
  private role: string = '';
  //? Input para asignar el rol requerido
  @Input('appRole') set hasRole(value: string){
    this.role = (value || '').trim();
    this.updateView();
  }

  constructor(private vcr: ViewContainerRef, private tpl: TemplateRef<any>, private userSvc: UserService){}

  private destroy$ = new Subject<void>();
  
  ngOnInit(): void {
    this.userSvc.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateView());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void{
    //* Se limpia la vista
    this.vcr.clear();
    //* Si no existe un rol, no se muestra nada
    if(this.role == '') return;

    //* Se obtiene el usuario actual
    const currentUser = this.userSvc.getCurrentUser();
    if(!currentUser) return;
    if(currentUser.role !== this.role) return;

    //* Si el usuario tiene el rol requerido, se muestra la plantilla
    this.vcr.createEmbeddedView(this.tpl);
  }

}
