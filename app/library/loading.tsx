export default function LibraryLoading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 w-40 bg-secondary-200 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-white border border-secondary-200 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
