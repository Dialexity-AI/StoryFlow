import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, signJwt, setAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })

  try {
    if (process.env.DATABASE_URL) {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user || !user.passwordHash) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      const ok = await verifyPassword(password, user.passwordHash)
      if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      const token = signJwt({ uid: user.id, email: user.email })
      setAuthCookie(token)
      return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, premium: user.premium } })
    }
  } catch (e) {}

  const demo = { id: 'demo', email, name: 'Reader', premium: false }
  const token = signJwt({ uid: demo.id, email: demo.email })
  setAuthCookie(token)
  return NextResponse.json({ user: demo })
}
