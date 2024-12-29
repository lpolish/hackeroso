import Link from 'next/link'
import { Github, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
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
                <a href="https://instagram.com/lu1s0n1" className="text-sm text-muted-foreground hover:text-primary flex items-center">
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} hackeroso. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <p className="text-xs text-muted-foreground">
              Powered by <a href="https://vercel.com/" className="hover:text-primary">Vercel</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

