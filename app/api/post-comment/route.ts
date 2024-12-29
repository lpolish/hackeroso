import { NextResponse } from 'next/server'
import { postComment } from '@/app/actions/commentActions'

export async function POST(request: Request) {
  const { itemId, text } = await request.json()

  try {
    const result = await postComment(itemId, text)
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 400 })
    }
  }
}

