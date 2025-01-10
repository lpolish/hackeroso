'use client'

import { useState } from 'react'
import StoryList from './components/StoryList'
import Header from './components/Header'
import Footer from './components/Footer'
import SectionHeading from './components/SectionHeading'
import { Grid, List, AlignJustify } from 'lucide-react'

export default function Home() {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-black">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0 md:justify-between mb-6">
          <SectionHeading 
            title="trending techscape"
            subtitle="hottest discussions shaping the tech world"
            icon="top"
          />
          <div className="inline-flex rounded-lg overflow-hidden h-7 md:h-8 self-end md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2 h-full flex items-center justify-center ${
                viewMode === 'grid'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
              aria-label="grid view"
            >
              <Grid className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2 h-full flex items-center justify-center ${
                viewMode === 'list'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
              aria-label="list view"
            >
              <List className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-2 h-full flex items-center justify-center ${
                viewMode === 'compact'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
              aria-label="compact view"
            >
              <AlignJustify className="w-3.5 h-3.5 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
        <StoryList storyType="top" viewMode={viewMode} />
      </main>
      <Footer />
    </div>
  )
}

