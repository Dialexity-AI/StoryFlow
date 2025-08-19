import { NextResponse } from 'next/server'
import { getTokenFromCookie, verifyJwt } from '@/lib/auth'

export async function GET() {
  const token = getTokenFromCookie()
  if (!token) return NextResponse.json({ user: null })
  const payload = verifyJwt<any>(token)
  if (!payload) return NextResponse.json({ user: null })
  return NextResponse.json({ user: { id: payload.uid, email: payload.email } })
}
