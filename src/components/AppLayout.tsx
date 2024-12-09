'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const currentPath = pathname === '/zamowienia' ? 'orders' : 'products'

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md h-16 fixed top-0 left-0 right-0 z-10 border-b border-gray-200">
        <div className="h-full px-6 flex items-center justify-between bg-white">
          <div className="text-gray-500">
            Zalogowany jako: <span className="text-green-700 font-semibold">Administrator</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-gray-700 font-medium">Jan Kowalski</span>
            </div>
            <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="pt-20 px-4 flex">
        <div className="w-64 flex-shrink-0">
          <Navigation currentPath={currentPath} />
        </div>
        <main className="ml-4 flex-1">
          {children}
        </main>
      </div>
    </div>
  )
} 