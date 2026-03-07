'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Gavel, 
  Package, 
  Heart, 
  Settings, 
  Wallet,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  CreditCard,
  Bell,
  Shield,
  History,
  Search
} from 'lucide-react';
// No mock data - would fetch from Supabase in production

export default function BuyerDashboard() {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('bids');
  const [bids, setBids] = useState([]);
  const [orders, setOrders] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  
  // Mock data
  useEffect(() => {
    // Mock bids
    setBids([
      {
        id: 'auc-001',
        title: 'iPhone 15 Pro Max 256GB Natural Titanium',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200',
        currentBid: 92500,
        myBid: 92000,
        status: 'outbid',
        endsIn: '6h 23m'
      },
      {
        id: 'auc-002',
        title: 'MacBook Pro 14" M3 Pro 512GB',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200',
        currentBid: 278000,
        myBid: 278000,
        status: 'winning',
        endsIn: '12h 45m'
      },
      {
        id: 'auc-004',
        title: 'iPad Pro 12.9" M2 256GB',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200',
        currentBid: 105000,
        myBid: 100000,
        status: 'outbid',
        endsIn: '24h 10m'
      }
    ]);

    // Mock orders
    setOrders([
      {
        id: 'ord-001',
        title: 'Sony WH-1000XM5 Headphones',
        image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200',
        price: 18500,
        status: 'shipped',
        date: '2026-03-01',
        tracking: 'YT1234567890'
      },
      {
        id: 'ord-002',
        title: 'iPad Pro 11" M4 256GB',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200',
        price: 98000,
        status: 'delivered',
        date: '2026-02-25',
        tracking: 'YT9876543210'
      }
    ]);

    // Empty watchlist - would fetch from Supabase in production
    setWatchlist([]);
  }, []);

  const tabs = [
    { id: 'bids', name: 'My Bids', icon: Gavel, count: bids.length },
    { id: 'purchases', name: 'Purchases', icon: Package, href: '/purchase/orders', count: orders.length },
    { id: 'watchlist', name: 'Watchlist', icon: Heart, count: watchlist.length },
  ];

  const getStatusColor = (status) => {
    const colors = {
      winning: 'bg-emerald-500',
      outbid: 'bg-amber-500',
      shipped: 'bg-blue-500',
      delivered: 'bg-emerald-500',
      pending: 'bg-slate-500'
    };
    return colors[status] || 'bg-slate-500';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'winning': return <CheckCircle className="w-4 h-4" />;
      case 'outbid': return <AlertCircle className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <Package className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-900 dark:to-slate-800 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Hayaland Wholesale</h1>
              <p className="text-emerald-100 mt-1">Welcome back</p>
            </div>
            {/* Wallet Card */}
            <div className="glass-card p-4 w-full sm:min-w-64">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Wallet Balance</span>
                <Wallet className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                ¥0
              </p>
              <button className="mt-2 w-full text-sm text-primary-600 hover:text-primary-700 font-medium">
                Add Funds →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Quick Actions */}
        <div className="glass-card p-4 mb-4">
          <div className="flex flex-wrap gap-3">
            <Link href="/auctions" className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
              <Search className="w-4 h-4" />
              <span className="font-medium">Browse Auctions</span>
            </Link>
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors">
              <Bell className="w-4 h-4" />
              <span className="font-medium">Create Alert</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors">
              <CreditCard className="w-4 h-4" />
              <span className="font-medium">Add Funds</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <Gavel className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{bids.length}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Active Bids</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">1</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Won</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{orders.length}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Orders</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{watchlist.length}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Watchlist</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - scrollable on mobile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex space-x-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl mb-6 w-fit min-w-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const content = (
                <>
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm sm:text-base">{tab.name}</span>
                  <span className="px-2 py-0.5 text-xs bg-slate-200 dark:bg-slate-600 rounded-full">
                    {tab.count}
                  </span>
                </>
              );
              
              if (tab.href) {
                return (
                  <Link
                    key={tab.id}
                    href={tab.href}
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    {content}
                  </Link>
                );
              }
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'bids' && (
          <div className="space-y-4">
            {bids.map((bid) => (
              <Link key={bid.id} href={`/auction/${bid.id}`}>
                <div className="glass-card p-4 flex items-center space-x-4 hover:shadow-lg transition-shadow">
                  <img 
                    src={bid.image} 
                    alt={bid.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-white">{bid.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Ends in {bid.endsIn}</p>
                      </div>
                      <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(bid.status)}`}>
                        {getStatusIcon(bid.status)}
                        <span className="capitalize">{bid.status}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 mt-2">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">My Bid</p>
                        <p className="font-semibold text-slate-800 dark:text-white">¥{bid.myBid.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Current</p>
                        <p className="font-semibold text-primary-600 dark:text-primary-400">¥{bid.currentBid.toLocaleString()}</p>
                      </div>
                      {bid.status === 'outbid' && (
                        <button className="btn-primary text-sm py-1">
                          Rebid
                        </button>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 mb-4">View your purchase history</p>
            <Link href="/purchase/orders" className="inline-block px-6 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600">
              View Purchases
            </Link>
          </div>
        )}

        {activeTab === 'watchlist' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map((auction) => (
              <Link key={auction.id} href={`/auction/${auction.id}`}>
                <div className="glass-card p-4 hover:shadow-lg transition-shadow">
                  <img 
                    src={auction.images[0]} 
                    alt={auction.title}
                    className="w-full aspect-video rounded-lg object-cover mb-3"
                  />
                  <h3 className="font-semibold text-slate-800 dark:text-white line-clamp-2">{auction.title}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Current Bid</p>
                      <p className="font-bold text-primary-600 dark:text-primary-400">¥{auction.currentBid.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500 dark:text-slate-400">{auction.bidCount} bids</p>
                      <p className="text-xs text-slate-400">{auction.watchers} watching</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            {watchlist.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">Your watchlist is empty</p>
                <Link href="/auctions" className="btn-primary mt-4 inline-block">
                  Browse Auctions
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}