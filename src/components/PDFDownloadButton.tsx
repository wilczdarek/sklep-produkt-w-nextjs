import { BlobProvider } from '@react-pdf/renderer';
import { Order } from '@/types';
import { OrderPDF } from './OrderPDF';

interface PDFDownloadButtonProps {
  order: Order;
}

export function PDFDownloadButton({ order }: PDFDownloadButtonProps) {
  const handleDownload = (blob: Blob | null) => {
    if (!blob) return;
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zamowienie-${order.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <BlobProvider document={<OrderPDF order={order} />} key={order.id}>
      {({ blob, loading }) => (
        <button
          onClick={() => handleDownload(blob)}
          disabled={loading}
          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generowanie PDF...' : 'Pobierz PDF'}
        </button>
      )}
    </BlobProvider>
  );
} 