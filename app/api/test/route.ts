import { NextResponse } from 'next/server'

export async function GET() {
  const currentTime = new Date().toISOString();
  return NextResponse.json({ 
    message: 'API is working',
    timestamp: currentTime,
    environment: process.env.NODE_ENV
  });
}

