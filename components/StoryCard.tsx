'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HeartIcon, StarIcon, EyeIcon, ClockIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface StoryCardProps {
  id: string
  title: string
  excerpt: string
  author: string
  genre: string
  rating: number
  readTime: number
  views: number
  likes: number
  isLiked?: boolean
  coverImage?: string
  isPremium?: boolean
}

export default function StoryCard({
  id,
  title,
  excerpt,
  author,
  genre,
  rating,
  readTime,
  views,
  likes,
  isLiked = false,
  coverImage,
  isPremium = false,
}: StoryCardProps) {
  const [liked, setLiked] = useState(isLiked)
  const [currentLikes, setCurrentLikes] = useState(likes)

  const handleLike = () => {
    setLiked(!liked)
    setCurrentLikes(liked ? currentLikes - 1 : currentLikes + 1)
  }

  return (
    <div className="card group story-card">
      {/* Cover Image */}
      <div className="relative mb-4">
        <div className="aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg overflow-hidden">
                     {coverImage ? (
             <img
               src={coverImage}
               alt={title}
               className="w-full h-full object-cover story-image transition-transform duration-500 ease-out group-hover:scale-110"
             />
           ) : (
             <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out">
               <span className="text-primary-600 text-2xl font-bold">{title.charAt(0)}</span>
             </div>
           )}
        </div>
        
        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold hover-glow">
            PREMIUM
          </div>
        )}
        
        {/* Genre Badge */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-secondary-700 px-2 py-1 rounded-full text-xs font-medium hover-lift">
          {genre}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
                 <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-all duration-300 group-hover:scale-105 transform">
           <Link href={`/story/${id}`}>{title}</Link>
         </h3>
        
        <p className="text-secondary-600 text-sm line-clamp-3">{excerpt}</p>
        
        <div className="text-sm text-secondary-500">by {author}</div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-secondary-500">
          <div className="flex items-center space-x-4">
                         <div className="flex items-center">
               <StarIcon className="h-4 w-4 text-yellow-400 mr-1 animate-pulse" />
               <span>{rating.toFixed(1)}</span>
             </div>
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>{readTime} min</span>
            </div>
            <div className="flex items-center">
              <EyeIcon className="h-4 w-4 mr-1" />
              <span>{views}</span>
            </div>
          </div>
          
                     <button
             onClick={handleLike}
             className="flex items-center space-x-1 hover:text-primary-600 transition-all duration-300 hover:scale-110 transform"
           >
             {liked ? (
               <HeartSolidIcon className="h-4 w-4 text-red-500 animate-bounce" />
             ) : (
               <HeartIcon className="h-4 w-4" />
             )}
             <span>{currentLikes}</span>
           </button>
        </div>
      </div>
    </div>
  )
}
