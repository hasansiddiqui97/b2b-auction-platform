'use client';

import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 flex items-center justify-center">
      <div className="glass-card p-8 max-w-md text-center">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Failed to load dashboard
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">
          Could not load your dashboard data. Please try again.
        </p>
        <button
          onClick={reset}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
