import './globals.css'
import { Inter } from 'next/font/google'
import { OrderProvider } from '@/contexts/OrderContext'
import { ProductProvider } from '@/contexts/ProductContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sklep z produktami',
  description: 'Aplikacja do zarządzania produktami i zamówieniami',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ProductProvider>
          <OrderProvider>
            {children}
          </OrderProvider>
        </ProductProvider>
      </body>
    </html>
  )
}