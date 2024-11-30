'use client'

import { useState, useEffect } from 'react'
import OrderList from '@/components/OrderList'
import { Order, Product } from '@/types'

/**
 * Komponent strony zamówień
 * Wyświetla listę wszystkich złożonych zamówień i umożliwia zmianę ich statusu
 */
export default function OrdersPage() {
  // Stan przechowujący listę wszystkich zamówień
  const [orders, setOrders] = useState<Order[]>([])

  // Wczytaj zamówienia z localStorage przy pierwszym renderowaniu
  useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('orders')
      if (savedOrders) {
        // Parsowanie zapisanych zamówień
        const parsedOrders = JSON.parse(savedOrders)
        // Konwersja stringów dat na obiekty Date
        const ordersWithDates = parsedOrders.map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt)
        }))
        // Sortowanie zamówień od najnowszych
        const sortedOrders = ordersWithDates.sort((a: Order, b: Order) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        )
        setOrders(sortedOrders)
      }
    } catch (error) {
      console.error('Błąd podczas wczytywania zamówień:', error)
      setOrders([])
    }
  }, [])

  /**
   * Aktualizuje status zamówienia i stan produktów
   * @param orderId - ID zamówienia do aktualizacji
   * @param newStatus - Nowy status zamówienia
   */
  const handleStatusChange = (orderId: number, newStatus: Order['status']) => {
    setOrders(currentOrders => {
      const updatedOrders = currentOrders.map(order => {
        if (order.id !== orderId) return order

        // Jeśli zamówienie jest realizowane, zaktualizuj stany produktów
        if (newStatus === 'completed' && order.status !== 'completed') {
          try {
            // Wczytaj aktualne produkty
            const savedProducts = localStorage.getItem('products')
            if (savedProducts) {
              const products = JSON.parse(savedProducts)
              // Aktualizuj stany produktów - zeruj rezerwacje
              const updatedProducts = products.map((product: Product) => {
                const orderItem = order.items.find(item => item.productId === product.id)
                if (!orderItem) return product

                return {
                  ...product,
                  reserved: Math.max(0, product.reserved - orderItem.quantity) // Zmniejsz rezerwację (nie mniej niż 0)
                }
              })
              // Zapisz zaktualizowane produkty
              localStorage.setItem('products', JSON.stringify(updatedProducts))
            }
          } catch (error) {
            console.error('Błąd podczas aktualizacji produktów:', error)
          }
        }

        // Zwróć zamówienie z nowym statusem
        return { ...order, status: newStatus }
      })

      // Zapisz zaktualizowane zamówienia
      try {
        localStorage.setItem('orders', JSON.stringify(updatedOrders))
      } catch (error) {
        console.error('Błąd podczas zapisywania zamówień:', error)
      }

      return updatedOrders
    })
  }

  return (
    <div className="container mx-auto p-4">
      {/* Nagłówek strony */}
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Lista zamówień</h1>
      
      {/* Wyświetlanie listy zamówień lub informacji o braku zamówień */}
      {orders.length > 0 ? (
        <OrderList 
          orders={orders} 
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
          Brak zamówień
        </div>
      )}
    </div>
  )
}