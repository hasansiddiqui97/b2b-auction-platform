'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Gavel, Heart, Share2, Shield, MapPin, CheckCircle, ChevronLeft } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading auction...</p>
      </div>
    </div>
  );
}

function ErrorState({ onRetry, error }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 flex items-center justify-center">
      <div className="glass-card p-8 max-w-md text-center">
        <div className="text-6xl mb-4">😵</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Something went wrong</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-2">Failed to load auction details.</p>
        {error && <p className="text-xs text-red-500 mb-4 font-mono">{error}</p>}
        <button onClick={onRetry} className="btn-primary">Try Again</button>
      </div>
    </div>
  );
}

function AuctionContent({ auction, bidAmount, setBidAmount, timeLeft, isWatched, setIsWatched, onPlaceBid, isPlacingBid, bidError, bidSuccess, bidHistory, selectedImage, setSelectedImage }) {
  const minBid = (auction.currentBid || auction.starting_price || 0) + (auction.bid_increment || 500);
  const hasMultipleImages = auction.images && auction.images.length > 1;
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/auctions" className="flex items-center space-x-2 text-slate-500 hover:text-primary-500">
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Auctions</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              {auction.images && auction.images.length > 0 ? (
                <Image 
                  src={auction.images[selectedImage]} 
                  alt={auction.title} 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="text-6xl mb-2">📷</div>
                  <p>No Image Available</p>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/50 text-white text-sm rounded-full backdrop-blur-sm">
                  {timeLeft}
                </span>
              </div>
            </div>
            
            {/* Thumbnail Gallery - Show if 2-10 images */}
            {auction.images && auction.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {auction.images.slice(0, 10).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 ${
                      selectedImage === index ? 'border-primary-500' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt={`${auction.title} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
            
            {/* Image count badge */}
            {auction.images && auction.images.length > 0 && (
              <p className="text-sm text-slate-500">{auction.images.length} image{auction.images.length > 1 ? 's' : ''}</p>
            )}
          </div>

          {/* Details Section */}
          <div>
            <div className="mb-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-600 text-sm font-medium rounded-full">
                Grade {auction.grade}
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-2">{auction.title}</h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-1 text-slate-500">
                <MapPin className="w-4 h-4" />
                <span>{auction.seller_location || 'Tokyo, Japan'}</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-500">
                {auction.seller_verified && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                <span>{auction.seller_name || 'Hayaland Electronics'}</span>
                {auction.seller_verified && (
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Verified</span>
                )}
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 mb-6">{auction.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="glass-card p-4">
                <p className="text-sm text-slate-500">Current Bid</p>
                <p className="text-2xl font-bold text-primary-600">¥{auction.currentBid?.toLocaleString()}</p>
              </div>
              <div className="glass-card p-4">
                <p className="text-sm text-slate-500">Total Bids</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{auction.bidCount}</p>
              </div>
            </div>

            {/* Bid Form */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-600 dark:text-slate-300">Place Bid (Min: ¥{minBid.toLocaleString()})</span>
                <button 
                  onClick={() => setIsWatched(!isWatched)}
                  className={`p-2 rounded-lg ${isWatched ? 'bg-rose-100 text-rose-500' : 'bg-slate-100 text-slate-500'}`}
                >
                  <Heart className={`w-5 h-5 ${isWatched ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <div className="flex space-x-3">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Enter bid amount"
                />
                <button 
                  onClick={onPlaceBid}
                  disabled={isPlacingBid}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Gavel className="w-4 h-4" />
                  <span>{isPlacingBid ? 'Placing...' : 'Place Bid'}</span>
                </button>
              </div>

              {bidError && <p className="text-rose-500 text-sm mt-2">{bidError}</p>}
              {bidSuccess && <p className="text-emerald-500 text-sm mt-2">{bidSuccess}</p>}

              {auction.buyNowPrice && (
                <button className="w-full mt-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium">
                  Buy Now: ¥{auction.buyNowPrice.toLocaleString()}
                </button>
              )}
            </div>

            {/* Protection */}
            <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Escrow Protected</span>
              </div>
              <p className="text-sm text-emerald-600 dark:text-emerald-500 mt-1">
                Your payment is held securely until you receive the item.
              </p>
            </div>

            {/* Bid History */}
            {bidHistory && bidHistory.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Bid History ({bidHistory.length})</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {bidHistory.map((bid, index) => (
                    <div key={bid.id || index} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">
                          {bid.profiles?.full_name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(bid.created_at).toLocaleString()}
                        </p>
                      </div>
                      <p className="font-bold text-emerald-600">¥{bid.amount?.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuctionDetail({ params }) {
  const id = params?.id;
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const [isWatched, setIsWatched] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [bidHistory, setBidHistory] = useState([]);
  const [error, setError] = useState('');

  // Load auction from Supabase
  useEffect(() => {
    async function fetchAuction() {
      console.log('fetchAuction called, id:', id, 'isSupabaseConfigured:', isSupabaseConfigured());
      
      if (!isSupabaseConfigured() || !supabase) {
        console.log('Supabase not configured, returning');
        setLoading(false);
        return;
      }
      
      console.log('Fetching from Supabase with id:', id);
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('id', id);
      
      console.log('Got data:', !!data, 'error:', error);
      
      if (error) {
        console.log('Error fetching:', error);
        setError(error.message);
        setLoading(false);
        return;
      }
      
      if (!data || data.length === 0) {
        console.log('No data found for id:', id);
        setError('Auction not found');
        setLoading(false);
        return;
      }
      
      const auctionData = data[0];
      
      // Transform snake_case to camelCase
      const transformed = {
        ...auctionData,
        currentBid: auctionData.current_bid,
        startingPrice: auctionData.starting_price,
        bidIncrement: auctionData.bid_increment,
        startTime: auctionData.start_time,
        endTime: auctionData.end_time,
        buyNowPrice: auctionData.buy_now_price,
        bidCount: auctionData.bid_count,
        sellerId: auctionData.seller_id,
        sellerName: auctionData.seller_name,
        sellerVerified: auctionData.seller_verified,
        sellerLocation: auctionData.seller_location,
      };
      setAuction(transformed);
      setBidAmount((auctionData.current_bid || auctionData.starting_price) + (auctionData.bid_increment || 500));
      
      // Fetch bid history (simplified - no join)
      try {
        const { data: bids } = await supabase
          .from('bids')
          .select('*')
          .eq('auction_id', id)
          .order('created_at', { ascending: false });
        
        if (bids) setBidHistory(bids);
      } catch (e) {
        console.log('Bid history fetch skipped:', e.message);
      }
      setLoading(false);
    }
    
    fetchAuction();
  }, [id]);

  // Timer
  useEffect(() => {
    if (!auction) return;
    
    const updateTimer = () => {
      const diff = new Date(auction.endTime) - new Date();
      if (diff <= 0) {
        setTimeLeft('Ended');
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${hours}h ${mins}m ${secs}s`);
    };
    
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [auction?.endTime]);

  const handleRetry = () => {
    // Re-fetch auction
    async function refetch() {
      if (!isSupabaseConfigured() || !supabase) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase
        .from('auctions')
        .select('*')
        .eq('id', id);
      
      if (error || !data || data.length === 0) {
        setLoading(false);
        return;
      }
      
      const auctionData = data[0];
      const transformed = {
        ...auctionData,
        currentBid: auctionData.current_bid,
        startingPrice: auctionData.starting_price,
        bidIncrement: auctionData.bid_increment,
        startTime: auctionData.start_time,
        endTime: auctionData.end_time,
        buyNowPrice: auctionData.buy_now_price,
        bidCount: auctionData.bid_count,
        sellerId: auctionData.seller_id,
        sellerName: auctionData.seller_name,
        sellerVerified: auctionData.seller_verified,
        sellerLocation: auctionData.seller_location,
      };
      setAuction(transformed);
      setBidAmount((auctionData.current_bid || auctionData.starting_price) + (auctionData.bid_increment || 500));
      setLoading(false);
    }
    refetch();
  };

  const handlePlaceBid = async () => {
    setBidError('');
    setBidSuccess('');
    
    // Check if auction has ended
    if (auction.end_time && new Date(auction.end_time) < new Date()) {
      setBidError('This auction has ended');
      return;
    }
    
    // Check if auction is still active
    if (auction.status === 'closed') {
      setBidError('This auction is closed');
      return;
    }
    
    const bid = parseInt(bidAmount);
    const minBid = (auction.currentBid || auction.starting_price || 0) + (auction.bid_increment || 500);
    
    if (bid < minBid) {
      setBidError(`Bid must be at least ¥${minBid.toLocaleString()}`);
      return;
    }

    // Check if user is logged in
    const userId = localStorage.getItem('hw_user_id');
    if (!userId) {
      setBidError('Please login to place a bid');
      return;
    }

    setIsPlacingBid(true);

    try {
      // 1. Save bid to bids table
      const { data: bidData, error: bidError } = await supabase
        .from('bids')
        .insert({
          auction_id: auction.id,
          bidder_id: userId,
          amount: bid,
          is_auto_bid: false
        })
        .select()
        .single();

      if (bidError) throw bidError;

      // 2. Update auction with new current_bid and increment bid_count
      const newBidCount = (auction.bid_count || 0) + 1;
      const { error: updateError } = await supabase
        .from('auctions')
        .update({
          current_bid: bid,
          bid_count: newBidCount
        })
        .eq('id', auction.id);

      if (updateError) throw updateError;

      setBidSuccess(`Bid placed! You are the highest bidder at ¥${bid.toLocaleString()}`);
      
      // Refresh auction data
      const { data: updatedAuction } = await supabase
        .from('auctions')
        .select('*')
        .eq('id', auction.id)
        .single();
      
      if (updatedAuction) {
        setAuction(updatedAuction);
        setBidAmount((updatedAuction.currentBid || updatedAuction.starting_price) + (updatedAuction.bid_increment || 500));
      }

    } catch (err) {
      console.error('Bid error:', err);
      setBidError('Failed to place bid. Please try again.');
    }

    setIsPlacingBid(false);
  };

  if (loading) return <LoadingState />;
  if (!auction) return <ErrorState onRetry={handleRetry} error={error} />;

  return (
    <AuctionContent 
      auction={auction}
      bidAmount={bidAmount}
      setBidAmount={setBidAmount}
      timeLeft={timeLeft}
      isWatched={isWatched}
      setIsWatched={setIsWatched}
      onPlaceBid={handlePlaceBid}
      isPlacingBid={isPlacingBid}
      bidError={bidError}
      bidSuccess={bidSuccess}
      bidHistory={bidHistory}
      selectedImage={selectedImage}
      setSelectedImage={setSelectedImage}
    />
  );
}
