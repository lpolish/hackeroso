import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')
  const page = searchParams.get('page') || '0'

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `http://hn.algolia.com/api/v1/search?query=${encodeURIComponent(query)}&page=${page}`
    )

    if (!response.ok) {
      throw new Error('Failed to fetch from Hacker News API')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching search results:', error)
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 })
  }
}

