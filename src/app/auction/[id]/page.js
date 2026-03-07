'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, Star, CheckCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function AuctionDetail() {
  const params = useParams();
  const auctionId = params?.id;
  const { user } = useAuth();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [isProcessingBuyNow, setIsProcessingBuyNow] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Calculate time remaining
  useEffect(() => {
    if (!auction?.end_time) return;
    
    const calculateTimeLeft = () => {
      const end = new Date(auction.end_time).getTime();
      const now = new Date().getTime();
      const diff = end - now;
      
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [auction?.end_time]);

  useEffect(() => {
    if (!auctionId) return;
    
    async function fetchAuction() {
      if (!isSupabaseConfigured() || !supabase) { 
        setError('Supabase not configured'); 
        setLoading(false); 
        return; 
      }
      
      const { data, error: fetchError } = await supabase
        .from('auctions')
        .select('*')
        .eq('id', auctionId)
        .single();
      
      if (fetchError) {
        console.error('Error:', fetchError);
        setError(fetchError.message);
      } else if (data) {
        setAuction(data);
        setBidAmount((data.current_bid || data.starting_price || 0) + (data.bid_increment || 1000));
      } else {
        setError('Auction not found');
      }
      setLoading(false);
    }
    fetchAuction();
  }, [auctionId]);

  const handlePlaceBid = async () => {
    if (!user) {
      setError('Please log in to place a bid');
      return;
    }
    if (user.id === auction.seller_id) {
      setError('You cannot bid on your own auction');
      return;
    }
    const bidValue = parseInt(bidAmount);
    const minBid = (auction.current_bid || auction.starting_price) + (auction.bid_increment || 1000);
    if (bidValue < minBid) {
      setError(`Bid must be at least ¥${minBid.toLocaleString()}`);
      return;
    }
    setIsPlacingBid(true);
    setError('');
    try {
      // Insert bid
      const { error: bidError } = await supabase.from('bids').insert({
        auction_id: auction.id,
        bidder_id: user.id,
        amount: bidValue,
        created_at: new Date().toISOString()
      });
      if (bidError) throw bidError;
      // Update auction
      const { error: updateError } = await supabase.from('auctions').update({
        current_bid: bidValue,
        bid_count: (auction.bid_count || 0) + 1
      }).eq('id', auction.id);
      if (updateError) throw updateError;
      setAuction({ ...auction, current_bid: bidValue, bid_count: (auction.bid_count || 0) + 1 });
      setSuccess('Bid placed successfully!');
    } catch (err) {
      setError(err.message);
    }
    setIsPlacingBid(false);
  };

  const handleBuyNow = async () => {
    if (!user) {
      setError('Please log in to purchase');
      return;
    }
    if (user.id === auction.seller_id) {
      setError('You cannot buy your own auction');
      return;
    }
    
    setIsProcessingBuyNow(true);
    setError('');
    
    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          buyer_id: user.id,
          seller_id: auction.seller_id,
          auction_id: auction.id,
          total_amount: auction.buy_now_price,
          status: 'completed',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Update auction status to sold
      const { error: updateError } = await supabase
        .from('auctions')
        .update({ status: 'sold', current_bid: auction.buy_now_price })
        .eq('id', auction.id);
      
      if (updateError) throw updateError;
      
      // Redirect to success page
      window.location.href = `/purchase-success?orderId=${order.id}`;
    } catch (err) {
      setError(err.message);
      setIsProcessingBuyNow(false);
      setShowBuyNowModal(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center"><div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"></div></div>;

  if (!auction) return <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center"><div className="text-center"><h2 className="text-xl font-bold dark:text-white">Auction not found</h2><Link href="/auctions" className="text-amber-600 mt-2 block">Back to Auctions</Link></div></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="bg-gradient-to-r from-amber-600 to-amber-800 px-4 py-4"><Link href="/auctions" className="flex items-center text-white/80"><ChevronLeft className="w-5 h-5"/><span>Back</span></Link></div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {auction.images && auction.images.length > 0 ? (
              <>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <Image src={auction.images[selectedImage]} alt={auction.title} fill className="object-cover" />
                </div>
                {auction.images.length > 1 && (
                  <div className="flex gap-2 mt-4">
                    {auction.images.map((img, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSelectedImage(i)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedImage === i ? 'border-amber-500' : 'border-transparent'}`}
                      >
                        <Image src={img} alt="" width={80} height={80} className="object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="aspect-square rounded-2xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-6xl">📱</div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4"><span className="px-3 py-1 bg-emerald-500 text-white text-sm rounded-full">Grade {auction?.grade||'A'}</span><span className="text-slate-500 dark:text-slate-400">|</span><span className="dark:text-slate-300">{auction?.category}</span></div>
            <h1 className="text-3xl font-bold mb-2 dark:text-white">{auction?.title}</h1>
            <div className="flex items-center gap-2 mb-4"><div className="flex">{[1,2,3,4,5].map(s=><Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400"/>)}</div><span className="text-slate-600 dark:text-slate-400">4.8 ({auction.bid_count || 0} bids)</span></div>
            <div className="flex gap-4 text-slate-600 dark:text-slate-400 mb-6"><span>📦 {auction.bid_count || 0} bids</span><span>👁 {auction.watch_count || 0} watching</span></div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white mb-6">
              <div className="flex justify-between mb-4"><div><p className="text-amber-400 text-sm">CURRENT BID</p><p className="text-5xl font-bold">¥{(auction?.current_bid||auction?.starting_price||0).toLocaleString()}</p><p className="text-slate-400">{auction?.bid_count||0} bids</p></div><div className="text-right"><p className="text-slate-400 text-sm">ENDS IN</p><p className="text-2xl font-bold text-amber-400">{timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</p></div></div>
              <div className="flex gap-2 mb-3">
                {error && <p className="w-full text-red-400 text-sm">{error}</p>}
                {success && <p className="w-full text-emerald-400 text-sm">{success}</p>}
                <input type="number" value={bidAmount} onChange={e=>setBidAmount(e.target.value)} className="flex-1 px-4 py-3 rounded-lg text-slate-900 dark:bg-slate-700 dark:text-white"/>
                <button onClick={handlePlaceBid} disabled={isPlacingBid} className="px-6 py-3 bg-amber-500 text-slate-900 font-bold rounded-lg disabled:opacity-50">{isPlacingBid ? 'Placing...' : 'BID NOW'}</button>
              </div>
              <div className="flex gap-2 mb-4"><button onClick={()=>setBidAmount((auction?.current_bid||auction?.starting_price||0)+1000)} className="flex-1 py-2 bg-white/10 rounded-lg">+¥1,000</button><button onClick={()=>setBidAmount((auction?.current_bid||auction?.starting_price||0)+5000)} className="flex-1 py-2 bg-white/10 rounded-lg">+¥5,000</button><button onClick={()=>setBidAmount((auction?.current_bid||auction?.starting_price||0)+10000)} className="flex-1 py-2 bg-white/10 rounded-lg">+¥10,000</button></div>
              <div className="border-t border-white/20 pt-4 text-center">
                <button 
                  onClick={() => setShowBuyNowModal(true)}
                  disabled={isProcessingBuyNow || auction?.status === 'sold'}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg disabled:opacity-50"
                >
                  {auction?.status === 'sold' ? 'SOLD' : 'Buy Now'} ¥{(auction?.buy_now_price||0).toLocaleString()}
                </button>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-4"><div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">🏪</div><div><p className="font-bold flex items-center gap-2 dark:text-white">{auction.seller_name || 'Seller'}{auction.seller_verified && <CheckCircle className="w-4 h-4 text-emerald-500"/>}</p><p className="text-sm text-slate-500 dark:text-slate-400">{auction.location || 'Japan'}</p></div></div>
            </div>
          </div>
        </div>
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Specifications</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm"><div><p className="text-slate-500 dark:text-slate-400">Model</p><p className="font-medium dark:text-white">{auction?.title}</p></div><div><p className="text-slate-500 dark:text-slate-400">Grade</p><p className="font-medium dark:text-white">{auction?.grade || 'A'}</p></div><div><p className="text-slate-500 dark:text-slate-400">Condition</p><p className="font-medium dark:text-white">{auction?.condition || 'Good'}</p></div><div><p className="text-slate-500 dark:text-slate-400">Location</p><p className="font-medium dark:text-white">{auction?.location || 'Japan'}</p></div></div>
        </div>
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Bid History ({auction.bid_count || 0})</h3>
          <div className="text-slate-500 dark:text-slate-400 text-center py-4">
            {auction.bid_count > 0 ? 'Loading bids...' : 'No bids yet. Be the first to bid!'}
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-8 text-slate-600 dark:text-slate-400"><span>📦 Free Shipping</span><span>🛡 Escrow Protected</span><span>✓ Verified Seller</span></div>
        
        {/* Buy Now Modal */}
        {showBuyNowModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold dark:text-white mb-4">Confirm Purchase</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Are you sure you want to buy this item for <span className="font-bold text-emerald-500">¥{auction?.buy_now_price?.toLocaleString()}</span>?
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowBuyNowModal(false)}
                  className="flex-1 py-3 border border-slate-300 dark:border-slate-600 rounded-lg font-medium dark:text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBuyNow}
                  disabled={isProcessingBuyNow}
                  className="flex-1 py-3 bg-emerald-500 text-white rounded-lg font-bold disabled:opacity-50"
                >
                  {isProcessingBuyNow ? 'Processing...' : 'Yes, Buy Now'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
