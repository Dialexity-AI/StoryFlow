import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatReadTime(minutes: number): string {
  if (minutes < 1) {
    return '< 1 min read'
  }
  if (minutes === 1) {
    return '1 min read'
  }
  return `${minutes} min read`
}

export function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0
  const sum = ratings.reduce((acc, rating) => acc + rating, 0)
  return Math.round((sum / ratings.length) * 10) / 10
}

export function generateStoryId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function getGenreColor(genre: string): string {
  const colors: Record<string, string> = {
    'Science Fiction': 'bg-blue-100 text-blue-700',
    'Fantasy': 'bg-purple-100 text-purple-700',
    'Mystery': 'bg-gray-100 text-gray-700',
    'Romance': 'bg-pink-100 text-pink-700',
    'Adventure': 'bg-green-100 text-green-700',
    'Horror': 'bg-red-100 text-red-700',
    'Comedy': 'bg-yellow-100 text-yellow-700',
  }
  return colors[genre] || 'bg-secondary-100 text-secondary-700'
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function generateReadingProgress(currentPage: number, totalPages: number): number {
  return Math.round((currentPage / totalPages) * 100)
}

export function getReadingLevel(readTime: number): 'short' | 'medium' | 'long' {
  if (readTime <= 5) return 'short'
  if (readTime <= 15) return 'medium'
  return 'long'
}

export function sortStories(stories: any[], sortBy: string) {
  switch (sortBy) {
    case 'popular':
      return [...stories].sort((a, b) => b.views - a.views)
    case 'rating':
      return [...stories].sort((a, b) => b.rating - a.rating)
    case 'readTime':
      return [...stories].sort((a, b) => a.readTime - b.readTime)
    case 'latest':
    default:
      return [...stories].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  }
}
