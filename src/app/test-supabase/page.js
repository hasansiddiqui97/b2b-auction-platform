'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabase() {
  const [status, setStatus] = useState('Testing...');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  async function testConnection() {
    try {
      // Test fetching categories
      const { data: categories, error: catError } = await supabase
        .from('categories')
        .select('*');

      if (catError) {
        setError(catError.message);
        setStatus('Error');
        return;
      }

      // Test fetching auctions
      const { data: auctions, error: aucError } = await supabase
        .from('auctions')
        .select('*')
        .limit(5);

      if (aucError) {
        setError(aucError.message);
        setStatus('Error');
        return;
      }

      setData({ categories, auctions });
      setStatus('Connected!');
    } catch (err) {
      setError(err.message);
      setStatus('Failed');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-20 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          Supabase Connection Test
        </h1>
        
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-600 dark:text-slate-300">Status:</span>
            <span className={`font-semibold ${
              status === 'Connected!' ? 'text-emerald-500' : 
              status === 'Error' ? 'text-rose-500' : 'text-amber-500'
            }`}>
              {status}
            </span>
          </div>

          {error && (
            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg mb-4">
              <p className="text-rose-600 dark:text-rose-400">{error}</p>
            </div>
          )}

          {data && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-slate-800 dark:text-white mb-2">
                  Categories ({data.categories?.length || 0})
                </h3>
                <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-xs overflow-auto max-h-32">
                  {JSON.stringify(data.categories, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="font-medium text-slate-800 dark:text-white mb-2">
                  Auctions ({data.auctions?.length || 0})
                </h3>
                <pre className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg text-xs overflow-auto max-h-32">
                  {JSON.stringify(data.auctions, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}