'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Eye, 
  Gavel, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Plus,
  Menu,
  Bell,
  Search,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, isSupabaseConfigured, getSupabaseClient } from '@/lib/supabase';

function StatCard({ icon: Icon, label, value, color = 'blue', link }) {
  const colorClasses = {
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-500',
    emerald: 'bg-emerald-500',
  };
  
  const Wrapper = link ? Link : 'div';
  
  return (
    <Wrapper href={link} className="block">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{value}</h3>
        <p className="text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </Wrapper>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity');
  const [stats, setStats] = useState({
    watchlistCount: 0,
    activeBidsCount: 0,
    purchasesCount: 0,
    activeListingsCount: 0,
    soldCount: 0,
    closedCount: 0
  });
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const userId = localStorage.getItem('hw_user_id');
      
      if (!userId) {
        router.push('/login');
        return;
      }
      
      const supabase = getSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }
      
      // Fetch user profile
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) setUser(data);
      
      // Fetch stats
      try {
        // Purchases count
        const { count: purchasesCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('buyer_id', userId);

        // Active bids count
        const { data: userBids } = await supabase
          .from('bids')
          .select('auction_id')
          .eq('bidder_id', userId);
        
        const uniqueAuctions = new Set(userBids?.map(b => b.auction_id) || []);
        const { data: activeAuctions } = await supabase
          .from('auctions')
          .select('id')
          .eq('status', 'active')
          .in('id', Array.from(uniqueAuctions));
        
        // Watchlist count
        const { count: watchlistCount } = await supabase
          .from('watchlist')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        // Seller stats
        const { count: activeListingsCount } = await supabase
          .from('auctions')
          .select('*', { count: 'exact', head: true })
          .eq('seller_id', userId)
          .eq('status', 'active');

        const { count: soldCount } = await supabase
          .from('auctions')
          .select('*', { count: 'exact', head: true })
          .eq('seller_id', userId)
          .eq('status', 'sold');

        setStats({
          watchlistCount: watchlistCount || 0,
          activeBidsCount: activeAuctions?.length || 0,
          purchasesCount: purchasesCount || 0,
          activeListingsCount: activeListingsCount || 0,
          soldCount: soldCount || 0,
          closedCount: 0
        });
      } catch (e) {
        console.error('Error fetching stats:', e);
      }
      
      setLoading(false);
    }
    
    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">My Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Welcome back, {user?.full_name || 'User'}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatCard icon={Eye} label="Watchlist" value={stats.watchlistCount} color="blue" />
          <StatCard icon={Gavel} label="Active Bids" value={stats.activeBidsCount} color="amber" />
          <StatCard icon={ShoppingCart} label="Purchases" value={stats.purchasesCount} color="purple" />
          <StatCard icon={Package} label="Active Listings" value={stats.activeListingsCount} color="blue" />
          <StatCard icon={TrendingUp} label="Sold Items" value={stats.soldCount} color="emerald" />
          <StatCard icon={Plus} label="Create Listing" value="+" color="amber" link="/seller/create-listing" />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/auctions" className="px-4 py-2 bg-amber-500 text-white rounded-lg font-medium hover:bg-amber-600">
              Browse Auctions
            </Link>
            <Link href="/seller/create-listing" className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600">
              Sell an Item
            </Link>
            <Link href="/buyer/settings" className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white rounded-lg font-medium hover:bg-slate-300 dark:hover:bg-slate-600">
              Settings
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">My Dashboard</h3>
            <div className="space-y-4">
              <Link href="/buyer" className="block p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <p className="font-medium text-slate-800 dark:text-white">Buyer Dashboard</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">View your bids, purchases, and watchlist</p>
              </Link>
              <Link href="/seller" className="block p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <p className="font-medium text-slate-800 dark:text-white">Seller Dashboard</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage your listings and view analytics</p>
              </Link>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Recent Activity</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">No recent activity</p>
          </div>
        </div>
      </div>
    </div>
  );
}
