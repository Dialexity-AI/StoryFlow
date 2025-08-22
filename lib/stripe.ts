import Stripe from 'stripe'
import { prisma } from './prisma'
import { getCurrentUser } from './auth'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

export { stripe }

export interface CreateCheckoutSessionParams {
  priceId: string
  successUrl: string
  cancelUrl: string
  customerEmail?: string
  metadata?: Record<string, string>
}

export async function createCheckoutSession({
  priceId,
  successUrl,
  cancelUrl,
  customerEmail,
  metadata = {}
}: CreateCheckoutSessionParams) {
  try {
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      metadata,
    }

    // Add customer email if provided
    if (customerEmail) {
      sessionParams.customer_email = customerEmail
    }

    // Add current user's Stripe customer ID if available
    const user = await getCurrentUser()
    if (user?.stripeCustomerId) {
      sessionParams.customer = user.stripeCustomerId
    }

    const session = await stripe.checkout.sessions.create(sessionParams)
    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw error
  }
}

export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })
    return session
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    throw error
  }
}

export async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string
    const user = await prisma.user.findFirst({
      where: { stripeCustomerId: customerId }
    })

    if (!user) {
      console.error('User not found for customer:', customerId)
      return
    }

    // Update user premium status
    const isActive = subscription.status === 'active' || subscription.status === 'trialing'
    await prisma.user.update({
      where: { id: user.id },
      data: { premium: isActive }
    })

    // Update or create subscription record
    const planName = subscription.items.data[0]?.price.nickname || 'default'
    const existingSubscription = await prisma.subscription.findFirst({
      where: { stripeSubId: subscription.id }
    })

    if (existingSubscription) {
      await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          status: subscription.status,
          plan: planName,
          updatedAt: new Date()
        }
      })
    } else {
      await prisma.subscription.create({
        data: {
          stripeSubId: subscription.id,
          status: subscription.status,
          plan: planName,
          userId: user.id
        }
      })
    }
  } catch (error) {
    console.error('Error handling subscription update:', error)
    throw error
  }
}

export async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    const customerId = session.customer as string
    const email = session.customer_details?.email

    if (!customerId || !email) {
      console.error('Missing customer ID or email in checkout session')
      return
    }

    // Update user with Stripe customer ID and premium status
    await prisma.user.updateMany({
      where: { email },
      data: {
        stripeCustomerId: customerId,
        premium: true
      }
    })

    console.log(`User ${email} upgraded to premium`)
  } catch (error) {
    console.error('Error handling checkout completed:', error)
    throw error
  }
}

export function constructWebhookEvent(payload: string, signature: string, secret: string): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret)
}
