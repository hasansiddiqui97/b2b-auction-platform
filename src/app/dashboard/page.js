'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getSupabaseClient } from '@/lib/supabase';
import { 
  Mail, Phone, MapPin, Calendar, Shield, Package, ShoppingCart, Gavel, Star, 
  CheckCircle, Loader2, LogOut, Eye, Clock, Wallet, Settings, User, 
  TrendingUp, BadgeCheck, CreditCard, Bell
} from 'lucide-react';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activity');
  const router = useRouter();

  // For demo data
  const watchlistCount = 3;
  const activeBidsCount = 2;
  const purchasesCount = 5;
  const activeListingsCount = 6;
  const soldCount = 8;
  const closedCount = 3;

  useEffect(() => {
    async function fetchUser() {
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
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) setUser(data);
      setLoading(false);
    }
    
    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('hw_user_id');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
              <p className="text-slate-500">Please login to view your dashboard.</p>
              <Link href="/login" className="text-primary-500 hover:underline">Login here</Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const StatCard = ({ icon: Icon, label, value, color, link }) => (
    <Link href={link || '#'} className={`bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 bg-${color}-100 dark:bg-${color}-900 rounded-lg flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
          <p className="text-sm text-slate-500">{label}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Header */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.full_name ? user.full_name.charAt(0) : 'U'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                    Welcome back, {user.full_name ? user.full_name.split(' ')[0] : 'User'}!
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    {user.email_verified && <BadgeCheck className="w-4 h-4 text-emerald-500" />}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-slate-500">Wallet Balance</p>
                  <p className="text-2xl font-bold text-emerald-600">¥{Number(user.wallet_balance || 0).toLocaleString()}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {[
              { id: 'activity', label: 'My Activity', icon: TrendingUp },
              { id: 'listings', label: 'My Listings', icon: Package },
              { id: 'account', label: 'My Account', icon: User }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-slate-800 dark:bg-white text-white dark:text-slate-800' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">🛒 Buying Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard icon={Eye} label="Watchlist" value={watchlistCount} color="blue" link="/buyer/watchlist" />
                  <StatCard icon={Gavel} label="Active Bids" value={activeBidsCount} color="amber" link="/buyer/bids" />
                  <StatCard icon={ShoppingCart} label="Purchases" value={purchasesCount} color="purple" link="/buyer/orders" />
                </div>
              </div>
            </div>
          )}

          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">💰 Selling Activity</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard icon={Package} label="Active Listings" value={activeListingsCount} color="blue" link="/seller/inventory" />
                  <StatCard icon={TrendingUp} label="Sold Items" value={soldCount} color="emerald" link="/seller/sold" />
                  <StatCard icon={Clock} label="Closed Auctions" value={closedCount} color="slate" link="/seller/closed" />
                </div>
              </div>
              <div className="mt-4">
                <Link href="/seller/create-listing" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700">
                  <Package className="w-4 h-4" />
                  Create New Listing
                </Link>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">👤 My Information</h2>
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-500">Email</p>
                          <p className="text-slate-800 dark:text-white">{user.email}</p>
                        </div>
                        {user.email_verified && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-500">Phone</p>
                          <p className="text-slate-800 dark:text-white">{user.phone}</p>
                        </div>
                        {user.phone_verified && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-500">Date of Birth</p>
                          <p className="text-slate-800 dark:text-white">{user.dob || 'Not set'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-sm text-slate-500">Business Status</p>
                          <p className="text-slate-800 dark:text-white">{user.is_verified ? 'Verified Seller' : 'Not verified'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">⚙️ Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/buyer/settings" className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
                    <Settings className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">Account Settings</p>
                      <p className="text-sm text-slate-500">Password, notifications</p>
                    </div>
                  </Link>
                  <Link href="/buyer/notifications" className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
                    <Bell className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">Notifications</p>
                      <p className="text-sm text-slate-500">Manage alerts</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}