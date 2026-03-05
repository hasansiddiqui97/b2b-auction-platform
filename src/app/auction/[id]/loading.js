export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Skeleton */}
          <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse"></div>

          {/* Details Skeleton */}
          <div className="space-y-6">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2 animate-pulse"></div>
            
            <div className="glass-card p-6">
              <div className="flex justify-between mb-4">
                <div className="h-6 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              </div>
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full animate-pulse"></div>
              <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-full mt-4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
