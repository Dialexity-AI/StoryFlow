import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ ok: true, note: 'webhook_secret_missing' })
  }

  const rawBody = await req.text()
  const signature = req.headers.get('stripe-signature') || ''

  let event: Stripe.Event
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' })
    event = stripe.webhooks.constructEvent(rawBody, signature, secret)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerId = (session.customer as string) || null
        const email = session.customer_details?.email || null
        if (email && customerId) {
          await prisma.user.updateMany({ where: { email }, data: { stripeCustomerId: customerId, premium: true } })
        }
        break
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const sub = event.data.object as Stripe.Subscription
        const customerId = (sub.customer as string) || null
        if (customerId) {
          const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } })
          if (user) {
            await prisma.user.update({ where: { id: user.id }, data: { premium: sub.status === 'active' || sub.status === 'trialing' } })
            const existing = await prisma.subscription.findFirst({ where: { stripeSubId: sub.id } })
            const planName = sub.items.data[0]?.price.nickname || 'default'
            if (existing) {
              await prisma.subscription.update({ where: { id: existing.id }, data: { status: sub.status, plan: planName } })
            } else {
              await prisma.subscription.create({ data: { stripeSubId: sub.id, status: sub.status, plan: planName, userId: user.id } })
            }
          }
        }
        break
      }
      default:
        break
    }
  } catch {}

  return NextResponse.json({ received: true })
}


