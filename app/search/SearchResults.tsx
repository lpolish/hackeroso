import StoryItem from '../components/StoryItem'
import Pagination from './Pagination'

interface SearchResult {
  objectID: string;
  title: string;
  url: string;
  author: string;
  points: number;
  num_comments: number;
  created_at_i: number;
}

interface SearchResponse {
  hits: SearchResult[];
  page: number;
  nbPages: number;
}

async function fetchSearchResults(query: string, page: number): Promise<SearchResponse> {
  const res = await fetch(`http://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&page=${page}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch search results')
  return res.json()
}

export default async function SearchResults({ query, page }: { query: string, page: number }) {
  if (!query) {
    return (
      <div className="text-center py-4 text-gray-600 dark:text-gray-400">
        enter a search query to get started
      </div>
    )
  }

  const data = await fetchSearchResults(query, page)

  if (data.hits.length === 0) {
    return (
      <div className="text-center py-4 text-gray-600 dark:text-gray-400">
        no results found
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-4 mb-6">
        {data.hits.map((story: SearchResult) => (
          <StoryItem 
            key={story.objectID} 
            story={{
              id: parseInt(story.objectID),
              title: story.title,
              url: story.url,
              score: story.points,
              by: story.author,
              time: story.created_at_i,
              descendants: story.num_comments
            }} 
            viewMode="list" 
          />
        ))}
      </div>
      <Pagination currentPage={data.page} totalPages={data.nbPages} query={query} />
    </div>
  )
}

