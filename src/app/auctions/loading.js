export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Skeleton */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-900 dark:to-slate-800 pt-8 pb-12 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 bg-primary-400/30 rounded-lg w-64 mb-4"></div>
          <div className="h-6 bg-primary-400/20 rounded w-80 mb-6"></div>
          <div className="h-16 bg-white/20 rounded-xl max-w-2xl"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filters Skeleton */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="glass-card p-4">
              <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-20 mb-4"></div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
              ))}
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card p-4">
                  <div className="aspect-square rounded-xl bg-slate-200 dark:bg-slate-700 mb-4"></div>
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-3"></div>
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
