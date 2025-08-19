export default function RootLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-1/3 bg-secondary-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-40 bg-white border border-secondary-200 rounded-xl" />
          <div className="h-40 bg-white border border-secondary-200 rounded-xl" />
          <div className="h-40 bg-white border border-secondary-200 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
