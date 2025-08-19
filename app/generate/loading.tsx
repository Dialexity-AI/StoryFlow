export default function GenerateLoading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 bg-secondary-200 rounded" />
      <div className="h-20 bg-white border border-secondary-200 rounded-xl" />
      <div className="h-56 bg-white border border-secondary-200 rounded-xl" />
    </div>
  )
}
