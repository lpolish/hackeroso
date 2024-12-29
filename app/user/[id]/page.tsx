import { Suspense } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Clock, FileText, LinkIcon } from 'lucide-react'
import Link from 'next/link'
import StoryItem from '../../components/StoryItem'

interface User {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: number[];
}

interface Item {
  id: number;
  type: string;
  by: string;
  time: number;
  text?: string;
  parent?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  descendants?: number;
}

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/user/${id}.json`)
  if (!response.ok) {
    throw new Error('Failed to fetch user')
  }
  return response.json()
}

async function fetchItems(ids: number[]): Promise<Item[]> {
  const items = await Promise.all(
    ids.slice(0, 30).map(async (id) => {
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      if (!response.ok) {
        throw new Error(`Failed to fetch item ${id}`)
      }
      return response.json()
    })
  )
  return items
}

async function UserContent({ id }: { id: string }) {
  const user = await fetchUser(id)
  const submissions = user.submitted ? await fetchItems(user.submitted) : []
  const comments = submissions.filter(item => item.type === 'comment')
  const stories = submissions.filter(item => item.type !== 'comment')

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 mb-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{user.id}</h1>
      <div className="space-y-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-2" />
          <span>Created: {formatDate(user.created)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <FileText className="w-4 h-4 mr-2" />
          <span>Karma: {user.karma}</span>
        </div>
        {user.about && (
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">About</h2>
            <div dangerouslySetInnerHTML={{ __html: user.about }} />
          </div>
        )}
        <div className="pt-4">
          <a
            href={`https://news.ycombinator.com/user?id=${user.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-green-500 transition-colors duration-200"
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            View on Hacker News
          </a>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Submissions ({stories.length})
        </h2>
        <div className="space-y-4">
          {stories.map((story) => (
            <StoryItem key={story.id} story={story} viewMode="list" />
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Comments ({comments.length})
        </h2>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-200 dark:border-zinc-700 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                <Link href={`/item/${comment.parent}`} className="hover:text-orange-500 dark:hover:text-green-400">
                  {formatDate(comment.time)}
                </Link>
              </div>
              <div className="text-sm text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: comment.text || '' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UserPage(props: PageProps) {
  const { id } = await props.params
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-zinc-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <UserContent id={id} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

