/**
 * Interfejs reprezentujący produkt w systemie
 */
export interface Product {
  id: number;
  name: string;
  quantity: number;
  reserved: number;
}

/**
 * Interfejs reprezentujący przedmiot w zamówieniu
 */
export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
}

/**
 * Interfejs reprezentujący zamówienie
 */
export interface Order {
  id: number;
  items: CartItem[];
  status: 'new' | 'accepted' | 'completed';
  createdAt: Date;
}