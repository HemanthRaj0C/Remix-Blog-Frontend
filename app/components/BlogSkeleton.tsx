const BlogSkeleton = () => {
    return (
      <div className="max-w-2xl min-h-screen mx-auto px-4 py-8 animate-pulse">
        {/* Back button skeleton */}
        <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
  
        <article className="mt-8 space-y-8">
          {/* Title skeleton */}
          <div className="space-y-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            
            {/* Date skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
  
            {/* Description skeleton */}
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
  
          {/* Content skeleton */}
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
            ))}
          </div>
  
          {/* Footer skeleton */}
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  };
  
export default BlogSkeleton;