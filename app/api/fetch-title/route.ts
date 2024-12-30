import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    const title = $('title').text() || $('h1').first().text() || ''

    return NextResponse.json({ title: title.trim() })
  } catch (error) {
    console.error('Error fetching title:', error)
    return NextResponse.json({ error: 'Failed to fetch title' }, { status: 500 })
  }
}

