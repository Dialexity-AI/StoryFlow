export interface Story {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  genre: string
  rating: number
  readTime: number
  views: number
  likes: number
  isLiked?: boolean
  isBookmarked?: boolean
  userRating?: number
  coverImage?: string
  isPremium?: boolean
  publishedAt: string
  tags: string[]
}

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  isPremium: boolean
  subscriptionTier: 'free' | 'premium' | 'pro'
  createdAt: string
  lastLoginAt: string
}

export interface Rating {
  id: string
  storyId: string
  userId: string
  rating: number
  comment?: string
  createdAt: string
}

export interface Category {
  id: string
  name: string
  count: number
  description?: string
}

export interface SearchFilters {
  query: string
  genre: string
  sortBy: 'latest' | 'popular' | 'rating' | 'readTime'
  minRating?: number
  maxReadTime?: number
  isPremium?: boolean
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  period: 'monthly' | 'yearly'
  features: string[]
  limitations?: string[]
  popular?: boolean
}

export interface AIStoryGenerationRequest {
  genre: string
  length: 'short' | 'medium' | 'long'
  style: string
  theme?: string
  targetAudience?: string
}

export interface AIStoryGenerationResponse {
  story: Story
  model: string
  generationTime: number
  tokensUsed: number
}
