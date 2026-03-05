'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Clock, 
  Gavel, 
  Heart, 
  Share2, 
  Shield, 
  MapPin, 
  Star, 
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Wallet,
  TrendingUp,
  Users,
  Eye,
  Bell,
  Truck,
  Package
} from 'lucide-react';
import { mockAuctions, currentUser } from '@/data/mockData';

export default function AuctionDetail({ params }) {
  const { id } = params;
  const router = useRouter();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState('');
  const [isWatched, setIsWatched] = useState(false);
  const [myMaxBid, setMyMaxBid] = useState('');
  const [autoBidEnabled, setAutoBidEnabled] = useState(false);

  // Load auction data
  useEffect(() => {
    const found = mockAuctions.find(a => a.id === id);
    if (found) {
      setAuction(found);
      setIsWatched(currentUser.watchlist.includes(found.id));
      setBidAmount(found.currentBid + 1000); // Default to next bid
    }
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!auction) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(auction.endTime);
      const diff = end - now;

      if (diff <= 0) return 'Ended';

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        return `${days}d ${hours % 24}h`;
      }
      return `${hours}h ${minutes}m ${seconds}s`;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [auction]);

  // Simulate real-time bid updates
  useEffect(() => {
    if (!auction || timeLeft === 'Ended') return;

    const simulateBid = () => {
      setAuction(prev => ({
        ...prev,
        currentBid: prev.currentBid + Math.floor(Math.random() * 2000) + 500,
        bidCount: prev.bidCount + 1,
        highestBidder: `buyer-${Math.floor(Math.random() * 200)}`,
      }));
    };

    const randomInterval = Math.random() * 45000 + 15000;
    const timer = setTimeout(simulateBid, randomInterval);
    return () => clearTimeout(timer);
  }, [auction?.id, timeLeft]);

  if (!auction) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading auction...</p>
        </div>
      </div>
    );
  }

  const isEnded = auction.status === 'ended' || timeLeft === 'Ended';
  const isEnding = timeLeft !== 'Ended' && parseInt(timeLeft) < 24 && timeLeft.includes('h');
  const isWinning = auction.highestBidder === currentUser.id;
  const minBid = auction.currentBid + 500;

  const handlePlaceBid = async () => {
    setBidError('');
    setBidSuccess('');

    const bid = parseInt(bidAmount);
    if (isNaN(bid) || bid < minBid) {
      setBidError(`Minimum bid is ¥${minBid.toLocaleString()}`);
      return;
    }

    if (bid > currentUser.balance) {
      setBidError('Insufficient wallet balance');
      return;
    }

    setIsPlacingBid(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setAuction(prev => ({
      ...prev,
      currentBid: bid,
      bidCount: prev.bidCount + 1,
      highestBidder: currentUser.id,
      bids: [...prev.bids, {
        id: `bid-${Date.now()}`,
        bidder: currentUser.id,
        amount: bid,
        time: new Date()
      }]
    }));

    setBidSuccess(`Bid of ¥${bid.toLocaleString()} placed successfully!`);
    setIsPlacingBid(false);
  };

  const handleBuyNow = async () => {
    setBidError('');
    setIsPlacingBid(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setBidSuccess(`Congratulations! You won this auction for ¥${auction.buyNowPrice.toLocaleString()}!`);
    setIsPlacingBid(false);
  };

  const formatPrice = (price) => `¥${price.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors pb-20">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <button onClick={() => router.back()} className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 hover:text-primary-600">
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Auctions</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="glass-card p-4">
              {/* Main Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4">
                <img 
                  src={auction.images[currentImageIndex]} 
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  {isEnded ? (
                    <span className="badge-ended text-sm px-3 py-1">Auction Ended</span>
                  ) : (
                    <span className={`${isEnding ? 'bg-rose-500' : 'badge-live'} text-sm px-3 py-1`}>
                      {isEnding ? 'Ending Soon' : 'Live'}
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {auction.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {auction.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        currentImageIndex === idx ? 'border-primary-500' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Meta */}
            <div className="glass-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded">
                      {auction.category}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                      Grade {auction.grade}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {auction.title}
                  </h1>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsWatched(!isWatched)}
                    className={`p-2 rounded-lg border transition-colors ${
                      isWatched 
                        ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-500'
                        : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWatched ? 'fill-current' : ''}`} />
                  </button>
                  <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-primary-500">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Seller Info */}
              <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {auction.seller.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="font-semibold text-slate-800 dark:text-white">{auction.seller.name}</span>
                      {auction.seller.verified && <CheckCircle className="w-4 h-4 text-primary-500" />}
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{auction.seller.location}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-amber-400 fill-current" />
                        <span>{auction.seller.rating}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <button className="btn-secondary text-sm">
                  View Seller Profile
                </button>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Description</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {auction.description}
                </p>
              </div>

              {/* Product Specs */}
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-3">Specifications</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: 'Brand', value: auction.brand },
                    { label: 'Model', value: auction.model },
                    { label: <span key="storage">Storage</span>, value: auction.storage },
                    { label: 'Color', value: auction.color },
                    { label: 'Condition', value: auction.condition },
                    { label: 'Grade', value: auction.grade },
                  ].map((spec, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-500 dark:text-slate-400">{spec.label}</p>
                      <p className="font-medium text-slate-800 dark:text-white">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bid History */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                <span>Bid History ({auction.bidCount} bids)</span>
              </h3>
              <div className="space-y-3">
                {auction.bids.length > 0 ? (
                  [...auction.bids].reverse().map((bid, idx) => (
                    <div key={bid.id} className={`flex items-center justify-between p-3 rounded-lg ${
                      idx === 0 ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800/50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          idx === 0 ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {bid.bidder.slice(-2)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white">
                            {bid.bidder === currentUser.id ? 'You' : bid.bidder}
                            {idx === 0 && <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-400">(Winning)</span>}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(bid.time).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-800 dark:text-white">
                        ¥{bid.amount.toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-4">No bids yet. Be the first!</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Bidding Panel */}
          <div className="space-y-6">
            {/* Current Bid Card */}
            <div className="glass-card p-6 sticky top-24">
              {/* Timer */}
              <div className={`text-center p-4 rounded-xl mb-4 ${
                isEnding ? 'bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800' : 'bg-slate-50 dark:bg-slate-800/50'
              }`}>
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <Clock className={`w-5 h-5 ${isEnding ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`} />
                  <span className="text-sm text-slate-500 dark:text-slate-400">Time Remaining</span>
                </div>
                <p className={`text-2xl font-bold ${isEnding ? 'text-rose-500' : 'text-slate-800 dark:text-white'}`}>
                  {timeLeft}
                </p>
              </div>

              {/* Current Bid */}
              <div className="mb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Current Bid</p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {formatPrice(auction.currentBid)}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {auction.bidCount} bids · {auction.watchers} watching
                </p>
              </div>

              {/* Winning Status */}
              {isWinning && !isEnded && (
                <div className="flex items-center space-x-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg mb-4">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">You're the highest bidder!</span>
                </div>
              )}

              {!isWinning && !isEnded && auction.highestBidder !== currentUser.id && (
                <div className="flex items-center space-x-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-4">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium text-amber-700 dark:text-amber-300">You've been outbid</span>
                </div>
              )}

              {/* Bid Input */}
              {!isEnded && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Your Bid (Min: {formatPrice(minBid)})
                    </label>
                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      className="input-field text-lg font-semibold"
                      placeholder={minBid.toString()}
                    />
                  </div>

                  {bidError && (
                    <div className="flex items-center space-x-2 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      <span className="text-sm text-rose-600 dark:text-rose-400">{bidError}</span>
                    </div>
                  )}

                  {bidSuccess && (
                    <div className="flex items-center space-x-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm text-emerald-600 dark:text-emerald-400">{bidSuccess}</span>
                    </div>
                  )}

                  <button
                    onClick={handlePlaceBid}
                    disabled={isPlacingBid}
                    className="w-full btn-primary py-4 text-lg flex items-center justify-center space-x-2"
                  >
                    {isPlacingBid ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Placing Bid...</span>
                      </>
                    ) : (
                      <>
                        <Gavel className="w-5 h-5" />
                        <span>Place Bid</span>
                      </>
                    )}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white dark:bg-slate-900 text-slate-500">or</span>
                    </div>
                  </div>

                  <button
                    onClick={handleBuyNow}
                    disabled={isPlacingBid}
                    className="w-full py-4 text-lg font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <Wallet className="w-5 h-5" />
                    <span>Buy Now — {formatPrice(auction.buyNowPrice)}</span>
                  </button>

                  {/* Auto Bid */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4 text-primary-500" />
                        <span className="font-medium text-slate-700 dark:text-slate-300">Auto Bid</span>
                      </div>
                      <button
                        onClick={() => setAutoBidEnabled(!autoBidEnabled)}
                        className={`w-11 h-6 rounded-full transition-colors ${
                          autoBidEnabled ? 'bg-primary-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          autoBidEnabled ? 'translate-x-5' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                    {autoBidEnabled && (
                      <div>
                        <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Maximum bid</label>
                        <input
                          type="number"
                          value={myMaxBid}
                          onChange={(e) => setMyMaxBid(e.target.value)}
                          placeholder={auction.buyNowPrice.toString()}
                          className="input-field text-sm"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          We'll bid for you up to this amount
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {isEnded && (
                <div className="text-center py-6">
                  <p className="text-lg font-semibold text-slate-600 dark:text-slate-400 mb-2">Auction Ended</p>
                  {isWinning ? (
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold">🎉 Congratulations! You won!</p>
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400">Winning bid: {formatPrice(auction.currentBid)}</p>
                  )}
                </div>
              )}

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center space-x-4 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span>Escrow Protected</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified Seller</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="glass-card p-4">
              <h4 className="font-medium text-slate-700 dark:text-slate-300 mb-3">Auction Stats</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Starting Price</span>
                  <span className="font-medium text-slate-800 dark:text-white">{formatPrice(auction.startingPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Total Bids</span>
                  <span className="font-medium text-slate-800 dark:text-white">{auction.bidCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Watchers</span>
                  <span className="font-medium text-slate-800 dark:text-white">{auction.watchers}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Items */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Similar Items You May Like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockAuctions
                .filter(a => a.id !== auction.id && a.category === auction.category)
                .slice(0, 4)
                .map((item) => (
                  <Link key={item.id} href={`/auction/${item.id}`}>
                    <div className="glass-card p-3 hover:shadow-lg transition-shadow">
                      <img src={item.images[0]} alt={item.title} className="w-full aspect-square rounded-lg object-cover mb-3" />
                      <p className="font-medium text-slate-800 dark:text-white text-sm line-clamp-2">{item.title}</p>
                      <p className="text-emerald-600 dark:text-emerald-400 font-bold mt-1">¥{item.currentBid.toLocaleString()}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}