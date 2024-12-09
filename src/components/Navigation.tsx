import Link from 'next/link'

interface NavigationProps {
  currentPath: 'products' | 'orders';
}

export default function Navigation({ currentPath }: NavigationProps) {
  return (
    <div className="fixed left-4 bottom-4 top-[8.5rem] w-64 bg-white shadow-lg rounded-lg">
      <div className="p-6">
        <nav className="space-y-2 pt-8">
          <Link
            href="/"
            className={`block w-full px-4 py-3 rounded-lg transition-all duration-200
            ${currentPath === 'products' 
              ? 'bg-green-50 text-green-700 border-l-4 border-green-600' 
              : 'text-stone-400 hover:bg-green-50 hover:text-green-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Lista produktów</span>
            </div>
          </Link>
          
          <Link
            href="/zamowienia"
            className={`block w-full px-4 py-3 rounded-lg transition-all duration-200
            ${currentPath === 'orders' 
              ? 'bg-green-50 text-green-700 border-l-4 border-green-600' 
              : 'text-stone-400 hover:bg-green-50 hover:text-green-600'
            }`}
          >
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Lista zamówień</span>
            </div>
          </Link>
        </nav>
      </div>
    </div>
  );
}