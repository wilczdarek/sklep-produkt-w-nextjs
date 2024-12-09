'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Order, Product } from '@/types'

interface OrderContextType {
  orders: Order[]
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: number, newStatus: Order['status']) => void
  refreshOrders: () => void
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])

  const loadOrders = () => {
    try {
      const savedOrders = localStorage.getItem('orders')
      if (savedOrders) {
        const parsedOrders = JSON.parse(savedOrders)
        if (Array.isArray(parsedOrders)) {
          const ordersWithDates = parsedOrders.map(order => ({
            ...order,
            createdAt: new Date(order.createdAt)
          }))
          setOrders(ordersWithDates.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ))
        }
      }
    } catch (error) {
      console.error('Błąd podczas wczytywania zamówień:', error)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const addOrder = (newOrder: Order) => {
    setOrders(currentOrders => {
      let updatedOrders;
      
      if (currentOrders.some(order => order.id === newOrder.id)) {
        updatedOrders = currentOrders.map(order =>
          order.id === newOrder.id ? newOrder : order
        );
      } else {
        updatedOrders = [...currentOrders, newOrder];
      }
      
      updatedOrders.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return updatedOrders;
    });
  };

  const updateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    setOrders(currentOrders => {
      const updatedOrders = currentOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
      localStorage.setItem('orders', JSON.stringify(updatedOrders))
      return updatedOrders
    })
  }

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, refreshOrders: loadOrders }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
}