import { Suspense } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import UserContent from './UserContent'
import { fetchUser, fetchItems } from '../../lib/api'
import { TaskProvider } from '../../contexts/TaskContext'

interface PageProps {
  params: { id: string };
}

export default async function UserPage({ params }: PageProps) {
  const { id } = params
  const user = await fetchUser(id)
  const submissions = user.submitted ? await fetchItems(user.submitted.slice(0, 30)) : []

  return (
    <TaskProvider>
      <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-zinc-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Suspense fallback={<div>Loading...</div>}>
              <UserContent user={user} submissions={submissions} />
            </Suspense>
          </div>
        </main>
        <Footer />
      </div>
    </TaskProvider>
  )
}

