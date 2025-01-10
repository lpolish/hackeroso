'use client'

import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SectionHeading from '../components/SectionHeading'
import { Grid, List } from 'lucide-react'
import TrendingList from '../components/TrendingList'

export default function TrendingPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <SectionHeading 
            title="github trending"
            subtitle="discover popular repositories and developers"
            icon="trending"
          />
          <div className="hidden md:inline-flex rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${
                viewMode === 'grid'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
              aria-label="grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${
                viewMode === 'list'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
              aria-label="list view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        <TrendingList viewMode={viewMode} />
      </main>
      <Footer />
    </div>
  )
}

