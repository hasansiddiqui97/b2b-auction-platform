'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Mail, Phone, MapPin, Calendar, Shield, Package, ShoppingCart, Gavel, Star, CheckCircle, Loader2, LogOut } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('hw_user_id');
    router.push('/login');
  };

  useEffect(() => {
    async function fetchUser() {
      // Get user ID from localStorage
      const userId = localStorage.getItem('hw_user_id');
      
      if (!userId) {
        // No logged in user, show message
        setLoading(false);
        return;
      }
      
      if (!isSupabaseConfigured || !supabase) {
        setLoading(false);
        return;
      }
      
      // Fetch the specific user by ID
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        setUser(data);
      }
      setLoading(false);
    }
    
    fetchUser();
  }, []);

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
              <p className="text-slate-500">No user found. Please register first.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Profile Header */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.full_name ? user.full_name.charAt(0) : 'U'}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  {user.full_name || 'User'}
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {user.email}</div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {user.phone}</div>
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">Wallet</p>
                <p className="text-2xl font-bold text-emerald-600">¥{Number(user.wallet_balance || 0).toLocaleString()}</p>
                <button 
                  onClick={handleLogout}
                  className="mt-3 flex items-center gap-1 text-sm text-slate-500 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { icon: Mail, label: 'Email', status: user.email_verified ? 'Verified' : 'Not verified' },
              { icon: Phone, label: 'Phone', status: user.phone_verified ? 'Verified' : 'Not verified' },
              { icon: Shield, label: 'Business', status: user.is_verified ? 'Verified Seller' : 'Not verified' }
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.status === 'Verified' || item.status === 'Verified Seller' ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-slate-100 dark:bg-slate-700'}`}>
                      <item.icon className={`w-5 h-5 ${item.status === 'Verified' || item.status === 'Verified Seller' ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </div>
                    <div><p className="font-medium">{item.label}</p><p className="text-sm text-slate-500">{item.status}</p></div>
                  </div>
                  {(item.status === 'Verified' || item.status === 'Verified Seller') && (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Package, label: 'Active Listings', value: '0', color: 'blue' },
              { icon: ShoppingCart, label: 'Purchases', value: '0', color: 'purple' },
              { icon: Gavel, label: 'Total Bids', value: '0', color: 'amber' },
              { icon: Star, label: 'Reviews', value: '0', color: 'rose' }
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900 rounded-lg flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div><p className="text-2xl font-bold">{stat.value}</p><p className="text-sm text-slate-500">{stat.label}</p></div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}