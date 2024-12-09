'use client'

import { useOrders } from '@/contexts/OrderContext'
import { useProducts } from '@/contexts/ProductContext'
import OrderList from '@/components/OrderList'
import { Order } from '@/types'
import PageHeader from '@/components/PageHeader'
import { useRouter } from 'next/navigation'

export default function OrdersPage() {
  const { orders, updateOrderStatus, refreshOrders } = useOrders()
  const { unreserveProducts, completeOrder } = useProducts()
  const router = useRouter()

  const handleOrderStatusChange = (orderId: number, newStatus: Order['status']) => {
    const orderToUpdate = orders.find(order => order.id === orderId)
    if (!orderToUpdate) return

    if (newStatus === 'cancelled' && orderToUpdate.status !== 'cancelled') {
      unreserveProducts(orderToUpdate.items)
    } else if (newStatus === 'completed' && orderToUpdate.status !== 'completed') {
      completeOrder(orderToUpdate.items)
    }

    updateOrderStatus(orderId, newStatus)
  }

  const handleEditOrder = (order: Order) => {
    // Przekierowanie do strony głównej z danymi zamówienia do edycji
    router.push(`/?editOrder=${order.id}`)
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
      
      {orders.length > 0 ? (
        <OrderList 
          orders={orders} 
          onStatusChange={handleOrderStatusChange}
          onEditOrder={handleEditOrder}
        />
      ) : (
        <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
          Brak zamówień
        </div>
      )}
    </div>
  );
}