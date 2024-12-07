interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative px-4 py-2 text-sm font-medium text-green-700 bg-white border border-gray-300 rounded-md hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Poprzednia
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 px-4 py-2 text-sm font-medium text-green-700 bg-white border border-gray-300 rounded-md hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Następna
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Strona <span className="font-medium">{currentPage}</span> z{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            {/* Pierwsza strona */}
            <button
              onClick={() => onPageChange(1)}
              disabled={currentPage === 1}
              className="relative px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &laquo;
            </button>
            
            {/* Poprzednia strona */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &lsaquo;
            </button>

            {/* Numery stron */}
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => onPageChange(i + 1)}
                className={`relative px-4 py-2 border text-sm font-medium ${
                  currentPage === i + 1
                    ? 'z-10 bg-green-50 border-green-500 text-green-600'
                    : 'bg-white border-gray-300 text-green-700 hover:bg-green-50'
                }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Następna strona */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &rsaquo;
            </button>

            {/* Ostatnia strona */}
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="relative px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-green-700 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              &raquo;
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
} 