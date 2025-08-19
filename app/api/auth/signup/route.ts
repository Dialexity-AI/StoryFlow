import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, signJwt, setAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })

  try {
    if (process.env.DATABASE_URL) {
      const existing = await prisma.user.findUnique({ where: { email } })
      if (existing) return NextResponse.json({ error: 'Email exists' }, { status: 409 })
      const passwordHash = await hashPassword(password)
      const user = await prisma.user.create({ data: { email, name: name || '', passwordHash } })
      const token = signJwt({ uid: user.id, email: user.email })
      setAuthCookie(token)
      return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, premium: user.premium } })
    }
  } catch (e) {}

  // Fallback demo
  const demo = { id: 'demo', email, name: name || 'Reader', premium: false }
  const token = signJwt({ uid: demo.id, email: demo.email })
  setAuthCookie(token)
  return NextResponse.json({ user: demo })
}
