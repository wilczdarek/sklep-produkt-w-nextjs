import { useState } from 'react';
import { Order, Product } from '@/types';

interface OrderEditModalProps {
  order: Order;
  products: Product[];
  onClose: () => void;
  onSubmit: (items: { productId: number; quantity: number }[], notes: string) => void;
}

export default function OrderEditModal({ order, products, onClose, onSubmit }: OrderEditModalProps) {
  const [items, setItems] = useState(
    order?.items?.map(item => ({
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity
    })) || []
  );
  const [notes, setNotes] = useState('');

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(items, notes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4 text-green-700">
          Edycja zamówienia #{order.id}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-green-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase">
                    Produkt
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-green-700 uppercase">
                    Ilość
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.productId}>
                    <td className="px-4 py-2 text-black font-medium">{item.productName}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        min="0"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border rounded bg-green-50 text-black"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Uwagi
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-green-50 text-green-800"
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
              Zapisz zmiany
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 