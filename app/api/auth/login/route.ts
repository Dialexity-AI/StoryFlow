import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, signJwt, setAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' }, 
        { status: 400 }
      )
    }

    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      // Fallback demo mode
      const demo = { id: 'demo', email, name: 'Demo Reader', premium: false }
      const token = signJwt({ uid: demo.id, email: demo.email })
      setAuthCookie(token)
      return NextResponse.json({ user: demo })
    }

    // Authenticate user
    const user = await authenticateUser(email, password)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' }, 
        { status: 401 }
      )
    }

    // Create JWT token
    const token = signJwt({ uid: user.id, email: user.email })
    setAuthCookie(token)

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        premium: user.premium
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
