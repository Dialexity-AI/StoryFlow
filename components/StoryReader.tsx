'use client'

import { useEffect, useState } from 'react'
import { ArrowLeftIcon, HeartIcon, StarIcon, ShareIcon, BookmarkIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

interface StoryReaderProps {
  storyId: string
}

// Mock story data - in real app this would come from API
const mockStory = {
  id: '1',
  title: 'The Last Starship',
  author: 'AI Author Alpha',
  genre: 'Science Fiction',
  rating: 4.8,
  readTime: 12,
  views: 15420,
  likes: 892,
  isLiked: false,
  isBookmarked: false,
  userRating: 0,
  content: `
    <h2>Chapter 1: The Discovery</h2>
    <p>In the year 2157, humanity's last hope lay floating in the cold void of deep space. Captain Sarah Chen stared through the reinforced glass of her observation deck, her breath fogging the surface as she contemplated the mysterious vessel that had appeared on their long-range scanners.</p>
    
    <p>The starship was unlike anything she had ever seen. Its sleek, obsidian hull seemed to absorb the starlight rather than reflect it, and the subtle blue glow emanating from its engines suggested technology far beyond anything humanity had developed.</p>
    
    <p>"Captain, we're receiving a transmission," Lieutenant Marcus called from the communications station. "But it's not in any language we recognize."</p>
    
    <p>Sarah's heart raced as she made her way to the bridge. This could be humanity's salvation—or its doom. The fate of billions rested on her next decision.</p>

    <h2>Chapter 2: First Contact</h2>
    <p>The transmission crackled through the speakers, a series of complex mathematical patterns that seemed to pulse with an almost organic rhythm. Dr. Elena Rodriguez, the ship's xenolinguist, worked frantically at her console, her fingers flying over the holographic interface.</p>
    
    <p>"I think I'm getting somewhere," she muttered, her eyes never leaving the screen. "The patterns... they're not just language. They're instructions."</p>
    
    <p>Sarah leaned over her shoulder, watching as the alien symbols began to resolve into something resembling human text. The message was simple, yet profound: "We have been waiting for you."</p>
    
    <p>The crew exchanged nervous glances. Who were these beings? What did they want? And most importantly, could they be trusted?</p>

    <h2>Chapter 3: The Truth Revealed</h2>
    <p>As the alien vessel docked with their ship, Sarah prepared for the most important meeting in human history. The airlock hissed open, revealing a figure that defied all expectations.</p>
    
    <p>The being was humanoid, but its skin shimmered with an iridescent quality that seemed to shift colors in the light. Its eyes held an ancient wisdom that spoke of civilizations that had risen and fallen across millennia.</p>
    
    <p>"I am Ambassador Zara," the being said, its voice resonating with an otherworldly timbre. "We are the last of our kind, just as you are the last of yours."</p>
    
    <p>The revelation hit Sarah like a physical blow. Humanity wasn't alone in its struggle for survival. The universe itself was dying, and only by working together could either species hope to survive.</p>
  `,
  publishedAt: '2024-01-15',
  tags: ['space', 'adventure', 'first-contact', 'survival'],
}

export default function StoryReader({ storyId }: StoryReaderProps) {
  const [isLiked, setIsLiked] = useState(mockStory.isLiked)
  const [isBookmarked, setIsBookmarked] = useState(mockStory.isBookmarked)
  const [userRating, setUserRating] = useState(mockStory.userRating)
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrollTop = el.scrollTop
      const height = el.scrollHeight - el.clientHeight
      const p = height > 0 ? Math.min(100, Math.max(0, (scrollTop / height) * 100)) : 0
      setProgress(p)
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  const handleRating = (rating: number) => {
    setUserRating(rating)
    setShowRatingModal(false)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: mockStory.title,
        text: `Check out this amazing story: ${mockStory.title}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // Show toast notification
    }
  }

  return (
    <div className="max-w-4xl mx-auto page-transition">
      {/* Reading progress */}
      <div className="sticky top-[64px] z-30 h-1 bg-secondary-200/60 rounded-full overflow-hidden mb-4">
        <div className="h-full bg-primary-600 transition-[width] duration-200" style={{ width: `${progress}%` }} />
      </div>

      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/library" 
          className="inline-flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-all duration-300 hover-lift"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Library</span>
        </Link>
      </div>

      {/* Story Header */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                {mockStory.genre}
              </span>
              <span className="text-secondary-500 text-sm">
                {mockStory.readTime} min read
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              {mockStory.title}
            </h1>
            
            <p className="text-secondary-600 mb-6">
              by <span className="font-medium">{mockStory.author}</span>
            </p>

            <div className="flex items-center space-x-6 text-sm text-secondary-500">
              <div className="flex items-center">
                <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                <span>{mockStory.rating.toFixed(1)}</span>
              </div>
              <div>{mockStory.views.toLocaleString()} views</div>
              <div>{mockStory.likes} likes</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleLike}
              className={`p-3 rounded-lg transition-all duration-300 hover-lift ${
                isLiked 
                  ? 'bg-red-50 text-red-600 hover-glow' 
                  : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
              }`}
            >
              {isLiked ? (
                <HeartSolidIcon className="h-5 w-5" />
              ) : (
                <HeartIcon className="h-5 w-5" />
              )}
            </button>
            
            <button
              onClick={handleBookmark}
              className={`p-3 rounded-lg transition-all duration-300 hover-lift ${
                isBookmarked 
                  ? 'bg-primary-50 text-primary-600 hover-glow' 
                  : 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200'
              }`}
            >
              <BookmarkIcon className="h-5 w-5" />
            </button>
            
            <button
              onClick={handleShare}
              className="p-3 bg-secondary-100 text-secondary-600 hover:bg-secondary-200 rounded-lg transition-all duration-300 hover-lift"
            >
              <ShareIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Story Content */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8 mb-8">
        <div 
          className="prose prose-lg max-w-none prose-headings:text-secondary-900 prose-p:text-secondary-700 prose-strong:text-secondary-900"
          dangerouslySetInnerHTML={{ __html: mockStory.content }}
        />
      </div>

      {/* Rating Section */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8 mb-8">
        <h3 className="text-xl font-semibold text-secondary-900 mb-4">Rate this story</h3>
        
                 {userRating > 0 ? (
           <div className="flex items-center space-x-2">
             <div className="flex">
               {[1, 2, 3, 4, 5].map((star) => (
                 <StarSolidIcon 
                   key={star}
                   className={`h-6 w-6 transition-all duration-300 ${
                     star <= userRating ? 'text-yellow-400 scale-110' : 'text-secondary-300'
                   }`}
                 />
               ))}
             </div>
             <span className="text-secondary-600 animate-fade-in">Thanks for rating!</span>
           </div>
         ) : (
           <div className="flex items-center space-x-2">
             <div className="flex">
               {[1, 2, 3, 4, 5].map((star) => (
                 <button
                   key={star}
                   onClick={() => handleRating(star)}
                   className="text-secondary-300 hover:text-yellow-400 transition-all duration-300 hover:scale-110 transform"
                 >
                   <StarIcon className="h-6 w-6" />
                 </button>
               ))}
             </div>
             <span className="text-secondary-600">Click to rate</span>
           </div>
         )}
      </div>

      {/* Tags */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8 mb-8">
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {mockStory.tags.map((tag, index) => (
            <span
              key={tag}
              className="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full text-sm hover-lift transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Related Stories */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
        <h3 className="text-xl font-semibold text-secondary-900 mb-6">You might also like</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-all duration-300 hover-lift">
            <h4 className="font-semibold text-secondary-900 mb-2">The Quantum Thief</h4>
            <p className="text-secondary-600 text-sm mb-2">A master thief discovers a device that can steal memories from parallel universes...</p>
            <div className="flex items-center text-sm text-secondary-500">
              <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
              <span>4.7</span>
              <span className="mx-2">•</span>
              <span>14 min read</span>
            </div>
          </div>
          <div className="p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-all duration-300 hover-lift">
            <h4 className="font-semibold text-secondary-900 mb-2">Whispers in the Dark</h4>
            <p className="text-secondary-600 text-sm mb-2">A small town detective investigates a series of disappearances connected to ancient legends...</p>
            <div className="flex items-center text-sm text-secondary-500">
              <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
              <span>4.6</span>
              <span className="mx-2">•</span>
              <span>8 min read</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
