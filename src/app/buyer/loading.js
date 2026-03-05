export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      {/* Header Skeleton */}
      <div className="glass-card p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
                <div>
                  <div className="h-6 w-12 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-1"></div>
                  <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="flex space-x-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl mb-6 w-fit">
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-4 py-2 rounded-lg bg-slate-300 dark:bg-slate-700 animate-pulse w-24"></div>
          ))}
        </div>

        {/* List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-4 flex items-center space-x-4">
              <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
              <div className="flex-1">
                <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              </div>
              <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
