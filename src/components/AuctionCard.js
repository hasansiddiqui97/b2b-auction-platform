'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Clock, 
  Users, 
  Gavel, 
  Eye,
  Heart,
  CheckCircle,
  MapPin,
  Star
} from 'lucide-react';

export default function AuctionCard({ auction, isWatched, onToggleWatch }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isFlashing, setIsFlashing] = useState(false);

  // Calculate time remaining
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(auction.endTime);
      const diff = end - now;

      if (diff <= 0) {
        return 'Ended';
      }

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

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [auction.endTime]);

  const isEnding = timeLeft !== 'Ended' && parseInt(timeLeft) < 24 && timeLeft.includes('h');
  const isEnded = auction.status === 'ended' || timeLeft === 'Ended';

  // Simulate bid updates
  useEffect(() => {
    if (isEnded) return;

    const simulateBid = () => {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 500);
    };

    // Random bid update every 30-60 seconds
    const randomInterval = Math.random() * 30000 + 30000;
    const timer = setTimeout(simulateBid, randomInterval);

    return () => clearTimeout(timer);
  }, [auction.id, isEnded]);

  const formatPrice = (price) => {
    return `¥${price.toLocaleString()}`;
  };

  const getGradeColor = (grade) => {
    const colors = {
      'New': 'bg-emerald-500',
      'A+': 'bg-primary-500',
      'A': 'bg-blue-500',
      'B': 'bg-amber-500',
      'C': 'bg-slate-500',
    };
    return colors[grade] || 'bg-slate-500';
  };

  return (
    <Link href={`/auction/${auction.id}`}>
      <div className={`glass-card p-4 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${isFlashing ? 'animate-bid-flash' : ''}`}>
        {/* Image Container */}
        <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800">
          <Image 
            src={auction.images[0]} 
            alt={auction.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          
          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            {isEnded ? (
              <span className="badge-ended">Ended</span>
            ) : (
              <span className={`${isEnding ? 'badge bg-rose-500' : 'badge-live'}`}>
                {isEnding ? 'Ending Soon' : 'Live'}
              </span>
            )}
          </div>

          {/* Watch Button */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              onToggleWatch(auction.id);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-lg hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <Heart 
              className={`w-4 h-4 ${isWatched ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} 
            />
          </button>

          {/* Grade Badge */}
          <div className="absolute bottom-3 left-3">
            <span className={`px-2 py-1 text-xs font-bold text-white rounded-lg ${getGradeColor(auction.grade)}`}>
              Grade {auction.grade}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-slate-800 dark:text-white line-clamp-2 text-sm leading-tight">
            {auction.title}
          </h3>

          {/* Seller Info */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400">{auction.seller.location}</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <div className="flex items-center space-x-1">
              {auction.seller.verified && (
                <CheckCircle className="w-3 h-3 text-primary-500" />
              )}
              <span className="text-xs text-slate-500 dark:text-slate-400">{auction.seller.name}</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">Current Bid</span>
              <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                {formatPrice(auction.currentBid)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">{auction.bidCount} bids</span>
              <span className="text-xs text-slate-400 dark:text-slate-500">Buy Now: {formatPrice(auction.buyNowPrice)}</span>
            </div>
          </div>

          {/* Footer - Time & Watchers */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center space-x-1">
              <Clock className={`w-4 h-4 ${isEnding ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
              <span className={`text-sm font-medium ${isEnding ? 'text-rose-500' : 'text-slate-600 dark:text-slate-300'}`}>
                {timeLeft}
              </span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400">
              <Eye className="w-4 h-4" />
              <span className="text-xs">{auction.watchers}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
