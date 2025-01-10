import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { TaskProvider } from '../contexts/TaskContext'
import Header from '../components/Header'
import Footer from '../components/Footer'

const TaskManager = dynamic(() => import('../components/TaskManager'), {
  ssr: false,
  loading: () => <p>Loading...</p>
})

export const metadata = {
  title: 'Hackeroso | Task Manager',
  description: 'Manage your tasks and boost productivity with Hackeroso\'s integrated task management system.',
}

export default function TasksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-mono">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <TaskProvider>
          <Suspense fallback={<p>Loading...</p>}>
            <TaskManager />
          </Suspense>
        </TaskProvider>
      </main>
      <Footer />
    </div>
  )
}

