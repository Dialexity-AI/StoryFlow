import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withAuth, withOptionalAuth, AuthenticatedRequest } from '@/lib/middleware'

let memoryStories: any[] = []

export async function GET(req: NextRequest) {
  return withOptionalAuth(req, async (authenticatedReq: AuthenticatedRequest) => {
    try {
      const { searchParams } = new URL(authenticatedReq.url)
      const q = searchParams.get('q')?.toLowerCase() || ''
      const length = searchParams.get('length') || ''
      const genre = searchParams.get('genre') || ''

      if (process.env.DATABASE_URL) {
        const where: any = { published: true }
        
        if (genre) where.genre = genre
        if (length) where.length = length
        if (q) {
          where.OR = [
            { title: { contains: q, mode: 'insensitive' } },
            { excerpt: { contains: q, mode: 'insensitive' } },
            { author: { contains: q, mode: 'insensitive' } },
          ]
        }

        // Filter premium content based on user status
        if (!authenticatedReq.user) {
          where.isPremium = false
        } else {
          const user = await prisma.user.findUnique({
            where: { id: authenticatedReq.user.id },
            select: { premium: true }
          })
          if (!user?.premium) {
            where.isPremium = false
          }
        }

        const items = await prisma.story.findMany({ 
          where, 
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        })
        
        return NextResponse.json({ items })
      }

      // Fallback to memory storage
      let items = memoryStories.filter(s => s.published !== false)
      
      if (q) {
        items = items.filter((s) => 
          s.title.toLowerCase().includes(q) || 
          s.excerpt.toLowerCase().includes(q)
        )
      }
      if (length) items = items.filter((s) => s.length === length)
      if (genre) items = items.filter((s) => s.genre === genre)

      return NextResponse.json({ items })

    } catch (error) {
      console.error('Error fetching stories:', error)
      return NextResponse.json(
        { error: 'Failed to fetch stories' },
        { status: 500 }
      )
    }
  })
}

export async function POST(req: NextRequest) {
  return withAuth(req, async (authenticatedReq: AuthenticatedRequest) => {
    try {
      const body = await req.json()
      
      // Validate required fields
      if (!body.title || !body.content || !body.genre) {
        return NextResponse.json(
          { error: 'Title, content, and genre are required' },
          { status: 400 }
        )
      }

      if (process.env.DATABASE_URL) {
        const story = await prisma.story.create({
          data: {
            title: body.title,
            excerpt: body.excerpt || body.content.substring(0, 200) + '...',
            content: body.content,
            author: body.author || 'Anonymous',
            genre: body.genre,
            length: body.length || 'medium',
            readTime: body.readTime ?? 5,
            tags: body.tags ?? [],
            views: 0,
            likes: 0,
            isPremium: body.isPremium ?? false,
            published: body.published ?? false,
            userId: authenticatedReq.user!.id,
          }
        })
        
        return NextResponse.json({ story })
      }

      // Fallback to memory storage
      const story = {
        id: `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        userId: authenticatedReq.user!.id,
        ...body
      }
      memoryStories.unshift(story)
      
      return NextResponse.json({ story })

    } catch (error) {
      console.error('Error creating story:', error)
      return NextResponse.json(
        { error: 'Failed to create story' },
        { status: 500 }
      )
    }
  })
}
