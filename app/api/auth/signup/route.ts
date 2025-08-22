import { NextRequest, NextResponse } from 'next/server'
import { createUser, signJwt, setAuthCookie } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' }, 
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' }, 
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' }, 
        { status: 400 }
      )
    }

    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      // Fallback demo mode
      const demo = { id: 'demo', email, name: name || 'Demo Reader', premium: false }
      const token = signJwt({ uid: demo.id, email: demo.email })
      setAuthCookie(token)
      return NextResponse.json({ user: demo })
    }

    // Create user
    const user = await createUser(email, password, name)
    
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

  } catch (error: any) {
    console.error('Signup error:', error)
    
    // Handle specific database errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' }, 
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
