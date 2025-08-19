import StoryCard from './StoryCard'
import Link from 'next/link'
import { SparklesIcon } from '@heroicons/react/24/outline'

const featuredStories: any[] = []

export default function FeaturedStories() {
  return (
    <section className="space-y-8 page-transition">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-secondary-900 mb-4 text-slide-up">Featured Stories</h2>
        <p className="text-secondary-600 max-w-2xl mx-auto text-fade-in">
          Discover the most popular and highly-rated AI-generated stories from our community
        </p>
      </div>
      
             {featuredStories.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {featuredStories.map((story, index) => (
             <div key={story.id} className="stagger-item" style={{ animationDelay: `${index * 100}ms` }}>
               <StoryCard {...story} />
             </div>
           ))}
         </div>
       ) : (
         <div className="text-center py-12 animate-fade-in">
           <div className="text-secondary-400 text-6xl mb-4 animate-bounce">📚</div>
           <h3 className="text-xl font-semibold text-secondary-900 mb-2">No stories yet</h3>
           <p className="text-secondary-600 mb-6">Be the first to generate amazing AI stories!</p>
           <Link href="/generate" className="btn-primary btn-animate hover-lift">
             <SparklesIcon className="h-4 w-4 mr-2" />
             Generate First Story
           </Link>
         </div>
       )}
      
      <div className="text-center">
        <a href="/library" className="btn-primary btn-animate hover-lift">
          View All Stories
        </a>
      </div>
    </section>
  )
}
