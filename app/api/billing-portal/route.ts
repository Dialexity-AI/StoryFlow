import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  try {
    if (secretKey) {
      const { customerId } = await req.json()
      if (customerId) {
        const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' })
        const session = await stripe.billingPortal.sessions.create({
          customer: customerId,
          return_url: `${siteUrl}/billing`,
        })
        return NextResponse.json({ url: session.url })
      }
    }
  } catch {}

  // Fallback demo
  return NextResponse.json({ url: '/billing' })
}
