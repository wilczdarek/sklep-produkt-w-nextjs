import Image from 'next/image'
import { Product } from '@/types'

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetailsModal({ product, onClose }: ProductDetailsModalProps) {
  return (
    // Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal */}
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        {/* Nagłówek */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="sr-only">Zamknij</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Zawartość */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Zdjęcie */}
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Brak zdjęcia
              </div>
            )}
          </div>

          {/* Szczegóły */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Szczegóły produktu</h3>
            <p className="text-gray-600 whitespace-pre-wrap">
              {product.description || 'Brak opisu produktu.'}
            </p>
            
            {/* Dodatkowe informacje */}
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Dostępność:</span>{' '}
                {product.quantity} szt.
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Zarezerwowano:</span>{' '}
                {product.reserved} szt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}