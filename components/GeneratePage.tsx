'use client'

import { useEffect, useState } from 'react'
import { SparklesIcon, ClockIcon, BookOpenIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { GenerateStoryRequest } from '@/app/api/generate/route'

const genres = [
  'Science Fiction',
  'Fantasy', 
  'Mystery',
  'Romance',
  'Horror',
  'Adventure'
]

const lengths = [
  { value: 'short', label: 'Short Story', time: '2-3 min read', description: 'Quick, engaging tales' },
  { value: 'medium', label: 'Medium Story', time: '5-8 min read', description: 'Balanced narrative' },
  { value: 'long', label: 'Long Story', time: '12-15 min read', description: 'Epic adventures' }
]

const styles = [
  'Action-packed',
  'Emotional',
  'Mysterious',
  'Humorous',
  'Dark',
  'Inspirational'
]

export default function GeneratePage() {
  const [formData, setFormData] = useState<GenerateStoryRequest>({
    genre: 'Science Fiction',
    length: 'medium',
    style: 'Action-packed',
    prompt: ''
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedStory, setGeneratedStory] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  // Prefill from ?q=
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const q = params.get('q')
    if (q) {
      setFormData(prev => ({ ...prev, prompt: q }))
    }
  }, [])

  const handleInputChange = (field: keyof GenerateStoryRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    setGeneratedStory(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to generate story')
      }

      const story = await response.json()

      // Save to library via API
      const saveRes = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(story),
      })
      const saved = saveRes.ok ? await saveRes.json() : { story }

      setGeneratedStory(saved.story || story)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveStory = () => {
    // Already saved on generate; could implement re-save/edit later
    console.log('Story saved:', generatedStory)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 page-transition">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6 text-fade-in">
          <SparklesIcon className="h-4 w-4 animate-pulse" />
          <span>AI Story Generator</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6 text-slide-up">
          Create Your Own
          <span className="text-primary-600"> Story</span>
        </h1>
        
        <p className="text-xl text-secondary-600 max-w-2xl mx-auto text-fade-in">
          Choose your genre, length, and style. Our AI will craft a unique story just for you.
        </p>
      </div>

      {/* Generation Form */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8 hover-lift">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Form */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Story Settings</h2>
            
            {/* Genre Selection */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                Genre
              </label>
              <div className="grid grid-cols-2 gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => handleInputChange('genre', genre)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 hover-lift ${
                      formData.genre === genre
                        ? 'bg-primary-600 text-white hover-glow'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Length Selection */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                Story Length
              </label>
              <div className="space-y-2">
                {lengths.map((length) => (
                  <button
                    key={length.value}
                    onClick={() => handleInputChange('length', length.value)}
                    className={`w-full p-4 rounded-lg text-left transition-all duration-300 hover:scale-105 hover-lift ${
                      formData.length === length.value
                        ? 'bg-primary-600 text-white hover-glow'
                        : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{length.label}</div>
                        <div className="text-sm opacity-75">{length.description}</div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span className="text-sm">{length.time}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                Writing Style
              </label>
              <select
                value={formData.style}
                onChange={(e) => handleInputChange('style', e.target.value)}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent form-field"
              >
                {styles.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            {/* Custom Prompt */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-3">
                Custom Prompt (Optional)
              </label>
              <textarea
                value={formData.prompt}
                onChange={(e) => handleInputChange('prompt', e.target.value)}
                placeholder="Add specific details or themes you'd like in your story..."
                rows={3}
                className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent form-field resize-none"
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full btn-primary text-lg py-4 btn-animate hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  <span>Generating Story...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <SparklesIcon className="h-5 w-5" />
                  <span>Generate Story</span>
                </div>
              )}
            </button>
          </div>

          {/* Right Column - Preview/Result */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">Generated Story</h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            {isGenerating && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                <p className="text-secondary-600">AI is crafting your story...</p>
                <p className="text-sm text-secondary-500 mt-2">This may take a few moments</p>
              </div>
            )}

            {generatedStory && (
              <div className="space-y-4">
                <div className="bg-secondary-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                    {generatedStory.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-secondary-600 mb-3">
                    <span>by {generatedStory.author}</span>
                    <span>•</span>
                    <span>{generatedStory.genre}</span>
                    <span>•</span>
                    <span>{generatedStory.readTime} min read</span>
                  </div>
                  <p className="text-secondary-700">{generatedStory.excerpt}</p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => window.open(`/story/${generatedStory.id}`, '_blank')}
                    className="flex-1 btn-primary btn-animate hover-lift"
                  >
                    <BookOpenIcon className="h-4 w-4 mr-2" />
                    Read Full Story
                  </button>
                  <button
                    onClick={handleSaveStory}
                    className="btn-secondary btn-animate hover-lift"
                  >
                    Save
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {generatedStory.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!isGenerating && !generatedStory && !error && (
              <div className="text-center py-12 text-secondary-500">
                <SparklesIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Your generated story will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-8">
        <h3 className="text-xl font-bold text-secondary-900 mb-4">Tips for Better Stories</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-secondary-900 mb-2">Custom Prompts</h4>
            <p className="text-secondary-700 text-sm">
              Add specific details like character names, settings, or plot elements to make your story more unique.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-secondary-900 mb-2">Style Matters</h4>
            <p className="text-secondary-700 text-sm">
              Choose a writing style that matches your mood. Action-packed for excitement, emotional for depth.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
