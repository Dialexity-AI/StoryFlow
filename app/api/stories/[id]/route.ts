import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

let memoryStories: any[] = []

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    if (process.env.DATABASE_URL) {
      const story = await prisma.story.findUnique({ where: { id } })
      if (!story) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json({ story })
    }
  } catch {}

  const story = memoryStories.find((s) => s.id === id)
  if (!story) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ story })
}
