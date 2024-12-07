import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Product } from '@/types'

interface ProductFormProps {
  onSubmit: (name: string, quantity: number, image?: string, description?: string) => void;
  onClose: () => void;
  initialData?: Product;
  title: string;
}

export default function ProductForm({ onSubmit, onClose, initialData, title }: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [quantity, setQuantity] = useState(initialData?.quantity || 0)
  const [image, setImage] = useState(initialData?.image || '')
  const [description, setDescription] = useState(initialData?.description || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(name, quantity, image, description)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-green-700">{title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nazwa produktu
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md 
                bg-green-50 text-green-800 
                focus:outline-none focus:ring-2 focus:ring-green-500 
                placeholder-green-700 placeholder-opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ilość
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-3 py-2 border rounded-md 
                bg-green-50 text-green-800 
                focus:outline-none focus:ring-2 focus:ring-green-500 
                placeholder-green-700 placeholder-opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL obrazka (opcjonalnie)
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-3 py-2 border rounded-md 
                bg-green-50 text-green-800 
                focus:outline-none focus:ring-2 focus:ring-green-500 
                placeholder-green-700 placeholder-opacity-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Opis (opcjonalnie)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md 
                bg-green-50 text-green-800 
                focus:outline-none focus:ring-2 focus:ring-green-500 
                placeholder-green-700 placeholder-opacity-50"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Anuluj
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              {initialData ? 'Zapisz zmiany' : 'Dodaj produkt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}