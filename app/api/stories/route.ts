import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromCookie, verifyJwt } from '@/lib/auth'

let memoryStories: any[] = []

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.toLowerCase() || ''
  const length = searchParams.get('length') || ''
  const genre = searchParams.get('genre') || ''

  try {
    if (process.env.DATABASE_URL) {
      const where: any = {}
      if (genre) where.genre = genre
      if (length) where.length = length
      if (q) {
        where.OR = [
          { title: { contains: q, mode: 'insensitive' } },
          { excerpt: { contains: q, mode: 'insensitive' } },
          { author: { contains: q, mode: 'insensitive' } },
        ]
      }
      const items = await prisma.story.findMany({ where, orderBy: { createdAt: 'desc' } })
      return NextResponse.json({ items })
    }
  } catch {}

  let items = memoryStories
  if (q) items = items.filter((s) => s.title.toLowerCase().includes(q) || s.excerpt.toLowerCase().includes(q))
  if (length) items = items.filter((s) => s.length === length)
  if (genre) items = items.filter((s) => s.genre === genre)

  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  try {
    if (process.env.DATABASE_URL) {
      // Require auth
      const token = getTokenFromCookie()
      const payload = token ? verifyJwt<any>(token) : null
      if (!payload?.uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      const story = await prisma.story.create({ data: {
        title: body.title,
        excerpt: body.excerpt,
        content: body.content,
        author: body.author,
        genre: body.genre,
        length: body.length,
        readTime: body.readTime ?? 5,
        tags: body.tags ?? [],
        views: body.views ?? 0,
        likes: body.likes ?? 0,
        isPremium: body.isPremium ?? false,
        user: { connect: { id: payload.uid } },
      }})
      return NextResponse.json({ story })
    }
  } catch {}

  const story = { id: body.id || `${Date.now()}`, createdAt: new Date().toISOString(), ...body }
  memoryStories.unshift(story)
  return NextResponse.json({ story })
}
