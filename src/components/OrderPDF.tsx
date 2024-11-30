import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer'
import { Order } from '@/types'

// Rejestracja fontu wspierającego polskie znaki
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf'
})

// Style dla dokumentu PDF z zdefiniowanym fontem
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Roboto' // Użycie zarejestrowanego fontu
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Roboto'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  orderInfo: {
    marginBottom: 20,
    fontFamily: 'Roboto'
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 20
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 30,
    alignItems: 'center'
  },
  tableHeader: {
    backgroundColor: '#f0f0f0'
  },
  tableCell: {
    flex: 1,
    padding: 5,
    fontFamily: 'Roboto'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: 'grey',
    fontFamily: 'Roboto'
  }
})

// Funkcja pomocnicza do formatowania statusu
const formatStatus = (status: Order['status']) => {
  const statusMap = {
    new: 'Nowe',
    accepted: 'Przyjęte',
    completed: 'Zrealizowane'
  }
  return statusMap[status]
}

// Komponent dokumentu PDF
const OrderDocument = ({ order }: { order: Order }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text>Zamówienie #{order.id}</Text>
      </View>
      
      <View style={styles.section}>
        <View style={styles.orderInfo}>
          <Text>Data zamówienia: {new Date(order.createdAt).toLocaleString('pl-PL')}</Text>
          <Text>Status: {formatStatus(order.status)}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCell}>
              <Text>Produkt</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Ilość</Text>
            </View>
          </View>

          {order.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>{item.productName}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{item.quantity} szt.</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text>Wygenerowano: {new Date().toLocaleString('pl-PL')}</Text>
      </View>
    </Page>
  </Document>
)

// Przycisk pobierania PDF
export const PDFDownloadButton = ({ order }: { order: Order }) => (
  <PDFDownloadLink
    document={<OrderDocument order={order} />}
    fileName={`zamowienie-${order.id}.pdf`}
    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
  >
    {({ blob, url, loading, error }) =>
      loading ? 'Generowanie PDF...' : 'Pobierz PDF'
    }
  </PDFDownloadLink>
)