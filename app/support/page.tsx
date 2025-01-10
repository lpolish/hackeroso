'use client'

import { useState } from 'react'
import SupportForm from '../components/SupportForm'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink, Github, Heart, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { DonationDialog } from '../components/DonationDialog'

export default function SupportPage() {
  const [showDonationDialog, setShowDonationDialog] = useState(false)
  return (
    <div className="min-h-screen flex flex-col bg-background font-mono">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Support Hackeroso</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl">About Hackeroso</CardTitle>
              <CardDescription>Learn more about our project and how to contribute</CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none font-mono">
              <p>
                Hackeroso is an open-source project aimed at providing a modern, feature-rich interface for Hacker News, trending GitHub repositories, and other tech-related sources, with integrated task management capabilities. Our goal is to enhance the tech news and project discovery experience while respecting the core values and communities of our sources.
              </p>
              <h3 className="text-xl font-semibold mt-4 mb-2">Key Features</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Modern, responsive interface for Hacker News content</li>
                <li>Integrated task management for saving and organizing stories</li>
                <li>Dark mode support for comfortable reading</li>
                <li>Enhanced search capabilities</li>
                <li>Customizable views and filters</li>
                <li>Integration of trending GitHub repositories and other tech news sources</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                Project Information
              </CardTitle>
              <CardDescription>Explore our GitHub repository and contribute</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Hackeroso is open-source and we welcome contributions from the community. Whether you're fixing bugs, adding features, improving documentation, or providing financial support, your help is greatly appreciated!
              </p>
              <div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowDonationDialog(true)}
                  className="group mb-2"
                >
                  <Heart className="w-4 h-4 mr-2 text-orange-500 dark:text-green-500 group-hover:animate-pulse" />
                  Support this project
                </Button>
                <h3 className="font-semibold mb-2 mt-2">Useful Links:</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="https://github.com/lpolish/hackeroso" className="flex items-center text-primary hover:underline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      GitHub Repository
                    </Link>
                  </li>
                  <li>
                    <Link href="https://github.com/lpolish/hackeroso/issues" className="flex items-center text-primary hover:underline">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Report a Bug or Request a Feature
                    </Link>
                  </li>
                  <li>
                    <Link href="https://github.com/lpolish/hackeroso/blob/master/CONTRIBUTING.md" className="flex items-center text-primary hover:underline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Contribution Guidelines
                    </Link>
                  </li>
                </ul>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Your support, whether through contributions, spreading the word, or financial assistance, is greatly appreciated and helps keep Hackeroso running and improving.
                  </p>
                  <a href="https://www.producthunt.com/posts/hackeroso?embed=true&utm_source=badge-featured&utm_medium=badge&utm_souce=badge-hackeroso" target="_blank" rel="noopener noreferrer">
                    <img 
                      src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=749234&theme=light&t=1736465562567" 
                      alt="Hackeroso - Enjoy hacker news, set them tasks, get things done | Product Hunt" 
                      style={{ width: '200px', height: 'auto' }} 
                      width="200" 
                      height="43"
                    />
                  </a>
                </div>
              </div>
              <DonationDialog open={showDonationDialog} onOpenChange={setShowDonationDialog} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Contact Us
              </CardTitle>
              <CardDescription>Have a question or feedback? Let us know!</CardDescription>
            </CardHeader>
            <CardContent>
              <SupportForm />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

