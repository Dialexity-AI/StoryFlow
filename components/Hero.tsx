'use client'

import Link from 'next/link'
import { SparklesIcon, BookOpenIcon, StarIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export default function Hero() {
  const router = useRouter()
  const [userInput, setUserInput] = useState('')
  const [typed, setTyped] = useState('Generate a magical adventure...')
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopIndex, setLoopIndex] = useState(0)
  const [isFocused, setIsFocused] = useState(false)
  const samples = useRef([
    'Generate a magical adventure...',
    'Write a sci‑fi short about time loops...',
    'Create a funny story for kids...',
    'Write a mysterious detective scene...'
  ])

  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

  useEffect(() => {
    if (isFocused || userInput) return
    const list = samples.current
    const current = list[loopIndex % list.length]

    if (!isDeleting && typed === current) {
      const t = setTimeout(() => setIsDeleting(true), 1000)
      return () => clearTimeout(t)
    }

    if (isDeleting && typed === '') {
      const t = setTimeout(() => {
        setIsDeleting(false)
        setLoopIndex((i) => (i + 1) % list.length)
      }, 650)
      return () => clearTimeout(t)
    }

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setTyped(current.substring(0, typed.length + 1))
      } else {
        setTyped(current.substring(0, Math.max(0, typed.length - 1)))
      }
    }, isDeleting ? rand(25, 45) : rand(55, 85))

    return () => clearTimeout(timeout)
  }, [typed, isDeleting, loopIndex, isFocused, userInput])

  const goGenerate = () => {
    const prompt = (userInput || typed).trim()
    router.push(`/generate${prompt ? `?q=${encodeURIComponent(prompt)}` : ''}`)
  }

  const displayValue = isFocused ? userInput : (userInput || typed)
  const placeholder = isFocused ? 'Start typing...' : typed

  return (
    <div className="text-center py-16 px-4 page-transition">
      <div className="max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6 text-fade-in hover:scale-105 transition-transform duration-300">
          <SparklesIcon className="h-4 w-4 animate-pulse" />
          <span>Discover Amazing AI-Generated Stories</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6 text-slide-up">
          Read, Rate, and
          <span className="text-primary-600"> Discover</span>
          <br />
          AI Stories
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-secondary-600 mb-6 max-w-2xl mx-auto text-fade-in">
          Explore thousands of AI-generated stories across all genres. Rate your favorites, 
          discover new authors, and immerse yourself in endless creativity.
        </p>

        {/* Typewriter input (CTA) */}
        <div className="tw-input mb-10">
          <div className="tw-row justify-between">
            <div className="flex items-center gap-3 flex-1">
              <SparklesIcon className="h-5 w-5 text-primary-600" />
              <input
                value={displayValue}
                onChange={(e) => setUserInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => e.key === 'Enter' && goGenerate()}
                aria-label="Describe your story idea"
                placeholder={placeholder}
                className="flex-1 bg-transparent outline-none border-0 text-secondary-700 placeholder-secondary-400"
              />
            </div>
            <button onClick={goGenerate} className="btn-primary btn-animate ml-3">Generate</button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center items-center space-x-8 mb-8">
          <div className="text-center stagger-item hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0ms' }}>
            <div className="text-2xl font-bold text-primary-600 animate-pulse">10K+</div>
            <div className="text-secondary-600">Stories</div>
          </div>
          <div className="text-center stagger-item hover:scale-110 transition-transform duration-300" style={{ animationDelay: '100ms' }}>
            <div className="text-2xl font-bold text-primary-600 animate-pulse">50K+</div>
            <div className="text-secondary-600">Readers</div>
          </div>
          <div className="text-center stagger-item hover:scale-110 transition-transform duration-300" style={{ animationDelay: '200ms' }}>
            <div className="text-2xl font-bold text-primary-600 animate-pulse">4.8</div>
            <div className="text-secondary-600 flex items-center justify-center">
              <StarIcon className="h-4 w-4 text-yellow-400 mr-1 animate-bounce" />
              Rating
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/generate" className="btn-primary text-lg px-8 py-3 btn-animate hover-lift">
            <SparklesIcon className="h-5 w-5 mr-2 inline" />
            Generate Story
          </Link>
          <Link href="/library" className="btn-secondary text-lg px-8 py-3 btn-animate hover-lift">
            <BookOpenIcon className="h-5 w-5 mr-2 inline" />
            Browse Stories
          </Link>
        </div>
      </div>
    </div>
  )
}
