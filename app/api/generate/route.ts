import { NextRequest, NextResponse } from 'next/server'

export interface GenerateStoryRequest {
  genre: string
  length: 'short' | 'medium' | 'long'
  style?: string
  prompt?: string
}

export interface GenerateStoryResponse {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  genre: string
  length: string
  readTime: number
  tags: string[]
  createdAt: string
}

// Mock AI generation function - will be replaced with actual AI integration
async function generateStoryWithAI(params: GenerateStoryRequest): Promise<GenerateStoryResponse> {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))
  
  const { genre, length, style, prompt } = params
  
  // Generate story based on parameters
  const storyTemplates = {
    short: {
      readTime: 3,
      contentLength: 'short',
      chapters: 1
    },
    medium: {
      readTime: 8,
      contentLength: 'medium', 
      chapters: 2
    },
    long: {
      readTime: 15,
      contentLength: 'long',
      chapters: 3
    }
  }
  
  const template = storyTemplates[length]
  
  // Generate story content based on genre and length
  const storyContent = generateStoryContent(genre, template, prompt)
  
  return {
    id: `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: storyContent.title,
    content: storyContent.content,
    excerpt: storyContent.excerpt,
    author: 'AI StoryFlow',
    genre,
    length,
    readTime: template.readTime,
    tags: storyContent.tags,
    createdAt: new Date().toISOString()
  }
}

function generateStoryContent(genre: string, template: any, prompt?: string): any {
  const titles: Record<string, string[]> = {
    'Science Fiction': [
      'The Quantum Paradox',
      'Neon Dreams',
      'Starship Odyssey',
      'Digital Consciousness',
      'Time Loop Protocol'
    ],
    'Fantasy': [
      'The Dragon\'s Heart',
      'Mystic Academy',
      'Shadow Realm',
      'Crystal Kingdom',
      'Ancient Prophecy'
    ],
    'Mystery': [
      'The Vanishing Hour',
      'Silent Witness',
      'Dark Alleys',
      'Hidden Truths',
      'The Last Clue'
    ],
    'Romance': [
      'Love in the Digital Age',
      'Heartstrings',
      'Second Chances',
      'Unexpected Love',
      'Forever Yours'
    ],
    'Horror': [
      'Whispers in the Dark',
      'The Haunting',
      'Shadow Man',
      'Cursed House',
      'Night Terrors'
    ],
    'Adventure': [
      'Lost Expedition',
      'Treasure Hunt',
      'Dangerous Quest',
      'Wild Frontier',
      'Mystery Island'
    ]
  }
  
  const title = titles[genre]?.[Math.floor(Math.random() * titles[genre].length)] || 'Untitled Story'
  
  // Generate content based on length
  let content = ''
  let excerpt = ''
  
  if (template.contentLength === 'short') {
    content = generateShortContent(genre, title)
    excerpt = content.substring(0, 150) + '...'
  } else if (template.contentLength === 'medium') {
    content = generateMediumContent(genre, title)
    excerpt = content.substring(0, 200) + '...'
  } else {
    content = generateLongContent(genre, title)
    excerpt = content.substring(0, 250) + '...'
  }
  
  const tags = generateTags(genre, template.contentLength)
  
  return { title, content, excerpt, tags }
}

function generateShortContent(genre: string, title: string): string {
  const templates: Record<string, string> = {
    'Science Fiction': `
      <h2>${title}</h2>
      <p>In the year 2157, humanity stood at the brink of a new era. The discovery of quantum technology had opened doors to possibilities that seemed impossible just decades ago.</p>
      <p>Dr. Sarah Chen stared at the holographic display floating before her, her mind racing with the implications of what she had just discovered. The quantum computer had processed data in ways that defied conventional physics.</p>
      <p>"This changes everything," she whispered to herself, knowing that her discovery would either save humanity or destroy it.</p>
    `,
    'Fantasy': `
      <h2>${title}</h2>
      <p>The ancient forest whispered secrets to those who knew how to listen. Young mage Elena had spent years learning the language of the trees, and now they were calling her name.</p>
      <p>As she stepped deeper into the mystical grove, the air around her began to shimmer with magical energy. The trees seemed to bend and sway in a dance that had been performed for centuries.</p>
      <p>Elena knew that her destiny awaited her in the heart of the forest, where the ancient magic still lived and breathed.</p>
    `,
    'Mystery': `
      <h2>${title}</h2>
      <p>Detective Marcus Black had seen many strange cases in his twenty years on the force, but nothing like this. The crime scene was perfect—too perfect.</p>
      <p>Every detail had been meticulously arranged, as if the perpetrator wanted to be caught. But why? Marcus walked through the apartment, his trained eye picking up on subtle clues that others might miss.</p>
      <p>Something about this case felt personal, as if the killer was sending him a message.</p>
    `
  }
  
  return templates[genre] || `
    <h2>${title}</h2>
    <p>This is a story about ${genre.toLowerCase()}. The characters find themselves in an unexpected situation that will change their lives forever.</p>
    <p>As the plot unfolds, they must make difficult decisions and face challenges that test their courage and determination.</p>
    <p>In the end, they discover that sometimes the greatest adventures are the ones we never planned for.</p>
  `
}

function generateMediumContent(genre: string, title: string): string {
  return generateShortContent(genre, title) + `
    <h3>Chapter 2: The Discovery</h3>
    <p>As the story continued, new revelations came to light. The characters found themselves deeper in the mystery than they had ever imagined.</p>
    <p>Each decision they made seemed to lead them further down a path they couldn't escape from. The stakes were higher than anyone had realized.</p>
    <p>But with great challenges came great opportunities, and the heroes of our story were about to discover their true potential.</p>
  `
}

function generateLongContent(genre: string, title: string): string {
  return generateMediumContent(genre, title) + `
    <h3>Chapter 3: The Resolution</h3>
    <p>The final chapter brought all the threads of the story together. Years of preparation and countless sacrifices had led to this moment.</p>
    <p>The characters faced their greatest challenge yet, knowing that failure was not an option. The fate of everything they held dear rested in their hands.</p>
    <p>In the end, they learned that true strength comes not from power or wealth, but from the bonds of friendship and the courage to face the unknown.</p>
  `
}

function generateTags(genre: string, length: string): string[] {
  const baseTags = [genre.toLowerCase(), length]
  const additionalTags: Record<string, string[]> = {
    'Science Fiction': ['future', 'technology', 'space', 'ai'],
    'Fantasy': ['magic', 'adventure', 'quest', 'mythical'],
    'Mystery': ['detective', 'crime', 'suspense', 'investigation'],
    'Romance': ['love', 'relationships', 'emotions', 'heart'],
    'Horror': ['fear', 'supernatural', 'dark', 'thriller'],
    'Adventure': ['exploration', 'journey', 'discovery', 'action']
  }
  
  return [...baseTags, ...(additionalTags[genre] || [])]
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateStoryRequest = await request.json()
    
    // Validate request
    if (!body.genre || !body.length) {
      return NextResponse.json(
        { error: 'Genre and length are required' },
        { status: 400 }
      )
    }
    
    // If external AI server is configured, forward the request there
    const aiServerUrl = process.env.AI_SERVER_URL
    if (aiServerUrl) {
      try {
        const res = await fetch(`${aiServerUrl.replace(/\/$/, '')}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          const data = await res.json()
          return NextResponse.json(data)
        }
      } catch (err) {
        // Fallback to local mock if external call fails
      }
    }
    
    // Generate story
    const story = await generateStoryWithAI(body)
    
    return NextResponse.json(story)
  } catch (error) {
    console.error('Error generating story:', error)
    return NextResponse.json(
      { error: 'Failed to generate story' },
      { status: 500 }
    )
  }
}
