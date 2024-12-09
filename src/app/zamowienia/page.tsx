'use client'

import { useOrders } from '@/contexts/OrderContext'
import { useProducts } from '@/contexts/ProductContext'
import OrderList from '@/components/OrderList'
import Link from 'next/link'
import { Order } from '@/types'
import PageHeader from '@/components/PageHeader'
import Navigation from '@/components/Navigation'

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
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <PageHeader title="Zamówienia" />
        <button
          onClick={refreshOrders}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
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