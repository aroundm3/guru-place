export default function Loading() {
  return (
    <div className="container mx-auto px-3 lg:px-4 py-4 lg:py-8 max-w-6xl">
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        
        {/* Content skeleton */}
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
        
        {/* Grid skeleton */}
        <div className="grid lg:grid-cols-4 lg:grid-cols-3 grid-cols-2 lg:gap-6 gap-4 mt-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-48 bg-gray-200 rounded-lg" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

