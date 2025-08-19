import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PRICE_ID
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  if (secretKey && priceId) {
    try {
      const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' })
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${siteUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/billing/cancel`,
        allow_promotion_codes: true,
      })
      return NextResponse.json({ url: session.url })
    } catch (e) {
      return NextResponse.json({ url: '/premium?success=1', note: 'stripe_error_fallback' })
    }
  }

  // Fallback demo
  return NextResponse.json({ url: '/premium?success=1', note: 'demo_fallback' })
}
