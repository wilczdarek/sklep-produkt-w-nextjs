'use client'

import { useOrders } from '@/contexts/OrderContext'
import { useProducts } from '@/contexts/ProductContext'
import OrderList from '@/components/OrderList'
import Link from 'next/link'
import { Order } from '@/types'

/**
 * Komponent strony zamówień
 */
export default function OrdersPage() {
  // Pobierz funkcje i dane z kontekstów
  const { orders, updateOrderStatus, refreshOrders } = useOrders()
  const { unreserveProducts, completeOrder } = useProducts()

  /**
   * Funkcja obsługująca zmianę statusu zamówienia
   * @param orderId - ID zamówienia
   * @param newStatus - Nowy status zamówienia
   */
  const handleOrderStatusChange = (orderId: number, newStatus: Order['status']) => {
    // Znajdź zamówienie do aktualizacji
    const orderToUpdate = orders.find(order => order.id === orderId)
    if (!orderToUpdate) return

    // Obsłuż różne przypadki zmiany statusu
    if (newStatus === 'cancelled' && orderToUpdate.status !== 'cancelled') {
      // Przywróć produkty na stan przy anulowaniu zamówienia
      unreserveProducts(orderToUpdate.items)
    } else if (newStatus === 'completed' && orderToUpdate.status !== 'completed') {
      // Zeruj rezerwację przy realizacji zamówienia
      completeOrder(orderToUpdate.items)
    }

    // Aktualizuj status zamówienia
    updateOrderStatus(orderId, newStatus)
  }

  return (
    <div className="container mx-auto p-4">
      {/* Nagłówek strony */}
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-4">
          {/* Link do listy produktów */}
          <Link
            href="/"
            className="text-2xl font-bold text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600"
          >
            Lista produktów
          </Link>
          {/* Link do aktywnej strony zamówień */}
          <Link
            href="/zamowienia"
            className="text-2xl font-bold text-blue-600 border-b-2 border-blue-600"
          >
            Lista zamówień
          </Link>
        </div>
        {/* Przycisk odświeżania listy */}
        <button
          onClick={refreshOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Odśwież
        </button>
      </div>
      
      {/* Lista zamówień lub komunikat o braku zamówień */}
      {orders.length > 0 ? (
        <OrderList 
          orders={orders} 
          onStatusChange={handleOrderStatusChange}
        />
      ) : (
        <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
          Brak zamówień
        </div>
      )}
    </div>
  )
}