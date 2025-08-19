import StoryReader from '@/components/StoryReader'

interface StoryPageProps {
  params: {
    id: string
  }
}

export default function StoryPage({ params }: StoryPageProps) {
  return <StoryReader storyId={params.id} />
}
