'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  SlidersHorizontal,
  X,
  ChevronDown,
  RefreshCw,
  Clock,
  TrendingUp,
  Sparkles,
  Eye,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import AuctionCard from '@/components/AuctionCard';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { mockAuctions, categories, brands, grades, currentUser } from '@/data/mockData';

export default function AuctionListings() {
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [sortBy, setSortBy] = useState('ending-soon');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [watchlist, setWatchlist] = useState(currentUser.watchlist);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch auctions from Supabase
  useEffect(() => {
    async function fetchAuctions() {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from('auctions')
          .select('*')
          .eq('status', 'active')
          .order('end_time', { ascending: true });
        
        if (data && data.length > 0) {
          // Transform Supabase data to match expected format
          const transformed = data.map(a => ({
            id: a.id,
            title: a.title,
            description: a.description,
            images: a.images || [],
            seller: {
              id: a.seller_id || 'sel-001',
              name: 'Hayaland Electronics',
              rating: 4.8,
              verified: true,
              location: 'Tokyo, Japan',
            },
            category: 'Smartphones',
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

  // Filter and sort auctions
  useEffect(() => {
    if (isLoading) return;
    
    let result = [...auctions];
    
    if (result.length === 0) {
      setFilteredAuctions([]);
      return;
    }

    if (searchQuery) {
      result = result.filter(auction => 
        auction.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.model?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(auction => auction.category === selectedCategory);
    }

    if (selectedBrand !== 'All Brands') {
      result = result.filter(auction => auction.brand === selectedBrand);
    }

    if (selectedGrade !== 'All') {
      result = result.filter(auction => auction.grade === selectedGrade);
    }

    // Price filter
    const minPrice = priceRange[0];
    const maxPrice = priceRange[1];
    if (minPrice > 0 || maxPrice < 500000) {
      result = result.filter(auction => {
        const price = auction.currentBid || 0;
        return price >= minPrice && price <= maxPrice;
      });
    }

    switch (sortBy) {
      case 'ending-soon':
        result.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
        break;
      case 'price-low':
        result.sort((a, b) => a.currentBid - b.currentBid);
        break;
      case 'price-high':
        result.sort((a, b) => b.currentBid - a.currentBid);
        break;
      case 'most-bids':
        result.sort((a, b) => b.bidCount - a.bidCount);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        break;
    }

    setFilteredAuctions(result);
  }, [auctions, searchQuery, selectedCategory, selectedBrand, selectedGrade, priceRange, sortBy, isLoading]);

  const toggleWatch = (auctionId) => {
    if (watchlist.includes(auctionId)) {
      setWatchlist(watchlist.filter(id => id !== auctionId));
    } else {
      setWatchlist([...watchlist, auctionId]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedGrade('All');
    setPriceRange([0, 500000]);
    setSortBy('ending-soon');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-900 dark:to-slate-800 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Hayaland Wholesale</h1>
          <p className="text-emerald-100 mb-6">Premium Japanese electronics from verified sellers</p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by brand, model, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl bg-white dark:bg-slate-800 border-0 text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-white/30 shadow-lg"
            />
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center space-x-2 text-white/90">
              <Sparkles className="w-5 h-5" />
              <span>{auctions.length} Live Auctions</span>
            </div>
            <div className="flex items-center space-x-2 text-white/90">
              <TrendingUp className="w-5 h-5" />
              <span>🗼 Tokyo Based Sellers</span>
            </div>
            <div className="flex items-center space-x-2 text-white/90">
              <Clock className="w-5 h-5" />
              <span>🔒 Escrow Protected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="glass-card p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 dark:text-white">Filters</h3>
                <button onClick={clearFilters} className="text-sm text-primary-500 hover:text-primary-600">
                  Clear all
                </button>
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full input-field"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Brand</label>
                <select 
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full input-field"
                >
                  <option value="All Brands">All Brands</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Grade */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Condition Grade</label>
                <div className="space-y-2">
                  {grades.map(grade => (
                    <label key={grade} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="grade"
                        value={grade}
                        checked={selectedGrade === grade}
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        className="text-primary-500"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-300">{grade}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Price Range (¥)</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="input-field"
                    placeholder="Min"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="input-field"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="glass-card p-4 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-slate-600 dark:text-slate-300">
                  {filteredAuctions.length} auctions found
                </p>
                
                <div className="flex items-center space-x-3">
                  {/* Sort */}
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input-field"
                  >
                    <option value="ending-soon">Ending Soon</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="most-bids">Most Bids</option>
                    <option value="newest">Newest First</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Mobile Filter Toggle */}
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800"
                  >
                    <SlidersHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden glass-card p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800 dark:text-white">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {/* Same filter controls - simplified for mobile */}
                <button onClick={clearFilters} className="btn-primary w-full">
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Auction Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 text-primary-500 animate-spin mx-auto" />
                <p className="mt-4 text-slate-500">Loading auctions...</p>
              </div>
            ) : filteredAuctions.length === 0 ? (
              <div className="text-center py-12 glass-card">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">No auctions found</h3>
                <p className="text-slate-500 mb-4">Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAuctions.map(auction => (
                  <AuctionCard 
                    key={auction.id} 
                    auction={auction}
                    isWatched={watchlist.includes(auction.id)}
                    onToggleWatch={() => toggleWatch(auction.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAuctions.map(auction => (
                  <AuctionCard 
                    key={auction.id} 
                    auction={auction}
                    isWatched={watchlist.includes(auction.id)}
                    onToggleWatch={() => toggleWatch(auction.id)}
                    variant="list"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
