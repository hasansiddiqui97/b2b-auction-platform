'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { mockAuctions, categories, brands, grades, currentUser } from '@/data/mockData';

export default function AuctionListings() {
  const [auctions, setAuctions] = useState(mockAuctions);
  const [filteredAuctions, setFilteredAuctions] = useState(mockAuctions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 500000]);
  const [sortBy, setSortBy] = useState('ending-soon');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [watchlist, setWatchlist] = useState(currentUser.watchlist);
  const [isLoading, setIsLoading] = useState(false);
  const [showEndingSoon, setShowEndingSoon] = useState(false);

  // Filter and sort auctions
  useEffect(() => {
    let result = [...auctions];

    // Search filter
    if (searchQuery) {
      result = result.filter(auction => 
        auction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        auction.model.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(auction => auction.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== 'All Brands') {
      result = result.filter(auction => auction.brand === selectedBrand);
    }

    // Grade filter
    if (selectedGrade !== 'All') {
      result = result.filter(auction => auction.grade === selectedGrade);
    }

    // Price range filter
    result = result.filter(auction => 
      auction.currentBid >= priceRange[0] && auction.currentBid <= priceRange[1]
    );

    // Ending soon filter
    if (showEndingSoon) {
      result = result.filter(auction => {
        const hoursLeft = (new Date(auction.endTime) - new Date()) / (1000 * 60 * 60);
        return hoursLeft > 0 && hoursLeft < 24;
      });
    }

    // Sort
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
  }, [auctions, searchQuery, selectedCategory, selectedBrand, selectedGrade, priceRange, sortBy, showEndingSoon]);

  // Toggle watchlist
  const toggleWatchlist = (auctionId) => {
    setWatchlist(prev => 
      prev.includes(auctionId) 
        ? prev.filter(id => id !== auctionId)
        : [...prev, auctionId]
    );
  };

  // Simulate refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedBrand('All Brands');
    setSelectedGrade('All');
    setSortBy('ending-soon');
  };

  const activeFiltersCount = [
    searchQuery,
    selectedCategory !== 'All',
    selectedBrand !== 'All Brands',
    selectedGrade !== 'All'
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-900 dark:to-slate-800 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Hayaland Wholesale
          </h1>
          <p className="text-emerald-100 dark:text-emerald-400 mb-6">
            Premium Japanese electronics from verified sellers
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, model, category..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border-0 shadow-2xl text-slate-800 text-lg focus:ring-4 focus:ring-primary-300"
            />
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-6 mt-6 text-primary-100 dark:text-slate-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span>{auctions.filter(a => a.status === 'live').length} Live Auctions</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🗼 Tokyo Based Sellers</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🔒 Escrow Protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          {/* Left - Results count */}
          <div className="flex items-center space-x-4">
            <span className="text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-800 dark:text-white">{filteredAuctions.length}</span> auctions found
            </span>
            {activeFiltersCount > 0 && (
              <button 
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center space-x-1"
              >
                <X className="w-3 h-3" />
                <span>Clear filters</span>
              </button>
            )}
          </div>

          {/* Right - Controls */}
          <div className="flex items-center space-x-3">
            {/* Refresh Button */}
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-slate-600 dark:text-slate-300 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            {/* Filter Toggle (Mobile) */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 text-xs bg-primary-500 text-white rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-primary-500 cursor-pointer"
              >
                <option value="ending-soon">Ending Soon</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="most-bids">Most Bids</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="hidden md:flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-64 flex-shrink-0`}>
            <div className="glass-card p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800 dark:text-white flex items-center space-x-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </h3>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="input-field text-sm"
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Grade Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Condition Grade
                </label>
                <div className="space-y-2">
                  {grades.map(grade => (
                    <label key={grade} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="grade"
                        checked={selectedGrade === grade}
                        onChange={() => setSelectedGrade(grade)}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-400">{grade}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-emerald-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Live</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-emerald-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Ending Soon</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded text-emerald-600" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">Ended</span>
                  </label>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Price Range (¥)
                </label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="input-field text-sm"
                      placeholder="Min"
                    />
                    <span className="text-slate-400">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 500000])}
                      className="input-field text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>¥0</span>
                    <span>¥500,000+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Auction Grid */}
          <div className="flex-1">
            {filteredAuctions.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">No auctions found</h3>
                <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search query</p>
                <button onClick={clearFilters} className="btn-primary mt-4">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredAuctions.map(auction => (
                  <AuctionCard 
                    key={auction.id} 
                    auction={auction}
                    isWatched={watchlist.includes(auction.id)}
                    onToggleWatch={toggleWatchlist}
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
