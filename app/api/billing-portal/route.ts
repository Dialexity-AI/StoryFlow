import { NextRequest, NextResponse } from 'next/server'
import { createCustomerPortalSession } from '@/lib/stripe'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured' }, 
        { status: 500 }
      )
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    // Get current user
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' }, 
        { status: 401 }
      )
    }

    // Check if user has Stripe customer ID
    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No billing information found' }, 
        { status: 404 }
      )
    }

    // Create customer portal session
    const session = await createCustomerPortalSession(
      user.stripeCustomerId,
      `${siteUrl}/billing`
    )

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Billing portal error:', error)
    
    // Fallback for demo mode
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ 
        url: '/billing', 
        note: 'demo_fallback' 
      })
    }
    
    return NextResponse.json(
      { error: 'Failed to create billing portal session' }, 
      { status: 500 }
    )
  }
}
