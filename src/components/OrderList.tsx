import { Order } from '@/types'
import { PDFDownloadButton } from './OrderPDF'

interface OrderListProps {
  orders: Order[];
  onStatusChange: (orderId: number, newStatus: Order['status']) => void;
}

/**
 * Mapa statusów zamówień
 * Definiuje wszystkie możliwe statusy i ich etykiety
 */
const STATUS_MAP: Record<Order['status'], string> = {
  new: 'Nowe',
  accepted: 'Przyjęte',
  completed: 'Zrealizowane',
  cancelled: 'Anulowane'  // Dodano brakujący status
}

/**
 * Mapa kolorów dla statusów
 * Definiuje style dla każdego statusu
 */
const STATUS_COLORS: Record<Order['status'], string> = {
  new: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'  // Dodano styl dla anulowanych
}

export default function OrderList({ orders, onStatusChange }: OrderListProps) {
  /**
   * Formatuje datę do lokalnego formatu
   * @param date - Data do sformatowania
   */
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Zwraca etykietę dla danego statusu
   * @param status - Status zamówienia
   */
  const getStatusLabel = (status: Order['status']): string => {
    return STATUS_MAP[status] || 'Nieznany'
  }

  /**
   * Zwraca klasę CSS dla danego statusu
   * @param status - Status zamówienia
   */
  const getStatusColor = (status: Order['status']): string => {
    return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID zamówienia
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data złożenia
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produkty
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Akcje
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                #{order.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div className="space-y-1">
                  {order.items.map((item) => (
                    <div key={item.productId}>
                      {item.productName} - {item.quantity} szt.
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value as Order['status'])}
                  className={`text-sm font-medium px-3 py-1 rounded-full ${getStatusColor(order.status)}`}
                  disabled={order.status === 'completed' || order.status === 'cancelled'}
                >
                  {Object.entries(STATUS_MAP).map(([value, label]) => (
                    <option 
                      key={value} 
                      value={value}
                      disabled={
                        order.status === 'completed' || 
                        order.status === 'cancelled' ||
                        (order.status === 'accepted' && value === 'new')
                      }
                    >
                      {label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                <PDFDownloadButton order={order} />
                {order.status === 'new' && (
                  <button
                    onClick={() => onStatusChange(order.id, 'cancelled')}
                    className="text-red-600 hover:text-red-900"
                  >
                    Anuluj
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}