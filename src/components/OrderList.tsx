import { Order } from '@/types'
import { PDFDownloadButton } from './OrderPDF'

interface OrderListProps {
  orders: Order[];
  onStatusChange: (orderId: number, newStatus: Order['status']) => void;
}



export default function OrderList({ orders, onStatusChange }: OrderListProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusLabel = (status: Order['status']) => {
    const statusMap = {
      new: 'Nowe',
      accepted: 'Przyjęte',
      completed: 'Zrealizowane'
    }
    return statusMap[status]
  }

  const getStatusColor = (status: Order['status']) => {
    const colorMap = {
      new: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    }
    return colorMap[status]
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
                >
                  <option value="new">Nowe</option>
                  <option value="accepted">Przyjęte</option>
                  <option value="completed">Zrealizowane</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <PDFDownloadButton order={order} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}