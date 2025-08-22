import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession } from '@/lib/stripe'
import { getCurrentUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json()
    
    // Validate price ID
    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' }, 
        { status: 400 }
      )
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured' }, 
        { status: 500 }
      )
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    // Get current user for customer email
    const user = await getCurrentUser()
    
    // Create checkout session
    const session = await createCheckoutSession({
      priceId,
      successUrl: `${siteUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${siteUrl}/billing/cancel`,
      customerEmail: user?.email,
      metadata: {
        userId: user?.id || 'anonymous'
      }
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error('Checkout error:', error)
    
    // Fallback for demo mode
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ 
        url: '/premium?success=1', 
        note: 'demo_fallback' 
      })
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' }, 
      { status: 500 }
    )
  }
}
