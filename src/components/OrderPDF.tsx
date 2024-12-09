import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Order } from '@/types';

// Rejestracja lokalnych czcionek
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: '/fonts/Roboto-Regular.ttf',
      fontWeight: 'normal',
    },
    {
      src: '/fonts/Roboto-Bold.ttf',
      fontWeight: 'bold',
    }
  ]
});

interface OrderPDFProps {
  order: Order;
}

// Definicja kolorów zgodnych z aplikacją
const colors = {
  green: {
    light: '#f0fdf4',  // bg-green-50
    medium: '#22c55e', // text-green-500
    dark: '#15803d',   // text-green-700
  },
  gray: {
    light: '#f9fafb',
    medium: '#6b7280',
    dark: '#374151',
  }
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
    fontFamily: 'Roboto',
  },
  header: {
    backgroundColor: colors.green.light,
    padding: 20,
    marginBottom: 20,
    borderRadius: 8,
  },
  headerTitle: {
    color: colors.green.dark,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'Roboto',
  },
  orderInfo: {
    color: colors.gray.medium,
    fontSize: 12,
    marginBottom: 4,
    fontFamily: 'Roboto',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: colors.green.dark,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    padding: 8,
    backgroundColor: colors.green.light,
    borderRadius: 4,
    fontFamily: 'Roboto',
  },
  table: {
    display: 'flex',
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.green.light,
    borderBottomColor: colors.green.medium,
    borderBottomWidth: 1,
    padding: 8,
  },
  tableHeaderCell: {
    color: colors.green.dark,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomColor: colors.gray.light,
    borderBottomWidth: 1,
    padding: 8,
  },
  tableCell: {
    fontSize: 12,
    color: colors.gray.dark,
    fontFamily: 'Roboto',
  },
  col20: { width: '20%' },
  col30: { width: '30%' },
  col50: { width: '50%' },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: colors.gray.medium,
    fontSize: 10,
    borderTopColor: colors.green.light,
    borderTopWidth: 1,
    paddingTop: 10,
    fontFamily: 'Roboto',
  },
  status: {
    padding: 4,
    borderRadius: 4,
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: colors.green.light,
    color: colors.green.dark,
    fontFamily: 'Roboto',
  },
  signatureContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray.medium,
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 10,
    color: colors.gray.medium,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
});

const STATUS_MAP: Record<Order['status'], string> = {
  new: 'Nowe',
  accepted: 'Przyjęte',
  completed: 'Zrealizowane',
  cancelled: 'Anulowane'
};

export function OrderPDF({ order }: OrderPDFProps) {
  console.log('Rendering PDF for order:', order.id);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Nagłówek */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Zamówienie #{order.id}</Text>
          <Text style={styles.orderInfo}>Data złożenia: {formatDate(order.createdAt)}</Text>
          <Text style={styles.orderInfo}>Status: {STATUS_MAP[order.status]}</Text>
          <Text style={styles.orderInfo}>Zamawiający: Jan Kowalski</Text>
        </View>

        {/* Szczegóły zamówienia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Szczegóły zamówienia</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, styles.col50]}>Produkt</Text>
              <Text style={[styles.tableHeaderCell, styles.col30]}>Ilość</Text>
              <Text style={[styles.tableHeaderCell, styles.col20]}>Status</Text>
            </View>
            {order.items.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.col50]}>{item.productName}</Text>
                <Text style={[styles.tableCell, styles.col30]}>{item.quantity} szt.</Text>
                <View style={[styles.col20]}>
                  <Text style={styles.status}>{STATUS_MAP[order.status]}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Dodajemy sekcję notatek jeśli istnieją */}
        {order.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uwagi</Text>
            <Text style={styles.orderInfo}>{order.notes}</Text>
          </View>
        )}

        {/* Sekcja podpisów - nowa struktura */}
        <View style={[styles.signatureContainer, { marginTop: 50 }]}>
          <View style={{ flex: 1, paddingRight: 20 }}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Zatwierdzam</Text>
          </View>
          
          <View style={{ flex: 1, paddingLeft: 20 }}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Potwierdzam odbiór</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Wygenerowano automatycznie z systemu zarządzania zamówieniami
        </Text>
      </Page>
    </Document>
  );
}