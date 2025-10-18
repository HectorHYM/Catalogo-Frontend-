import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralResponse } from '@core/interfaces/generalResponse';
import { Product } from '@core/models/product';
import { environment } from '@environments/environment';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}
  private baseUrl = `${environment.apiUrl}/products`;

  //^ API Methods
  //* Método para obtener todos los productos
  getAllProducts(): Observable<GeneralResponse<Product[]>>{
    return this.http.get<GeneralResponse<Product[]>>(`${this.baseUrl}/get-products`);
  }
}
