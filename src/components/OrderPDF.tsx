// Importy z biblioteki do generowania PDF
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer'
// Import typu dla elementów React
import type { ReactElement } from 'react'
// Import typu dla stylów PDF
import type { Style } from '@react-pdf/types'
// Import własnych typów
import type { Order } from '@/types'

/**
 * Rejestracja fontu Roboto wspierającego polskie znaki
 * Font jest pobierany z CDN, co eliminuje potrzebę lokalnego przechowywania
 */
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf'
})

/**
 * Definicje stylów dla dokumentu PDF
 * Każdy styl jest jawnie typowany jako Style dla lepszej kontroli typów
 */
const styles = StyleSheet.create({
  // Styl dla całej strony
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Roboto'
  } as Style,
  
  // Styl dla nagłówka dokumentu
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Roboto'
  } as Style,
  
  // Styl dla głównej sekcji dokumentu
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  } as Style,
  
  // Styl dla informacji o zamówieniu
  orderInfo: {
    marginBottom: 20,
    fontFamily: 'Roboto'
  } as Style,
  
  // Styl dla tabeli produktów
  table: {
    display: 'table' as const,
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 20
  } as Style,
  
  // Styl dla wiersza tabeli
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 30,
    alignItems: 'center'
  } as Style,
  
  // Styl dla nagłówka tabeli
  tableHeader: {
    backgroundColor: '#f0f0f0'
  } as Style,
  
  // Styl dla komórki tabeli
  tableCell: {
    flex: 1,
    padding: 5,
    fontFamily: 'Roboto'
  } as Style,
  
  // Styl dla stopki dokumentu
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: 'grey',
    fontFamily: 'Roboto'
  } as Style
})

/**
 * Funkcja pomocnicza do formatowania statusu zamówienia
 * @param status - Status zamówienia z typu Order
 * @returns Sformatowany tekst statusu w języku polskim
 */
const formatStatus = (status: Order['status']): string => {
  const statusMap: Record<Order['status'], string> = {
    new: 'Nowe',
    accepted: 'Przyjęte',
    completed: 'Zrealizowane'
  }
  return statusMap[status]
}

/**
 * Interfejs dla props komponentu OrderDocument
 */
interface OrderDocumentProps {
  order: Order;
}

/**
 * Komponent generujący dokument PDF z zamówieniem
 * @param props - Właściwości komponentu zawierające dane zamówienia
 * @returns Element dokumentu PDF
 */
const OrderDocument = ({ order }: OrderDocumentProps): ReactElement => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Nagłówek dokumentu */}
      <View style={styles.header}>
        <Text>Zamówienie #{order.id}</Text>
      </View>
      
      <View style={styles.section}>
        {/* Informacje o zamówieniu */}
        <View style={styles.orderInfo}>
          <Text>Data zamówienia: {new Date(order.createdAt).toLocaleString('pl-PL')}</Text>
          <Text>Status: {formatStatus(order.status)}</Text>
        </View>

        {/* Tabela z produktami */}
        <View style={styles.table}>
          {/* Nagłówek tabeli */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCell}>
              <Text>Produkt</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Ilość</Text>
            </View>
          </View>

          {/* Wiersze z produktami */}
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

      {/* Stopka dokumentu */}
      <View style={styles.footer}>
        <Text>Wygenerowano: {new Date().toLocaleString('pl-PL')}</Text>
      </View>
    </Page>
  </Document>
)

/**
 * Interfejs dla props komponentu PDFDownloadButton
 */
interface PDFDownloadButtonProps {
  order: Order;
}

/**
 * Komponent przycisku do pobierania PDF
 * @param props - Właściwości komponentu zawierające dane zamówienia
 * @returns Przycisk umożliwiający pobranie PDF
 */
export const PDFDownloadButton = ({ order }: PDFDownloadButtonProps): ReactElement => (
  <PDFDownloadLink
    document={<OrderDocument order={order} />}
    fileName={`zamowienie-${order.id}.pdf`}
    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
  >
    {({ loading }): string =>
      loading ? 'Generowanie PDF...' : 'Pobierz PDF'
    }
  </PDFDownloadLink>
)