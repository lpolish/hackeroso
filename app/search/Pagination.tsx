'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ currentPage, totalPages, query }: { currentPage: number, totalPages: number, query: string }) {
  return (
    <div className="flex justify-between items-center">
      <Link
        href={`/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
        className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                   rounded-md hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 
                   dark:text-gray-200 dark:border-gray-700 ${currentPage === 0 ? 'pointer-events-none opacity-50' : ''}`}
      >
        <ChevronLeft className="w-5 h-5" />
      </Link>
      <span className="text-sm text-gray-700 dark:text-gray-200">
        Page {currentPage + 1} of {totalPages}
      </span>
      <Link
        href={`/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
        className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 
                   rounded-md hover:bg-gray-50 disabled:opacity-50 dark:bg-gray-800 
                   dark:text-gray-200 dark:border-gray-700 ${currentPage === totalPages - 1 ? 'pointer-events-none opacity-50' : ''}`}
      >
        <ChevronRight className="w-5 h-5" />
      </Link>
    </div>
  )
}

