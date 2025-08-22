import { NextRequest, NextResponse } from 'next/server'
import { 
  constructWebhookEvent, 
  handleCheckoutCompleted, 
  handleSubscriptionUpdate 
} from '@/lib/stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  
  if (!secret) {
    console.warn('Stripe webhook secret not configured')
    return NextResponse.json({ ok: true, note: 'webhook_secret_missing' })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('Stripe secret key not configured')
    return NextResponse.json({ ok: true, note: 'stripe_not_configured' })
  }

  try {
    const rawBody = await req.text()
    const signature = req.headers.get('stripe-signature') || ''

    // Verify webhook signature
    let event
    try {
      event = constructWebhookEvent(rawBody, signature, secret)
    } catch (err) {
      console.error('Invalid webhook signature:', err)
      return NextResponse.json(
        { error: 'Invalid signature' }, 
        { status: 400 }
      )
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        await handleCheckoutCompleted(session)
        console.log('Checkout completed for session:', session.id)
        break
      }
      
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        await handleSubscriptionUpdate(subscription)
        console.log(`Subscription ${event.type} for subscription:`, subscription.id)
        break
      }
      
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any
        console.log('Payment succeeded for invoice:', invoice.id)
        break
      }
      
      case 'invoice.payment_failed': {
        const invoice = event.data.object as any
        console.log('Payment failed for invoice:', invoice.id)
        break
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' }, 
      { status: 500 }
    )
  }
}


