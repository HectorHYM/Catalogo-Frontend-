import { Component, Input } from '@angular/core';
import { Product } from '@core/models/product';
import { SHARED_IMPORTS } from '@shared/shared-imports';

@Component({
  selector: 'app-product-card',
  imports: [...SHARED_IMPORTS],
  standalone: true,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product!: Product;
}
