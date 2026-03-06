'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  X,
  Heart,
  Eye,
  MapPin,
  CheckCircle,
  Star
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import AuctionCard from '@/components/AuctionCard';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockAuctions, currentUser } from '@/data/mockData';

export default function AuctionListings() {
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('ending-soon');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [watchlist, setWatchlist] = useState(currentUser.watchlist);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch auctions with seller info from Supabase
  useEffect(() => {
    async function fetchAuctions() {
      if (isSupabaseConfigured() && supabase) {
        const { data: auctionsData, error } = await supabase
          .from('auctions')
          .select('*, profiles(full_name, company_name, is_verified, location)')
          .eq('status', 'active')
          .order('end_time', { ascending: true });
        
        if (auctionsData && auctionsData.length > 0) {
          const transformed = auctionsData.map(a => ({
            id: a.id,
            title: a.title,
            description: a.description,
            images: a.images || [],
            seller: {
              id: a.seller_id,
              name: a.seller_name || 'Unknown Seller',
              company: a.seller_company,
              verified: a.seller_verified || false,
              location: a.seller_location || 'Tokyo, Japan',
              rating: 4.8,
            },
            category: a.category || 'Smartphones',
            brand: a.brand,
            model: a.model,
            grade: a.grade,
            startingPrice: a.starting_price,
            currentBid: a.current_bid,
            buyNowPrice: a.buy_now_price,
            bidCount: a.bid_count,
            watchers: Math.floor(Math.random() * 200) + 50,
            startTime: a.start_time,
            endTime: a.end_time,
            status: 'live',
          }));
          setAuctions(transformed);
          setFilteredAuctions(transformed);
          setIsLoading(false);
          return;
        }
      }
      // Fallback to mock data
      setAuctions(mockAuctions);
      setFilteredAuctions(mockAuctions);
      setIsLoading(false);
    }

    fetchAuctions();
  }, []);

  // Simple filter - just show all auctions
  useEffect(() => {
    if (!isLoading && auctions.length > 0) {
      setFilteredAuctions(auctions);
    }
  }, [auctions, isLoading]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Hayaland Wholesale</h1>
          <p className="text-emerald-100 mb-6">Premium Japanese electronics from verified sellers</p>
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input type="text" placeholder="Search by brand, model, category..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-slate-800" />
          </div>
          <div className="flex flex-wrap gap-4 mt-6 text-white/90">
            <span>📦 {auctions.length} Live Auctions</span>
            <span>🏪 Verified Sellers</span>
            <span>🔒 Escrow Protected</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64">
            <div className="glass-card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Filters</h3>
                <button onClick={() => {setSearchQuery(''); setSelectedCategory('All'); setSelectedBrand('All');}} className="text-sm text-primary-500">Clear</button>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="input-field">
                  <option value="All">All Categories</option>
                  <option value="Smartphones">Smartphones</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Tablets">Tablets</option>
                  <option value="Audio">Audio</option>
                  <option value="Cameras">Cameras</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Brand</label>
                <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="input-field">
                  <option value="All Brands">All Brands</option>
                  <option value="Apple">Apple</option>
                  <option value="Sony">Sony</option>
                  <option value="Nintendo">Nintendo</option>
                  <option value="Canon">Canon</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            <div className="glass-card p-4 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-slate-600">{filteredAuctions.length} auctions</p>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-field">
                  <option value="ending-soon">Ending Soon</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="most-bids">Most Bids</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">Loading...</div>
            ) : filteredAuctions.length === 0 ? (
              <div className="glass-card p-12 text-center">No auctions found</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAuctions.map(auction => (
                  <Link key={auction.id} href={`/auction/${auction.id}`}>
                    <div className="glass-card p-4 hover:shadow-lg transition-shadow">
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-slate-100">
                        {auction.images?.[0] ? (
                          <Image src={auction.images[0]} alt={auction.title} fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
                        )}
                        <span className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                          {auction.grade}
                        </span>
                      </div>
                      <h3 className="font-medium text-slate-800 line-clamp-2 mb-1">{auction.title}</h3>
                      
                      {/* Listed by */}
                      <div className="flex items-center space-x-1 mb-2">
                        <span className="text-xs text-slate-500">Listed by</span>
                        <span className="text-xs font-medium text-primary-600">{auction.seller?.name}</span>
                        {auction.seller?.verified && (
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-primary-600">¥{auction.currentBid?.toLocaleString()}</p>
                          <p className="text-xs text-slate-500">{auction.bidCount} bids</p>
                        </div>
                        <span className="text-xs text-slate-400">{auction.seller?.location}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
