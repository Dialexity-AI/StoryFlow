'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, FunnelIcon, SparklesIcon } from '@heroicons/react/24/outline'
import StoryCard from './StoryCard'
import Link from 'next/link'

export default function LibraryPage() {
  const [allStories, setAllStories] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [selectedLength, setSelectedLength] = useState('All')
  const [sortBy, setSortBy] = useState('Latest')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(false)

  const genres = ['All', 'Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Adventure', 'Horror', 'Comedy']
  const lengths = ['All', 'Short', 'Medium', 'Long']
  const sortOptions = ['Latest', 'Popular', 'Rating', 'Read Time']

  // Initial fetch and on filter/search change (debounced UI loading only)
  useEffect(() => {
    const controller = new AbortController()
    const fetchStories = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedGenre !== 'All') params.set('genre', selectedGenre)
        if (selectedLength !== 'All') params.set('length', selectedLength.toLowerCase())
        if (searchQuery) params.set('q', searchQuery)
        const res = await fetch(`/api/stories?${params.toString()}`, { signal: controller.signal })
        const data = await res.json()
        setAllStories(data.items || [])
      } catch {}
      setLoading(false)
    }
    fetchStories()
    return () => controller.abort()
  }, [searchQuery, selectedGenre, selectedLength])

  // Simulate slight UI delay for smooth skeletons
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 200)
    return () => clearTimeout(t)
  }, [sortBy])

  const filteredStories = [...allStories]
    .sort((a, b) => {
      switch (sortBy) {
        case 'Popular':
          return (b.views ?? 0) - (a.views ?? 0)
        case 'Rating':
          return (b.rating ?? 0) - (a.rating ?? 0)
        case 'Read Time':
          return (a.readTime ?? 0) - (b.readTime ?? 0)
        default: // Latest
          const aT = new Date(a.createdAt ?? 0).getTime()
          const bT = new Date(b.createdAt ?? 0).getTime()
          return bT - aT
      }
    })

  const SkeletonGrid = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card">
          <div className="skeleton h-48 mb-4" />
          <div className="space-y-3">
            <div className="skeleton-text w-3/4" />
            <div className="skeleton-text w-full" />
            <div className="skeleton-text w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-8 page-transition">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-secondary-900 mb-4 text-slide-up">Story Library</h1>
        <p className="text-secondary-600 max-w-2xl mx-auto text-fade-in">
          Explore thousands of AI-generated stories. Use filters to find exactly what you're looking for.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 hover-lift">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-secondary-400 animate-pulse" />
            <input
              type="text"
              placeholder="Search stories, authors, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent form-field hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent form-field"
          >
            {sortOptions.map(option => (
              <option key={option} value={option}>Sort by: {option}</option>
            ))}
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-secondary-100 hover:bg-secondary-200 text-secondary-700 rounded-lg transition-all duration-300 hover-lift"
          >
            <FunnelIcon className={`h-5 w-5 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            <span>Filters</span>
          </button>
        </div>

        {/* Genre Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-secondary-200 animate-slide-up">
            <h3 className="text-sm font-medium text-secondary-700 mb-3">Filter by Genre:</h3>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre, index) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ease-out hover:scale-105 hover-lift ${
                    selectedGenre === genre
                      ? 'bg-primary-600 text-white hover-glow animate-pulse'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {genre}
                </button>
              ))}
            </div>
            
            <h3 className="text-sm font-medium text-secondary-700 mb-3 mt-4">Filter by Length:</h3>
            <div className="flex flex-wrap gap-2">
              {lengths.map((length, index) => (
                <button
                  key={length}
                  onClick={() => setSelectedLength(length)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ease-out hover:scale-105 hover-lift ${
                    selectedLength === length
                      ? 'bg-primary-600 text-white hover-glow animate-pulse'
                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                  }`}
                  style={{ animationDelay: `${(index + genres.length) * 50}ms` }}
                >
                  {length}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-secondary-600">
            Showing {filteredStories.length} of {allStories.length} stories
          </p>
        </div>

        {loading ? (
          SkeletonGrid
        ) : filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStories.map((story, index) => (
              <div key={story.id} className="stagger-item" style={{ animationDelay: `${index * 100}ms` }}>
                <StoryCard {...story} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-secondary-400 text-6xl mb-4 animate-bounce">📚</div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              {allStories.length === 0 ? 'No stories yet' : 'No stories found'}
            </h3>
            <p className="text-secondary-600 mb-6">
              {allStories.length === 0 
                ? 'Be the first to generate amazing AI stories!' 
                : 'Try adjusting your search or filters'
              }
            </p>
            {allStories.length === 0 && (
              <Link href="/generate" className="btn-primary btn-animate hover-lift">
                <SparklesIcon className="h-4 w-4 mr-2" />
                Generate First Story
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
