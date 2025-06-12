'use client'

interface PaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null

  return (
    <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
      {Array.from({ length: lastPage }, (_, i) => {
        const page = i + 1
        const isActive = page === currentPage

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-md border text-sm transition ${
              isActive
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
            }`}
          >
            {page}
          </button>
        )
      })}
    </div>
  )
}
