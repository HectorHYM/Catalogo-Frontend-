import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralResponse } from '@core/interfaces/generalResponse';
import { Product } from '@core/models/product';
import { environment } from '@environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}
  private baseUrl = `${environment.apiUrl}/products`;

  //^ API Methods
  //* Método para obtener todos los productos
  getAllProducts(): Promise<GeneralResponse<Product>>{
    return lastValueFrom(this.http.get<GeneralResponse<Product>>(`${this.baseUrl}/get-products`));
  }
}
