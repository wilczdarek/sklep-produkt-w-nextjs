import { ShoppingBagIcon, XMarkIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Product } from '@/types'

interface CartProps {
  cartItems: { product: Product; quantity: number }[];
  onRemove: (productId: number) => void;
  onQuantityChange: (productId: number, newQuantity: number) => void;
  onOrder: () => void;
}

export default function Cart({ cartItems, onRemove, onQuantityChange, onOrder }: CartProps) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Nagłówek koszyka */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ShoppingBagIcon className="h-6 w-6 text-green-700 mr-2" />
          <h2 className="text-lg font-semibold text-green-700">Koszyk ({totalItems})</h2>
        </div>
      </div>

      {/* Lista produktów */}
      <div className="space-y-3">
        {cartItems.map(({ product, quantity }) => (
          <div key={product.id} className="flex items-center justify-between border-b pb-2">
            <div className="flex-1">
              <p className="font-medium text-gray-800">{product.name}</p>
              <div className="flex items-center mt-1">
                <button
                  onClick={() => onQuantityChange(product.id, quantity - 1)}
                  disabled={quantity <= 1}
                  className="text-gray-500 hover:text-gray-800 disabled:opacity-50"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="mx-2 text-sm text-gray-800">{quantity}</span>
                <button
                  onClick={() => onQuantityChange(product.id, quantity + 1)}
                  disabled={quantity >= product.quantity}
                  className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <button
              onClick={() => onRemove(product.id)}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Przycisk zamówienia */}
      {cartItems.length > 0 && (
        <button
          onClick={onOrder}
          className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
        >
          Złóż zamówienie
        </button>
      )}

      {/* Pusty koszyk */}
      {cartItems.length === 0 && (
        <p className="text-gray-500 text-center py-4">Koszyk jest pusty</p>
      )}
    </div>
  )
}