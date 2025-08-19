import dynamic from 'next/dynamic'
import Hero from '@/components/Hero'

const CategoryFilter = dynamic(() => import('@/components/CategoryFilter'), {
  loading: () => <div className="animate-pulse h-10 w-40 bg-secondary-200 rounded" />,
})

const FeaturedStories = dynamic(() => import('@/components/FeaturedStories'), {
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      <div className="h-40 bg-white border border-secondary-200 rounded-xl" />
      <div className="h-40 bg-white border border-secondary-200 rounded-xl" />
      <div className="h-40 bg-white border border-secondary-200 rounded-xl" />
    </div>
  ),
})

export default function Home() {
  return (
    <div className="space-y-12">
      <Hero />
      <CategoryFilter />
      <FeaturedStories />
    </div>
  )
}
