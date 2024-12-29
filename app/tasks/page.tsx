import React from 'react'
import { TaskProvider } from '../contexts/TaskContext'
import TaskManager from '../components/TaskManager'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Hackeroso | Task Manager',
  description: 'Manage your tasks and boost productivity with Hackeroso\'s integrated task management system.',
}

export default function TasksPage() {
  return (
    <TaskProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <TaskManager />
        </main>
        <Footer />
      </div>
    </TaskProvider>
  )
}

