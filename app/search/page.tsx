'use client'

import { useState, useEffect, useCallback, useTransition, Suspense } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import StoryItem from '../components/StoryItem'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'

interface SearchResult {
  objectID: string;
  title: string;
  url: string;
  author: string;
  points: number;
  num_comments: number;
  created_at: string;
  created_at_i: number;
}

interface SearchData {
  hits: SearchResult[];
  page: number;
  nbPages: number;
}

interface SearchState {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: SearchData | null;
  error: string | null;
}

function SearchContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchState, setSearchState] = useState<SearchState>({
    status: 'idle',
    data: null,
    error: null,
  })
  const [showInitialState, setShowInitialState] = useState(true)
  const [showNoResults, setShowNoResults] = useState(false)
  const [showError, setShowError] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

const performSearch = useCallback(async (query: string) => {
  if (!query.trim()) return

  setSearchState({ status: 'loading', data: null, error: null })
  setShowInitialState(false)
  setShowNoResults(false)
  setShowError(false)

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
    if (!res.ok) {
      throw new Error(`failed to fetch data: ${res.status}`)
    }
    const data: SearchData = await res.json()
    setSearchState({ status: 'success', data, error: null })
    if (data.hits.length === 0) {
      setShowNoResults(true)
    }
  } catch (error) {
    setSearchState({ status: 'error', data: null, error: error instanceof Error ? error.message : 'something went wrong' })
    setShowError(true)
  }
}, [])

const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  if (!searchQuery.trim()) return
  performSearch(searchQuery)
}, [searchQuery, performSearch])

  const handlePageChange = useCallback((page: number) => {
    const query = searchParams.get('q') || searchQuery
    router.push(`/search?q=${encodeURIComponent(query)}&page=${page}`)
    performSearch(query)
  }, [searchQuery, router, performSearch, searchParams])

  // Initialize from URL params
  useEffect(() => {
    const query = searchParams.get('q')
    if (query) {
      setSearchQuery(query)
      performSearch(query)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Head>
        <title>Hackeroso | Search</title>
        <meta name="description" content="Search for tech news, discussions, and job opportunities on Hackeroso." />
      </Head>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4 text-foreground">search results</h1>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-green-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          </div>
        </form>

        <div className="min-h-[300px] relative">
          {showInitialState && !searchParams.get('q') && (
            <div className="text-center py-4 text-muted-foreground">
              enter a search query to get started
            </div>
          )}

          {showNoResults && (
            <div className="text-center py-4 text-muted-foreground">
              no results found
            </div>
          )}

          {showError && (
            <div className="text-center py-4 text-destructive">
              {searchState.error}
            </div>
          )}

          {searchState.status === 'success' && searchState.data && searchState.data.hits.length > 0 && (
            <div>
              <div className="space-y-4 mb-6">
                {searchState.data.hits.map((story: SearchResult) => (
                  <StoryItem key={story.objectID} story={story} viewMode="list" />
                ))}
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handlePageChange(searchState.data!.page - 1)}
                  disabled={searchState.data.page === 0}
                  className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border 
                           rounded-md hover:bg-muted disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-foreground">
                  Page {searchState.data.page + 1} of {searchState.data.nbPages}
                </span>
                <button
                  onClick={() => handlePageChange(searchState.data!.page + 1)}
                  disabled={searchState.data.page === searchState.data.nbPages - 1}
                  className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border 
                           rounded-md hover:bg-muted disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {searchState.status === 'loading' && (
            <div className="text-center py-4 text-muted-foreground">
              searching...
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}

