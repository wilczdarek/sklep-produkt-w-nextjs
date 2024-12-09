import { PDFDownloadLink } from '@react-pdf/renderer';
import { Order } from '@/types';
import { OrderPDF } from './OrderPDF';

interface PDFDownloadButtonProps {
  order: Order;
}

export function PDFDownloadButton({ order }: PDFDownloadButtonProps) {
  return (
    <PDFDownloadLink
      document={<OrderPDF order={order} />}
      fileName={`zamowienie-${order.id}.pdf`}
      className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
    >
      {({ loading }) => (
        loading ? 'Generowanie PDF...' : 'Pobierz PDF'
      )}
    </PDFDownloadLink>
  );
} 