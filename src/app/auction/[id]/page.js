'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Gavel, Heart, Share2, Shield, MapPin, CheckCircle, ChevronLeft } from 'lucide-react';
import { mockAuctions, currentUser } from '@/data/mockData';

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

function ErrorState({ onRetry }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 flex items-center justify-center">
      <div className="glass-card p-8 max-w-md text-center">
        <div className="text-6xl mb-4">😵</div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Something went wrong</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Failed to load auction details. Please try again.</p>
        <button onClick={onRetry} className="btn-primary">Try Again</button>
      </div>
    </div>
  );
}

function AuctionContent({ auction, bidAmount, setBidAmount, timeLeft, isWatched, setIsWatched, onPlaceBid, isPlacingBid, bidError, bidSuccess }) {
  const minBid = auction.currentBid + 500;
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
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
              {auction.images && auction.images[0] ? (
                <Image src={auction.images[0]} alt={auction.title} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
              )}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-black/50 text-white text-sm rounded-full backdrop-blur-sm">
                  {timeLeft}
                </span>
              </div>
            </div>
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
                <span>{auction.seller?.location || 'Tokyo, Japan'}</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-500">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>{auction.seller?.name || 'Hayaland Electronics'}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuctionDetail({ params }) {
  const { id } = params;
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const [isWatched, setIsWatched] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');

  // Load auction
  useEffect(() => {
    const found = mockAuctions.find(a => a.id === id);
    if (found) {
      setAuction(found);
      setBidAmount(found.currentBid + 500);
    }
    setLoading(false);
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
    setLoading(true);
    const found = mockAuctions.find(a => a.id === id);
    if (found) {
      setAuction(found);
      setBidAmount(found.currentBid + 500);
    }
    setLoading(false);
  };

  const handlePlaceBid = () => {
    setBidError('');
    setBidSuccess('');
    const bid = parseInt(bidAmount);
    if (bid < auction.currentBid + 500) {
      setBidError('Bid must be higher than current + ¥500');
      return;
    }
    setIsPlacingBid(true);
    setTimeout(() => {
      setIsPlacingBid(false);
      setBidSuccess('Bid placed successfully!');
    }, 1500);
  };

  if (loading) return <LoadingState />;
  if (!auction) return <ErrorState onRetry={handleRetry} />;

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
    />
  );
}
