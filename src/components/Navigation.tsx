import Link from 'next/link'

interface NavigationProps {
  currentPath: 'products' | 'orders';
}

export default function Navigation({ currentPath }: NavigationProps) {
  return (
    <div className="space-x-4">
      <Link
        href="/"
        className={`text-xl font-semibold px-4 py-2 rounded-lg bg-white shadow-sm 
        transition-all duration-200 hover:bg-green-50
        ${currentPath === 'products' 
          ? 'text-green-700 border-b-2 border-green-600 bg-green-50' 
          : 'text-stone-400 border-b-2 border-transparent hover:text-stone-600'
        }`}
      >
        Lista produktów
      </Link>
      <Link
        href="/zamowienia"
        className={`text-xl font-semibold px-4 py-2 rounded-lg bg-white shadow-sm 
        transition-all duration-200 hover:bg-green-50
        ${currentPath === 'orders' 
          ? 'text-green-700 border-b-2 border-green-600 bg-green-50' 
          : 'text-stone-400 border-b-2 border-transparent hover:text-stone-600'
        }`}
      >
        Lista zamówień
      </Link>
    </div>
  );
}