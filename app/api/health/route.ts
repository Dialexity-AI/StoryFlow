import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      stripe: 'unknown'
    },
    environment: process.env.NODE_ENV || 'development'
  }

  try {
    // Check database connection
    if (process.env.DATABASE_URL) {
      await prisma.$queryRaw`SELECT 1`
      health.services.database = 'connected'
    } else {
      health.services.database = 'not_configured'
    }
  } catch (error) {
    health.services.database = 'error'
    health.status = 'error'
  }

  // Check Stripe configuration
  if (process.env.STRIPE_SECRET_KEY) {
    health.services.stripe = 'configured'
  } else {
    health.services.stripe = 'not_configured'
  }

  const statusCode = health.status === 'ok' ? 200 : 503

  return NextResponse.json(health, { status: statusCode })
}
