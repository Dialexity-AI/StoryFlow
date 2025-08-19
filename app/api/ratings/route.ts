import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromCookie, verifyJwt } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { storyId, score } = await req.json()
  if (!storyId || typeof score === 'undefined') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  // Require auth
  const token = getTokenFromCookie()
  const payload = token ? verifyJwt<any>(token) : null
  if (!payload?.uid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    if (process.env.DATABASE_URL) {
      await prisma.rating.upsert({
        where: { userId_storyId: { userId: payload.uid, storyId } },
        update: { score: Number(score) },
        create: { userId: payload.uid, storyId, score: Number(score) },
      })

      const agg = await prisma.rating.aggregate({
        where: { storyId },
        _avg: { score: true },
        _count: { _all: true },
      })
      const avg = agg._avg.score || 0
      const rating = Math.round(avg * 10) / 10
      const count = agg._count._all || 0
      return NextResponse.json({ rating, count })
    }
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save rating' }, { status: 500 })
  }

  // Fallback in-memory (unauth)
  return NextResponse.json({ rating: Number(score), count: 1 })
}
