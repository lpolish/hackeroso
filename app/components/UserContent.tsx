'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, FileText, LinkIcon, UserPlus, UserMinus, Users } from 'lucide-react'
import StoryItem from '../../components/StoryItem'
import { useTaskContext } from '../../contexts/TaskContext'
import { User, Item } from '../../types'
import { useToast } from "@/components/ui/use-toast"

interface UserContentProps {
  user: User;
  submissions: Item[];
}

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function UserContent({ user, submissions }: UserContentProps) {
  const { followers, followUser, unfollowUser } = useTaskContext()
  const [isFollowing, setIsFollowing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsFollowing(followers[user.id]?.includes('currentUser') || false)
  }, [followers, user.id])

  const comments = submissions.filter(item => item.type === 'comment')
  const stories = submissions.filter(item => item.type !== 'comment')

  const handleFollowToggle = () => {
    if (isFollowing) {
      unfollowUser(user.id)
      toast({
        title: "Unfollowed",
        description: `You are no longer following ${user.id}.`,
      })
    } else {
      followUser(user.id)
      toast({
        title: "Followed",
        description: `You are now following ${user.id}.`,
      })
    }
    setIsFollowing(!isFollowing)
  }

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
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={handleFollowToggle}
            className={`flex items-center gap-2 px-3 py-1 rounded-md ${
              isFollowing
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                : 'bg-orange-500 text-white hover:bg-orange-600 dark:bg-green-600 dark:hover:bg-green-700'
            }`}
          >
            {isFollowing ? (
              <>
                <UserMinus className="w-4 h-4" />
                Unfollow
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Follow
              </>
            )}
          </button>
        </div>
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
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <p>
            User information is sourced from Hacker News. The followers functionality
            is an added feature exclusive to Hackeroso and does not affect the original Hacker News profile.
          </p>
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

