import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '@core/services/product.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  constructor(private productSvc: ProductService) { }
  async ngOnInit(): Promise<void> {
    let products = (await this.productSvc.getAllProducts()).data;
    //^ log
    console.log('Productos cargados: ', products);
  }
}
