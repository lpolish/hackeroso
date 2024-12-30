import Link from 'next/link'
import { Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="font-mono bg-background border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-xl font-bold text-primary">
              hackeroso
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              A modern Hacker News client with integrated task management.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="https://github.com/HackerNews/API" className="text-sm text-muted-foreground hover:text-primary">
                  Hacker News API
                </a>
              </li>
              <li>
                <a href="https://nextjs.org/" className="text-sm text-muted-foreground hover:text-primary">
                  Next.js
                </a>
              </li>
              <li>
                <a href="https://vercel.com/" className="text-sm text-muted-foreground hover:text-primary">
                  Vercel
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Connect</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="https://github.com/lpolish/hackeroso" className="text-sm text-muted-foreground hover:text-primary flex items-center">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://twitter.com/pulidoman" className="text-sm text-muted-foreground hover:text-primary flex items-center">
                  <Twitter className="w-4 h-4 mr-2" />
                  X
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-[0.6rem] leading-[0.75rem] text-gray-500 dark:text-gray-400">
            Privacy Notice: Hackeroso sources news from news.ycombinator.com using their API. We do not store any user information. 
            The task management feature operates locally, allowing users to export and import tasks without server-side storage. 
            Hackeroso is hosted on Vercel.com and utilizes v0.dev for web development. We are not affiliated or backed (yet) by Y Combinator, 
            Vercel, or any other mentioned entities. This project is for educational and demonstration purposes only.
          </p>
        </div>
      </div>
    </footer>
  )
}

