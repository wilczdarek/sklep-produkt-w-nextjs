import './globals.css'
import type { Metadata } from 'next'
import { OrderProvider } from '@/contexts/OrderContext'
import { ProductProvider } from '@/contexts/ProductContext'
import AppLayout from '@/components/AppLayout'

export const metadata: Metadata = {
  title: 'Sklep produktów',
  description: 'Aplikacja do zarządzania produktami i zamówieniami',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <body>
        <ProductProvider>
          <OrderProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </OrderProvider>
        </ProductProvider>
      </body>
    </html>
  )
}