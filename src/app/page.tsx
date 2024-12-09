'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProductList from '@/components/ProductList'
import Cart from '@/components/Cart'
import ProductForm from '@/components/ProductForm'
import { initialProducts } from '@/data/products'
import type { Product, Order } from '@/types'
import Link from 'next/link'
import { useOrders } from '@/contexts/OrderContext'
import { useProducts } from '@/contexts/ProductContext'
import PageHeader from '@/components/PageHeader'
import Navigation from '@/components/Navigation'
import { useSearchParams } from 'next/navigation'
import OrderEditModal from '@/components/OrderEditModal'

export default function HomePage() {
  const router = useRouter()
  const { products, reserveProducts, unreserveProducts, updateProducts } = useProducts()
  const { orders, addOrder } = useOrders()
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  
  const searchParams = useSearchParams()
  const editOrderId = searchParams.get('editOrder')

  // Załaduj zamówienie do edycji
  useEffect(() => {
    if (editOrderId) {
      const orderToEdit = orders.find(order => order.id === parseInt(editOrderId))
      if (orderToEdit && orderToEdit.status === 'new') {
        // Przekształć pozycje zamówienia na pozycje koszyka
        const cartItemsFromOrder = orderToEdit.items.map(item => ({
          product: products.find(p => p.id === item.productId)!,
          quantity: item.quantity
        }))
        setCartItems(cartItemsFromOrder)
      }
    }
  }, [editOrderId, orders, products])

  const handleOrder = () => {
    if (cartItems.length === 0) {
      alert('Koszyk jest pusty!')
      return false
    }

    // Sprawdź dostępność produktów
    const unavailableItems = cartItems.filter(item => {
      const product = products.find(p => p.id === item.product.id)
      // Jeśli edytujemy zamówienie, nie uwzględniamy obecnej rezerwacji
      const currentReservation = editOrderId ? 
        orders.find(o => o.id === parseInt(editOrderId))?.items
          .find(i => i.productId === item.product.id)?.quantity || 0 
        : 0
      return !product || (product.quantity - (product.reserved || 0) + currentReservation) < item.quantity
    })

    if (unavailableItems.length > 0) {
      alert('Niektóre produkty nie są już dostępne w wybranej ilości!')
      return false
    }

    // Jeśli edytujemy, najpierw anulujemy stare zamówienie
    if (editOrderId) {
      const oldOrder = orders.find(o => o.id === parseInt(editOrderId))
      if (oldOrder) {
        unreserveProducts(oldOrder.items)
      }
    }

    // Utwórz nowe zamówienie
    const newOrder = {
      id: editOrderId ? parseInt(editOrderId) : Math.floor(Math.random() * 1000000) + Date.now(),
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity
      })),
      status: 'new' as const,
      createdAt: new Date()
    }

    // Zarezerwuj produkty i dodaj zamówienie
    reserveProducts(newOrder.items)
    addOrder(newOrder)
    
    // Wyczyść koszyk
    setCartItems([])
    
    alert('Zamówienie zostało zaktualizowane!')
    router.push('/zamowienia')
    return true
  }

  /**
   * Funkcja obsługująca edycję produktu
   */
  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  /**
   * Funkcja obsługująca usuwanie produktu
   */
  const handleDelete = (productId: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten produkt?')) {
      updateProducts(products.filter(product => product.id !== productId))
      handleRemoveFromCart(productId)
    }
  }

  /**
   * Funkcja zamykająca formularz
   */
  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
  }

  /**
   * Funkcja dodająca produkt do koszyka
   */
  const handleAddToCart = (productId: number) => {
    const product = products.find(p => p.id === productId)
    if (!product || product.quantity < 1) return

    setCartItems(currentItems => {
      const existingItem = currentItems.find(item => item.product.id === productId)
      if (existingItem) {
        return currentItems.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...currentItems, { product, quantity: 1 }]
    })
  }

  /**
   * Funkcja usuwająca produkt z koszyka
   */
  const handleRemoveFromCart = (productId: number) => {
    setCartItems(currentItems =>
      currentItems.filter(item => item.product.id !== productId)
    )
  }

  /**
   * Funkcja zmieniająca ilość produktu w koszyku
   */
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveFromCart(productId)
      return
    }

    const product = products.find(p => p.id === productId)
    if (!product) return

    // Sprawdź dostępną ilość z uwzględnieniem rezerwacji
    const availableQuantity = product.quantity - (product.reserved || 0)
    if (availableQuantity < newQuantity) {
      alert(`Dostępna ilość produktu: ${availableQuantity}`)
      return
    }

    setCartItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  /**
   * Funkcja dodająca nowy produkt
   */
  const handleAddProduct = (
    name: string,
    quantity: number,
    image?: string,
    description?: string
  ) => {
    const newProduct: Product = {
      id: Date.now(),
      name,
      quantity,
      reserved: 0,
      image,
      description
    }
    updateProducts([...products, newProduct])
    handleCloseForm()
  }

  /**
   * Funkcja edytująca produkt
   */
  const handleEditProduct = (
    name: string,
    quantity: number,
    image?: string,
    description?: string
  ) => {
    if (!editingProduct) return

    const updatedProducts = products.map(product =>
      product.id === editingProduct.id
        ? {
            ...product,
            name,
            quantity,
            image,
            description
          }
        : product
    )
    updateProducts(updatedProducts)
    handleCloseForm()
  }

  const handleEditOrderSubmit = (items: { productId: number; quantity: number }[], notes: string) => {
    const oldOrder = orders.find(o => o.id === parseInt(editOrderId!));
    
    const updatedOrder: Order = {
      id: parseInt(editOrderId!),
      items: items.map(item => ({
        productId: item.productId,
        productName: products.find(p => p.id === item.productId)?.name || '',
        quantity: item.quantity
      })),
      status: 'new',
      createdAt: oldOrder?.createdAt || new Date(),
      notes
    };

    addOrder(updatedOrder);
    router.push('/zamowienia');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <PageHeader title="Produkty" />
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Dodaj produkt
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ProductList
            products={products}
            onAddToCart={handleAddToCart}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
        <div className="md:col-span-1">
          <Cart
            cartItems={cartItems}
            onRemove={handleRemoveFromCart}
            onQuantityChange={handleQuantityChange}
            onOrder={handleOrder}
          />
        </div>
      </div>

      {isFormOpen && (
        <ProductForm
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          onClose={handleCloseForm}
          initialData={editingProduct || undefined}
          title={editingProduct ? "Edytuj produkt" : "Dodaj nowy produkt"}
        />
      )}

      {editOrderId && (
        <OrderEditModal
          order={orders.find(o => o.id === parseInt(editOrderId)) || {
            id: parseInt(editOrderId),
            items: [],
            status: 'new',
            createdAt: new Date()
          }}
          products={products}
          onClose={() => router.push('/zamowienia')}
          onSubmit={handleEditOrderSubmit}
        />
      )}
    </div>
  )
}