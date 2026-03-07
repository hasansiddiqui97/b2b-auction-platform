'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Share2, Heart, ChevronRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function Design2Page() {
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAuction() {
      if (!isSupabaseConfigured() || !supabase) { setLoading(false); return; }
      const { data } = await supabase.from('auctions').select('*').eq('id', 'df46e5b7-c66e-4af4-bbb4-da9c744ea861').single();
      if (data) setAuction(data);
      setLoading(false);
    }
    fetchAuction();
  }, []);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar - Mobile Style */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50 px-4 py-3 flex items-center justify-between">
        <Link href="/auctions" className="p-2 -ml-2"><ChevronLeft className="w-6 h-6" /></Link>
        <h1 className="font-semibold truncate">{auction?.title || 'Loading...'}</h1>
        <div className="flex gap-2">
          <button className="p-2"><Share2 className="w-5 h-5 text-slate-600" /></button>
          <button className="p-2"><Heart className="w-5 h-5 text-slate-600" /></button>
        </div>
      </div>

      <div className="pt-16">
        {/* Image Gallery - App Style */}
        <div className="relative aspect-[4/3] bg-slate-100">
          <div className="absolute inset-0 flex items-center justify-center text-8xl">📱</div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {[0,1,2,3].map(i => <div key={i} className={`w-2 h-2 rounded-full ${i===0?'bg-blue-500':'bg-slate-300'}`}></div>)}
          </div>
        </div>

        {/* Product Card - Overlapping */}
        <div className="bg-white rounded-t-3xl -mt-6 relative z-10 px-4 py-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-emerald-500 text-white text-xs rounded">Grade A</span>
            <span className="text-slate-500 text-sm">SIM Free • 256GB</span>
          </div>
          
          <h2 className="text-xl font-bold mb-2">{auction?.title}</h2>
          <p className="text-slate-500 text-sm mb-4">📦 Excellent condition • 🔋 92%</p>

          {/* Stats Bar */}
          <div className="flex justify-around py-3 bg-slate-50 rounded-lg mb-4 text-sm text-slate-600">
            <span>⭐ 4.8 (127)</span>
            <span>👁 2,453</span>
            <span>🛡 Escrow</span>
          </div>

          {/* Floating Bid Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <div><p className="text-xs text-slate-500">Current Bid</p><p className="text-2xl font-bold text-slate-900">¥{(auction?.current_bid||auction?.starting_price||0).toLocaleString()}</p></div>
              <div className="text-right"><p className="text-xs text-slate-500">Ends in</p><p className="text-lg font-bold text-orange-500">2d 14h</p></div>
            </div>
            <div className="flex gap-2">
              <input type="number" placeholder="¥150,000" className="flex-1 px-3 py-2 bg-slate-100 rounded-lg text-sm"/>
              <button className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg">BID</button>
            </div>
            <p className="text-center text-blue-500 text-sm mt-2">Buy Now ¥280,000 →</p>
          </div>

          <div className="h-32"></div>

          {/* Seller */}
          <div className="bg-slate-50 rounded-xl p-4 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">🏪</div>
              <div className="flex-1"><p className="font-semibold">Tokyo Electronics <span className="text-emerald-500">✓</span></p><p className="text-sm text-slate-500">★★★★★ (98%) • Tokyo</p></div>
              <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm">Contact</button>
            </div>
          </div>

          {/* Live Activity */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
            <p className="text-amber-700 text-sm font-bold mb-2">🔴 LIVE ACTIVITY</p>
            <p className="text-amber-800 text-sm">• someone bid ¥151,000</p>
            <p className="text-amber-800 text-sm">• user_8823 placed a bid 2 min ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
