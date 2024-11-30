import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          <div className="flex space-x-4">
            <Link 
              href="/" 
              className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
            >
              Produkty
            </Link>
            <Link 
              href="/zamowienia" 
              className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium"
            >
              Zamówienia
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}