'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Github, Twitter, Heart, HelpCircle, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { DonationDialog } from "./DonationDialog"
import { Separator } from "@/components/ui/separator"

export default function Footer({ className = '', isMobileMenu = false }: { className?: string, isMobileMenu?: boolean }) {
  const [showDonationDialog, setShowDonationDialog] = useState(false)

  return (
    <footer className={`font-mono bg-background ${!isMobileMenu && 'border-t border-border'} ${className}`}>
      {isMobileMenu ? (
        <div className="px-4 py-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">hackeroso</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Organize Hacker News and Trends. Keep them private.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDonationDialog(true)}
            className="w-full group"
          >
            <Heart className="w-4 h-4 mr-2 text-orange-500 dark:text-green-500 group-hover:animate-pulse" />
            Support this project
          </Button>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://github.com/HackerNews/API" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Hacker News API
                  </a>
                </li>
                <li>
                  <a 
                    href="https://nextjs.org/" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Next.js
                  </a>
                </li>
                <li>
                  <a 
                    href="https://vercel.com/" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Vercel
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://github.com/lpolish/hackeroso" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </li>
                <li>
                  <a 
                    href="https://twitter.com/pulidoman" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                  >
                    <Twitter className="w-4 h-4" />
                    X
                  </a>
                </li>
                <li>
                  <Link 
                    href="/support" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-[0.6rem] leading-[0.75rem] text-muted-foreground">
            Privacy Notice: Hackeroso sources news from news.ycombinator.com using their API. We do not store any user information. 
            The task management feature operates locally, allowing users to export and import tasks without server-side storage. 
            Hackeroso is hosted on Vercel.com and utilizes v0.dev for web development. We are not affiliated or backed (yet) by Y Combinator, 
            Vercel, or any other mentioned entities. This project is for educational and demonstration purposes only.
            <Link
              href="/privacy"
              className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors ml-1"
            >
              Privacy Policy
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>
      ) : (
        // Existing desktop footer content
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Main column */}
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div>
                <Link href="/" className="text-xl font-bold text-primary inline-flex items-center gap-2">
                  hackeroso
                </Link>
                <p className="mt-3 text-sm text-muted-foreground">
                  Organize Hacker News and Trends. Keep them private.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Created by</div>
                  <a 
                    href="https://luispulido.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Luis Pulido
                  </a>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium">Other projects</div>
                  <div className="space-y-1">
                    <a 
                      href="https://marcaja.hackeroso.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Free image watermarker
                    </a>
                    <a 
                      href="https://tetris.hackeroso.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      Cool Tetris
                    </a>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowDonationDialog(true)}
                  className="group"
                >
                  <Heart className="w-4 h-4 mr-2 text-orange-500 dark:text-green-500 group-hover:animate-pulse" />
                  Support this project
                </Button>
              </div>
            </div>

            {/* Resources column */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://github.com/HackerNews/API" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Hacker News API
                  </a>
                </li>
                <li>
                  <a 
                    href="https://nextjs.org/" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Next.js
                  </a>
                </li>
                <li>
                  <a 
                    href="https://vercel.com/" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Vercel
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect column */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Connect</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="https://github.com/lpolish/hackeroso" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </li>
                <li>
                  <a 
                    href="https://twitter.com/pulidoman" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                  >
                    <Twitter className="w-4 h-4" />
                    X
                  </a>
                </li>
                <li>
                  <Link 
                    href="/support" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4" />
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="text-[0.6rem] leading-[0.75rem] text-muted-foreground max-w-[85ch]">
            Privacy Notice: Hackeroso sources news from news.ycombinator.com using their API. We do not store any user information. 
            The task management feature operates locally, allowing users to export and import tasks without server-side storage. 
            Hackeroso is hosted on Vercel.com and utilizes v0.dev for web development. We are not affiliated or backed (yet) by Y Combinator, 
            Vercel, or any other mentioned entities. This project is for educational and demonstration purposes only.
            <Link
              href="/privacy"
              className="inline-flex items-center text-xs text-muted-foreground hover:text-primary transition-colors ml-1"
            >
              Privacy Policy
              <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>
      )}

      <DonationDialog 
        open={showDonationDialog} 
        onOpenChange={setShowDonationDialog} 
      />
    </footer>
  )
}

