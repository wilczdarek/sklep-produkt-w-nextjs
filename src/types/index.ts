/**
 * Interfejs reprezentujący produkt w systemie
 */
export interface Product {
  id: number;
  name: string;
  quantity: number;
  reserved: number;
  image?: string;       // URL obrazka
  description?: string; // Szczegółowy opis
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
  items: {
    productId: number;
    productName: string;
    quantity: number;
  }[];
  status: 'new' | 'accepted' | 'completed' | 'cancelled';
  createdAt: Date;
  notes?: string; // Dodajemy pole notes
}