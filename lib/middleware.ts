import { NextRequest, NextResponse } from 'next/server'
import { verifyJwt } from './auth'

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string
    email: string
  }
}

export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const token = request.cookies.get('sf_token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const payload = verifyJwt<{ uid: string; email: string }>(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = {
      id: payload.uid,
      email: payload.email
    }

    return await handler(authenticatedRequest)
  } catch (error) {
    console.error('Auth middleware error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

export function withOptionalAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    const token = request.cookies.get('sf_token')?.value
    const authenticatedRequest = request as AuthenticatedRequest

    if (token) {
      const payload = verifyJwt<{ uid: string; email: string }>(token)
      if (payload) {
        authenticatedRequest.user = {
          id: payload.uid,
          email: payload.email
        }
      }
    }

    return handler(authenticatedRequest)
  } catch (error) {
    console.error('Optional auth middleware error:', error)
    return handler(request as AuthenticatedRequest)
  }
}
