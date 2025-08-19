import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const url = new URL(req.url)
  const pathname = url.pathname
  const method = req.method
  const token = req.cookies.get('sf_token')?.value

  const requiresApiAuth = (
    (pathname.startsWith('/api/stories') && method === 'POST') ||
    (pathname.startsWith('/api/ratings') && method === 'POST')
  )

  if (requiresApiAuth && !token) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}


