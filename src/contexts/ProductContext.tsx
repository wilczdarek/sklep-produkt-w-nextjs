'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product } from '@/types'
import { initialProducts } from '@/data/products'

/**
 * Interfejs definiujący metody dostępne w kontekście produktów
 */
interface ProductContextType {
  products: Product[]
  updateProducts: (products: Product[]) => void
  reserveProducts: (items: { productId: number; quantity: number }[]) => void
  unreserveProducts: (items: { productId: number; quantity: number }[]) => void
  completeOrder: (items: { productId: number; quantity: number }[]) => void
  refreshProducts: () => void
}

// Utworzenie kontekstu
const ProductContext = createContext<ProductContextType | undefined>(undefined)

/**
 * Provider kontekstu produktów
 */
export function ProductProvider({ children }: { children: ReactNode }) {
  // Stan produktów z wartościami początkowymi
  const [products, setProducts] = useState<Product[]>(initialProducts)

  /**
   * Funkcja wczytująca produkty z localStorage
   */
  const loadProducts = () => {
    try {
      const savedProducts = localStorage.getItem('products')
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts)
        if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
          setProducts(parsedProducts)
        }
      }
    } catch (error) {
      console.error('Błąd podczas wczytywania produktów:', error)
    }
  }

  // Wczytaj produkty przy pierwszym renderowaniu
  useEffect(() => {
    loadProducts()
  }, [])

  // Zapisuj zmiany w localStorage
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products))
  }, [products])

  /**
   * Funkcja aktualizująca listę produktów
   */
  const updateProducts = (newProducts: Product[]) => {
    setProducts(newProducts)
  }

  /**
   * Funkcja rezerwująca produkty przy składaniu zamówienia
   */
  const reserveProducts = (items: { productId: number; quantity: number }[]) => {
    setProducts(currentProducts => {
      const updatedProducts = currentProducts.map(product => {
        const item = items.find(i => i.productId === product.id)
        if (item) {
          return {
            ...product,
            quantity: product.quantity - item.quantity,
            reserved: (product.reserved || 0) + item.quantity
          }
        }
        return product
      })
      return updatedProducts
    })
  }

  /**
   * Funkcja przywracająca produkty na stan przy anulowaniu zamówienia
   */
  const unreserveProducts = (items: { productId: number; quantity: number }[]) => {
    setProducts(currentProducts => {
      const updatedProducts = currentProducts.map(product => {
        const item = items.find(i => i.productId === product.id)
        if (item) {
          return {
            ...product,
            quantity: product.quantity + item.quantity,
            reserved: Math.max(0, (product.reserved || 0) - item.quantity)
          }
        }
        return product
      })
      return updatedProducts
    })
  }

  /**
   * Funkcja zerująca rezerwację przy realizacji zamówienia
   */
  const completeOrder = (items: { productId: number; quantity: number }[]) => {
    setProducts(currentProducts => {
      const updatedProducts = currentProducts.map(product => {
        const item = items.find(i => i.productId === product.id)
        if (item) {
          return {
            ...product,
            reserved: Math.max(0, (product.reserved || 0) - item.quantity)
          }
        }
        return product
      })
      return updatedProducts
    })
  }

  return (
    <ProductContext.Provider value={{ 
      products, 
      updateProducts, 
      reserveProducts, 
      unreserveProducts,
      completeOrder,
      refreshProducts: loadProducts 
    }}>
      {children}
    </ProductContext.Provider>
  )
}

/**
 * Hook do używania kontekstu produktów
 */
export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider')
  }
  return context
}