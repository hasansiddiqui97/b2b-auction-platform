'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Star, CheckCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function Design1Page() {
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');

  useEffect(() => {
    async function fetchAuction() {
      if (!isSupabaseConfigured() || !supabase) { setLoading(false); return; }
      const { data } = await supabase.from('auctions').select('*').eq('id', 'df46e5b7-c66e-4af4-bbb4-da9c744ea861').single();
      if (data) { setAuction(data); setBidAmount((data.current_bid || data.starting_price) + (data.bid_increment || 1000)); }
      setLoading(false);
    }
    fetchAuction();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-4"><Link href="/auctions" className="flex items-center text-white/80"><ChevronLeft className="w-5 h-5"/><span>Back</span></Link></div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div><div className="aspect-square rounded-2xl bg-slate-200 flex items-center justify-center text-6xl">📱</div></div>
          <div>
            <div className="flex items-center gap-3 mb-4"><span className="px-3 py-1 bg-emerald-500 text-white text-sm rounded-full">Grade {auction?.grade||'A'}</span><span className="text-slate-500">|</span><span>{auction?.category}</span></div>
            <h1 className="text-3xl font-bold mb-2">{auction?.title}</h1>
            <div className="flex items-center gap-2 mb-4"><div className="flex">{[1,2,3,4,5].map(s=><Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400"/>)}</div><span className="text-slate-600">4.8 (127)</span></div>
            <div className="flex gap-4 text-slate-600 mb-6"><span>📦 127 bids</span><span>👁 2,453 watching</span></div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white mb-6">
              <div className="flex justify-between mb-4"><div><p className="text-amber-400 text-sm">CURRENT BID</p><p className="text-5xl font-bold">¥{(auction?.current_bid||auction?.starting_price||0).toLocaleString()}</p><p className="text-slate-400">{auction?.bid_count||0} bids</p></div><div className="text-right"><p className="text-slate-400 text-sm">ENDS IN</p><p className="text-2xl font-bold text-amber-400">2d 14h 32m</p></div></div>
              <div className="flex gap-2 mb-3"><input type="number" value={bidAmount} onChange={e=>setBidAmount(e.target.value)} className="flex-1 px-4 py-3 rounded-lg text-slate-900"/><button className="px-6 py-3 bg-amber-500 text-slate-900 font-bold rounded-lg">BID NOW</button></div>
              <div className="flex gap-2 mb-4"><button onClick={()=>setBidAmount((auction?.current_bid||auction?.starting_price||0)+1000)} className="flex-1 py-2 bg-white/10 rounded-lg">+¥1,000</button><button onClick={()=>setBidAmount((auction?.current_bid||auction?.starting_price||0)+5000)} className="flex-1 py-2 bg-white/10 rounded-lg">+¥5,000</button><button onClick={()=>setBidAmount((auction?.current_bid||auction?.starting_price||0)+10000)} className="flex-1 py-2 bg-white/10 rounded-lg">+¥10,000</button></div>
              <div className="border-t border-white/20 pt-4 text-center">Buy Now: <span className="text-amber-400 font-bold">¥{(auction?.buy_now_price||0).toLocaleString()}</span></div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-4"><div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">🏪</div><div><p className="font-bold flex items-center gap-2">Tokyo Electronics <CheckCircle className="w-4 h-4 text-emerald-500"/></p><p className="text-sm text-slate-500">★★★★★ (98%) • 1,247 sales • Tokyo</p></div></div>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-bold mb-4">Specifications</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"><div><p className="text-slate-500">Model</p><p className="font-medium">{auction?.title}</p></div><div><p className="text-slate-500">Grade</p><p className="font-medium">{auction?.grade}</p></div><div><p className="text-slate-500">Condition</p><p className="font-medium">Excellent</p></div><div><p className="text-slate-500">Carrier</p><p className="font-medium">SIM Free</p></div></div>
        </div>
        <div className="mt-8 bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-bold mb-4">Bid History (127)</h3>
          {[{rank:127,user:'user_8823',amount:150000,time:'2 min ago'},{rank:126,user:'tech_dealer',amount:148500,time:'15 min ago'},{rank:125,user:'buyer_99',amount:147000,time:'32 min ago'}].map(bid=><div key={bid.rank} className="flex justify-between py-2 border-b border-slate-100"><span className={bid.rank===127?'text-emerald-600 font-bold':'text-slate-600'}>#{bid.rank} {bid.user}</span><span className="font-bold">¥{bid.amount.toLocaleString()}</span><span className="text-slate-400">{bid.time}</span></div>)}
        </div>
        <div className="mt-8 flex justify-center gap-8 text-slate-600"><span>📦 Free Shipping</span><span>🛡 Escrow Protected</span><span>✓ Verified Seller</span></div>
      </div>
    </div>
  );
}
