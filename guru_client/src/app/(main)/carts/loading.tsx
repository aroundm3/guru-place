export default function CartsLoading() {
  return (
    <div className="container mx-auto px-3 lg:px-4 py-4 lg:py-8 max-w-6xl">
      <div className="animate-pulse space-y-6">
        {/* Header skeleton */}
        <div className="h-8 bg-gray-200 rounded w-32" />
        
        {/* Cart items skeleton */}
        <div className="space-y-4 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 p-4 border rounded-lg">
              <div className="w-24 h-24 bg-gray-200 rounded" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Summary skeleton */}
        <div className="mt-8 p-6 border rounded-lg space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-12 bg-gray-200 rounded w-full mt-4" />
        </div>
      </div>
    </div>
  )
}

