'use client'

import { useState } from 'react'

const categories = [
  { id: 'all', name: 'All Stories', count: 10234 },
  { id: 'fantasy', name: 'Fantasy', count: 2341 },
  { id: 'scifi', name: 'Science Fiction', count: 1892 },
  { id: 'mystery', name: 'Mystery', count: 1456 },
  { id: 'romance', name: 'Romance', count: 2134 },
  { id: 'adventure', name: 'Adventure', count: 1678 },
  { id: 'horror', name: 'Horror', count: 892 },
  { id: 'comedy', name: 'Comedy', count: 1234 },
]

export default function CategoryFilter() {
  const [activeCategory, setActiveCategory] = useState('all')

  return (
    <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 page-transition">
      <h2 className="text-xl font-semibold text-secondary-900 mb-4 text-slide-up">Browse by Category</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-out hover:scale-105 hover-lift ${
              activeCategory === category.id
                ? 'bg-primary-600 text-white hover-glow'
                : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {category.name}
            <span className="ml-2 text-xs opacity-75">({category.count})</span>
          </button>
        ))}
      </div>
    </div>
  )
}
