export default function ProductLoading() {
  return (
    <div className="lg:max-w-5xl max-w-4xl lg:px-0 px-4 mx-auto">
      <div className="animate-pulse space-y-6 mt-10">
        {/* Breadcrumb skeleton */}
        <div className="h-12 bg-gray-200 rounded-lg" />
        
        {/* Product detail skeleton */}
        <div className="flex sm:flex-row flex-col sm:gap-10 gap-6">
          {/* Image skeleton */}
          <div className="flex-1">
            <div className="h-96 bg-gray-200 rounded-lg" />
          </div>
          
          {/* Info skeleton */}
          <div className="flex-1 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-12 bg-gray-200 rounded w-full mt-6" />
          </div>
        </div>
      </div>
    </div>
  )
}

