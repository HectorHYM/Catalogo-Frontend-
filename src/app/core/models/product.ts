export interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    imgUrl?: string;
    isActive: boolean;
}