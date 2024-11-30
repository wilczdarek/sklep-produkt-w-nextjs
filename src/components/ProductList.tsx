// Importy niezbędnych typów i komponentów
import { Product } from '@/types'
// Importy ikon z biblioteki Heroicons
import { PencilIcon, ShoppingCartIcon, TrashIcon } from '@heroicons/react/24/outline'

// Definicja interfejsu props dla komponentu
interface ProductListProps {
  products: Product[];              // Lista produktów do wyświetlenia
  onAddToCart: (productId: number) => void;  // Funkcja obsługująca dodawanie do koszyka
  onEdit: (product: Product) => void;        // Funkcja obsługująca edycję produktu
  onDelete: (productId: number) => void;     // Funkcja obsługująca usuwanie produktu
}

export default function ProductList({ 
  products, 
  onAddToCart, 
  onEdit, 
  onDelete 
}: ProductListProps) {
  return (
    // Kontener z overflow dla responsywności tabeli
    <div className="overflow-x-auto">
      {/* Tabela z podstawowymi stylami */}
      <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
        {/* Nagłówek tabeli */}
        <thead className="bg-green-50">
          <tr>
            {/* Nagłówki kolumn z odpowiednimi stylami */}
            <th className="px-6 py-3 text-left text-xs font-medium text-green-600 uppercase tracking-wider border-b">
              Nazwa produktu
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-600 uppercase tracking-wider border-b">
              Ilość
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-600 uppercase tracking-wider border-b">
              W rezerwacji
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-green-600 uppercase tracking-wider border-b">
              Akcje
            </th>
          </tr>
        </thead>

        {/* Ciało tabeli */}
        <tbody className="divide-y divide-gray-200 bg-white">
          {/* Mapowanie przez listę produktów */}
          {products.map((product) => (
            <tr 
              key={product.id} 
              // Efekt hover i animacja dla wierszy
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              {/* Komórka z nazwą produktu */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {product.name}
              </td>
              {/* Komórka z ilością */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.quantity}
              </td>
              {/* Komórka z ilością zarezerwowaną */}
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {product.reserved}
              </td>
              {/* Komórka z przyciskami akcji */}
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {/* Kontener dla przycisków z odstępami */}
                <div className="flex space-x-3">
                  {/* Przycisk dodawania do koszyka */}
                  <button
                    onClick={() => onAddToCart(product.id)}
                    className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                    title="Dodaj do koszyka" // Tooltip przy najechaniu
                  >
                    <ShoppingCartIcon className="h-5 w-5" />
                  </button>
                  {/* Przycisk edycji */}
                  <button
                    onClick={() => onEdit(product)}
                    className="text-green-600 hover:text-green-900 transition-colors duration-200"
                    title="Edytuj"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  {/* Przycisk usuwania */}
                  <button
                    onClick={() => onDelete(product.id)}
                    className="text-red-600 hover:text-red-900 transition-colors duration-200"
                    title="Usuń"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}