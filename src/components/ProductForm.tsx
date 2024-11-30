import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Product } from '@/types'

interface ProductFormProps {
  onSubmit: (name: string, quantity: number) => void;
  onClose: () => void;
  initialData?: Product; // Opcjonalne dane do edycji
  title?: string; // Opcjonalny tytuł formularza
}

export default function ProductForm({ onSubmit, onClose, initialData, title = "Dodaj nowy produkt" }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [quantity, setQuantity] = useState(initialData?.quantity.toString() || '')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Walidacja
    if (!name.trim()) {
      setError('Nazwa produktu jest wymagana')
      return
    }

    const quantityNum = parseInt(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError('Ilość musi być liczbą większą od 0')
      return
    }

    onSubmit(name, quantityNum)
    setName('')
    setQuantity('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {title}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Nazwa produktu
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="Wprowadź nazwę produktu"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="block text-gray-700 font-medium mb-2">
              Ilość
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              placeholder="Wprowadź ilość"
              min="1"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {initialData ? 'Zapisz zmiany' : 'Dodaj produkt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}