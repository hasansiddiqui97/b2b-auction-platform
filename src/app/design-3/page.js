'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Download, Shield, Truck } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function Design3Page() {
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

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-100 px-4 py-3 text-sm text-slate-600">Home &gt; Auctions &gt; Smartphones &gt; iPhone &gt; <span className="text-blue-600">{auction?.title}</span></div>
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <div className="aspect-square bg-slate-100 rounded-xl flex items-center justify-center text-7xl mb-4">📱</div>
              <div className="flex gap-2">{[0,1,2,3].map(i => <div key={i} className={`w-16 h-16 rounded-lg bg-slate-200 ${i===0?'border-2 border-blue-600':''}`}></div>)}</div>
            </div>
          </div>
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm font-mono inline-block">AUCTION #{auction?.id?.slice(0,8).toUpperCase()}</div>
            <h1 className="text-2xl font-bold">{auction?.title}</h1>
            <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">✓ Grade A</span>
            <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white rounded-xl p-5">
              <div className="flex justify-between mb-4">
                <div><p className="text-blue-200 text-xs">CURRENT BID</p><p className="text-4xl font-bold">¥{(auction?.current_bid||auction?.starting_price||0).toLocaleString()}</p><p className="text-blue-200">{auction?.bid_count||0} bids</p></div>
                <div className="text-right"><p className="text-blue-200 text-xs">TIME LEFT</p><p className="text-xl font-bold text-orange-400">2d 14h 32m</p></div>
              </div>
              <div className="flex gap-2 mb-3"><input type="number" className="flex-1 px-3 py-2 rounded-lg text-slate-900" placeholder="¥155,000"/><button className="bg-blue-500 px-4 py-2 rounded-lg">BID</button></div>
              <button className="w-full py-3 bg-white text-blue-700 font-bold rounded-lg">BID NOW ¥155,000</button>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-200">
              <h3 className="font-bold text-sm text-slate-500 mb-3">SELLER VERIFICATION</h3>
              <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 bg-slate-100 rounded-full">🏪</div><div><p className="font-bold">Tokyo Electronics</p><p className="text-green-600 text-sm flex items-center gap-1"><CheckCircle className="w-3 h-3"/>Verified</p></div></div>
              <div className="flex gap-2"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">✓ Business</span><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">✓ Phone</span><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">✓ ID</span></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 mt-6 overflow-hidden">
          <div className="bg-slate-50 px-6 py-3 border-b"><h3 className="font-bold">SPECIFICATIONS</h3></div>
          {[{l:'Model',v:auction?.title},{l:'Brand',v:'Apple'},{l:'Grade',v:'A (Excellent)'},{l:'Condition',v:'Barely used'},{l:'Carrier',v:'SIM Free'},{l:'Storage',v:'256GB'}].map((r,i) => <div key={i} className="flex px-6 py-3 border-b"><div className="w-32 text-slate-500">{r.l}</div><div className="font-medium">{r.v}</div></div>)}
        </div>
        <div className="bg-white rounded-xl border border-slate-200 mt-6 overflow-hidden">
          <div className="flex justify-between px-6 py-3 border-b"><h3 className="font-bold">BID HISTORY</h3><button className="text-blue-600 text-sm flex items-center gap-1"><Download className="w-4 h-4"/>Export CSV</button></div>
          {[{u:'user_8823',a:150000,t:'2 min'},{u:'tech_dealer',a:148500,t:'15 min'},{u:'buyer_99',a:147000,t:'32 min'}].map((b,i) => <div key={i} className="flex justify-between px-6 py-3 border-b"><span className={i===0?'text-green-600 font-bold':'text-slate-600'}>#{127-i} {b.u}</span><span className="font-bold">¥{b.a.toLocaleString()}</span><span className="text-slate-400">{b.t}</span></div>)}
        </div>
        <div className="bg-blue-50 border-2 border-green-500 rounded-xl p-4 mt-6 flex items-center gap-4"><Shield className="w-10 h-10 text-green-500"/><div><p className="font-bold text-green-600">Escrow Protected</p><p className="text-sm text-slate-600">Buyer protection up to ¥500,000</p></div></div>
        <div className="flex justify-center gap-8 mt-6 text-slate-600"><span className="flex items-center gap-2"><Truck className="w-5 h-5 text-green-500"/>Free Shipping</span><span className="flex items-center gap-2"><Shield className="w-5 h-5 text-green-500"/>Verified Seller</span><span className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500"/>30-day Warranty</span></div>
      </div>
    </div>
  );
}
