import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { GeneralResponse } from '@core/interfaces/generalResponse';
import { Product } from '@core/models/product';
import { ProductService } from '@core/services/product.service';
import { ProductCardComponent } from '@shared/shared-components';
import { catchError, map, Observable, of, startWith } from 'rxjs';

type DashboardProps = { loading: boolean; data: Product[] | null; error: string | null; }

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ProductCardComponent],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  state$: Observable<DashboardProps>;
  constructor(private productSvc: ProductService) {
    this.state$ = this.productSvc.getAllProducts().pipe(
      map((res: GeneralResponse<Product[]>) => ({ loading: false, data: res.data, error: null} as DashboardProps)),
      startWith({ loading: true, data: null, error: null } as DashboardProps),
      catchError(() => of({ loading: false, data: null, error: 'Error al cargar los productos, por favor intente más tarde.' } as DashboardProps))
    );
  }
}
