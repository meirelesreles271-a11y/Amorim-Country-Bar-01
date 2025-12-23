export enum Role {
  WAITER = 'WAITER',
  KITCHEN = 'KITCHEN',
  CASHIER = 'CASHIER',
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  NONE = 'NONE'
}

export enum ProductCategory {
  DRINKS = 'Bebidas',
  PORTIONS = 'Porções',
  DISHES = 'Pratos',
  DESSERTS = 'Sobremesas'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  imageUrl?: string;
  available: boolean;
}

export enum OrderItemStatus {
  PENDING = 'PENDING',     // Waiting to be sent to kitchen
  PREPARING = 'PREPARING', // In Kitchen
  READY = 'READY',         // Ready for pickup
  DELIVERED = 'DELIVERED'  // On table
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  observation?: string;
  price: number;
  status: OrderItemStatus;
  timestamp: number;
}

export interface Table {
  id: number;
  status: 'available' | 'occupied' | 'closing';
  total: number;
  items: OrderItem[];
  openTime?: number;
}

export interface SalesReport {
  date: string;
  totalSales: number;
  paymentMethod: 'CASH' | 'CARD' | 'PIX';
}

export interface AppState {
  userRole: Role;
  tables: Table[];
  products: Product[];
  sales: SalesReport[];
}
