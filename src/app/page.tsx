'use client'

import { useState, useEffect } from 'react'
import ProductList from '@/components/ProductList'
import Cart from '@/components/Cart'
import ProductForm from '@/components/ProductForm'
import { initialProducts } from '@/data/products'
import { Product, Order } from '@/types'

/**
 * Komponent głównej strony aplikacji
 * Zarządza listą produktów, koszykiem i formularzem dodawania/edycji
 */
export default function HomePage() {
  // Stan przechowujący listę wszystkich dostępnych produktów
  // Inicjalizacja z localStorage lub wartości domyślnych
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      const savedProducts = localStorage.getItem('products')
      return savedProducts ? JSON.parse(savedProducts) : initialProducts
    }
    return initialProducts
  })
  
  // Stan przechowujący produkty dodane do koszyka wraz z ich ilością
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number }[]>([])
  
  // Stan kontrolujący widoczność formularza dodawania/edycji produktu
  const [isFormOpen, setIsFormOpen] = useState(false)
  
  // Stan przechowujący aktualnie edytowany produkt (null gdy dodajemy nowy)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Efekt zapisujący produkty do localStorage przy każdej zmianie
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products))
  }, [products])

  /**
   * Dodaje produkt do koszyka lub zwiększa jego ilość jeśli już istnieje
   * @param productId - ID produktu do dodania
   */
  const handleAddToCart = (productId: number) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    setCartItems(currentItems => {
      const existingItem = currentItems.find(item => item.product.id === productId)
      if (existingItem) {
        // Jeśli produkt jest już w koszyku, zwiększ jego ilość o 1
        return currentItems.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      // Jeśli produktu nie ma w koszyku, dodaj go z ilością 1
      return [...currentItems, { product, quantity: 1 }]
    })
  }

  /**
   * Usuwa produkt z koszyka
   * @param productId - ID produktu do usunięcia
   */
  const handleRemoveFromCart = (productId: number) => {
    setCartItems(currentItems => 
      currentItems.filter(item => item.product.id !== productId)
    )
  }

  /**
   * Aktualizuje ilość produktu w koszyku
   * @param productId - ID produktu do aktualizacji
   * @param newQuantity - Nowa ilość produktu
   */
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  /**
   * Obsługuje proces składania zamówienia:
   * - Sprawdza dostępność produktów
   * - Tworzy nowe zamówienie
   * - Zapisuje je w localStorage
   * - Aktualizuje stany produktów
   * - Czyści koszyk
   */
  const handleOrder = () => {
    // Sprawdź, czy wszystkie produkty są dostępne w wystarczającej ilości
    const canOrder = cartItems.every(item => {
      const product = products.find(p => p.id === item.product.id)
      return product && product.quantity >= item.quantity
    })

    if (!canOrder) {
      alert('Nie można złożyć zamówienia - niektóre produkty są niedostępne w wybranej ilości')
      return
    }

    // Tworzenie nowego zamówienia
    const newOrder: Order = {
      id: Date.now(),
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity
      })),
      status: 'new',
      createdAt: new Date()
    }

    // Zapisywanie zamówienia w localStorage
    const savedOrders = localStorage.getItem('orders')
    const orders = savedOrders ? JSON.parse(savedOrders) : []
    localStorage.setItem('orders', JSON.stringify([newOrder, ...orders]))

    // Aktualizacja stanów produktów
    setProducts(currentProducts =>
      currentProducts.map(product => {
        const cartItem = cartItems.find(item => item.product.id === product.id)
        if (!cartItem) return product
        
        return {
          ...product,
          quantity: product.quantity - cartItem.quantity,
          reserved: product.reserved + cartItem.quantity
        }
      })
    )

    // Czyszczenie koszyka i wyświetlenie potwierdzenia
    setCartItems([])
    alert('Zamówienie zostało złożone!')
  }

  /**
   * Dodaje nowy produkt do listy
   * @param name - Nazwa nowego produktu
   * @param quantity - Początkowa ilość produktu
   */
  const handleAddProduct = (name: string, quantity: number) => {
    const newProduct: Product = {
      id: Math.max(0, ...products.map(p => p.id)) + 1,
      name,
      quantity,
      reserved: 0
    }
    setProducts([newProduct, ...products])
  }

  /**
   * Aktualizuje dane istniejącego produktu
   * @param name - Nowa nazwa produktu
   * @param quantity - Nowa ilość produktu
   */
  const handleEditProduct = (name: string, quantity: number) => {
    if (!editingProduct) return
    setProducts(currentProducts =>
      currentProducts.map(product =>
        product.id === editingProduct.id
          ? { ...product, name, quantity }
          : product
      )
    )
  }

  /**
   * Otwiera formularz w trybie edycji dla wybranego produktu
   * @param product - Produkt do edycji
   */
  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  /**
   * Zamyka formularz i resetuje stan edycji
   */
  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
  }

  return (
    <div className="container mx-auto p-4">
      {/* Nagłówek z przyciskiem dodawania produktu */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-600">Lista produktów</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Dodaj produkt
        </button>
      </div>
      
      {/* Grid z listą produktów (2/3 szerokości) i koszykiem (1/3 szerokości) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ProductList
            products={products}
            onAddToCart={handleAddToCart}
            onEdit={handleEdit}
            onDelete={() => {}} // TODO: Implementacja usuwania produktów
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

      {/* Modal formularza (widoczny tylko gdy isFormOpen=true) */}
      {isFormOpen && (
        <ProductForm
          onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
          onClose={handleCloseForm}
          initialData={editingProduct || undefined}
          title={editingProduct ? "Edytuj produkt" : "Dodaj nowy produkt"}
        />
      )}
    </div>
  )
}