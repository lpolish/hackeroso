import { Suspense } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import StoryItem from '../../components/StoryItem'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface Comment {
  id: number;
  by: string;
  time: number;
  text: string;
  kids?: number[];
  kidsData?: Comment[];
}

interface Item {
  id: number;
  title?: string;
  url?: string;
  text?: string;
  by: string;
  time: number;
  score?: number;
  descendants?: number;
  kids?: number[];
}

function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000))
    if (hours === 0) {
      const minutes = Math.floor(diff / (60 * 1000))
      return `${minutes}m ago`
    }
    return `${hours}h ago`
  }

  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    return `${days}d ago`
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

async function fetchItem(id: string): Promise<Item> {
  const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
  if (!res.ok) throw new Error('Failed to fetch item')
  return res.json()
}

async function fetchComments(ids: number[]): Promise<Comment[]> {
  const comments = await Promise.all(
    ids.map(async (id) => {
      const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      if (!res.ok) throw new Error(`Failed to fetch comment ${id}`)
      const comment: Comment = await res.json()
      if (comment.kids) {
        comment.kidsData = await fetchComments(comment.kids)
      }
      return comment
    })
  )
  return comments
}

function Comment({ comment }: { comment: Comment }) {
  return (
    <div className="border-l-2 border-gray-200 dark:border-zinc-700 pl-4 mb-4">
      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
        <Link href={`/user/${comment.by}`} className="font-medium hover:text-orange-500 dark:hover:text-green-400">
          {comment.by}
        </Link>
        <span>{formatDate(comment.time)}</span>
      </div>
      <div 
        className="text-sm text-gray-700 dark:text-gray-300 mb-2"
        dangerouslySetInnerHTML={{ __html: comment.text }}
      />
      {comment.kidsData && comment.kidsData.length > 0 && (
        <div className="mt-2">
          {comment.kidsData.map((kidComment) => (
            <Comment key={kidComment.id} comment={kidComment} />
          ))}
        </div>
      )}
    </div>
  )
}

async function ItemContent({ id }: { id: string }) {
  const item = await fetchItem(id)
  const comments = item.kids ? await fetchComments(item.kids) : []

  return (
    <>
      <article className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 mb-8">
        <StoryItem story={item} viewMode="list" isSingleView={true} />
      </article>
      <div className="mb-8">
        <a
          href={`https://news.ycombinator.com/item?id=${item.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 dark:focus:ring-green-500 transition-colors duration-200"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          Comment on Hacker News
        </a>
      </div>
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Comments ({comments.length})
        </h2>
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </section>
    </>
  )
}

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ItemPage(props: PageProps) {
  const { id } = await props.params
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-zinc-900">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <ItemContent id={id} />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

