'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  BarChart3, 
  CreditCard, 
  Settings, 
  Menu,
  Search,
  Bell,
  TrendingUp,
  TrendingDown,
  Wallet,
  Eye,
  Package,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function SellerDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [stats, setStats] = useState([
    { label: 'Active Listings', value: '0', change: '+0', trend: 'up', icon: ShoppingCart },
    { label: 'Total Views', value: '0', change: '+0', trend: 'up', icon: Eye },
    { label: 'Pending Payments', value: '0', change: '+0', trend: 'up', icon: CreditCard },
    { label: 'Total Revenue', value: '¥0', change: '+0', trend: 'up', icon: TrendingUp },
  ]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  useEffect(() => {
    async function fetchData() {
      // Check if user is logged in
      const savedUser = localStorage.getItem('hw_user_info');
      if (!savedUser) {
        router.push('/login');
        return;
      }

      const userInfo = JSON.parse(savedUser);
      
      if (!isSupabaseConfigured() || !supabase) {
        setLoading(false);
        return;
      }

      try {
        // Fetch seller's auctions
        const { data: auctionsData } = await supabase
          .from('auctions')
          .select('*')
          .eq('seller_id', userInfo.id);

        const activeListings = (auctionsData || []).filter(a => a.status === 'active').length;
        const soldListings = (auctionsData || []).filter(a => a.status === 'sold').length;

        // Update stats
        setStats([
          { label: 'Active Listings', value: String(activeListings), change: '+0', trend: 'up', icon: ShoppingCart },
          { label: 'Total Views', value: '0', change: '+0', trend: 'up', icon: Eye },
          { label: 'Pending Payments', value: '0', change: '+0', trend: 'up', icon: CreditCard },
          { label: 'Sold Items', value: String(soldListings), change: '+0', trend: 'up', icon: TrendingUp },
        ]);

        // Set listings with proper null checks
        setListings((auctionsData || []).slice(0, 5).map(a => ({
          id: a.id,
          title: a.title || 'Untitled',
          image: (a.images && a.images[0]) || '',
          price: a.current_bid || a.starting_price || 0,
          bids: a.bid_count || 0,
          views: a.watch_count || 0,
          status: a.status || 'active'
        })));

        // Fetch orders where user is seller
        const { data: ordersData } = await supabase
          .from('orders')
          .select('*')
          .eq('seller_id', userInfo.id)
          .order('created_at', { ascending: false })
          .limit(5);

        setRecentOrders((ordersData || []).map(o => ({
          id: o.order_number || o.id,
          buyer: 'Buyer',
          amount: o.total_amount || 0,
          status: o.status || 'pending',
          date: o.created_at ? new Date(o.created_at).toLocaleDateString() : ''
        })));

      } catch (e) {
        console.error('Error fetching seller data:', e);
      }

      setLoading(false);
    }

    fetchData();
  }, [router]);

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'listings', name: 'My Listings', icon: ShoppingCart, link: '/seller/inventory' },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-emerald-500',
      sold: 'bg-blue-500',
      pending: 'bg-amber-500',
      completed: 'bg-emerald-500',
    };
    return colors[status] || 'bg-slate-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-slate-800 border-r border-slate-700 transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4 border-b border-slate-700">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-slate-700">
            <Menu className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
              </>
            );
            
            if (item.link) {
              return (
                <Link 
                  key={item.id} 
                  href={item.link}
                  className="w-full flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-colors text-slate-400 hover:bg-slate-700 hover:text-white"
                >
                  {content}
                </Link>
              );
            }
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                  activeMenu === item.id
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {content}
              </button>
            );
          })}
        </nav>

        {/* Wallet */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-700">
            <div className="bg-slate-700/50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Available Balance</span>
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xl font-bold text-white">¥0</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Header */}
        <header className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Seller Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button className="p-2 rounded-lg hover:bg-slate-700 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-slate-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-amber-500" />
                    </div>
                    <span className={`flex items-center text-sm font-medium text-emerald-500`}>
                      {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="ml-1">{stat.change}</span>
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Listings */}
            <div className="lg:col-span-2">
              <div className="bg-slate-800 rounded-xl">
                <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                  <h3 className="font-semibold">My Listings</h3>
                  <Link href="/seller/inventory" className="text-amber-500 text-sm hover:underline">View All</Link>
                </div>
                <div className="p-6">
                  {listings.length === 0 ? (
                    <p className="text-slate-400 text-center py-4">No listings yet</p>
                  ) : (
                    <div className="space-y-4">
                      {listings.map((listing) => (
                        <div key={listing.id} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0">
                            {listing.image ? (
                              <img src={listing.image} alt={listing.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">📱</div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{listing.title}</h4>
                            <p className="text-sm text-slate-400">¥{listing.price?.toLocaleString()} • {listing.bids} bids</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(listing.status)}`}>
                            {listing.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="lg:col-span-1">
              <div className="bg-slate-800 rounded-xl">
                <div className="p-6 border-b border-slate-700">
                  <h3 className="font-semibold">Recent Orders</h3>
                </div>
                <div className="p-6">
                  {recentOrders.length === 0 ? (
                    <p className="text-slate-400 text-center py-4">No orders yet</p>
                  ) : (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-sm">Order #{order.id}</h4>
                            <p className="text-xs text-slate-400">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">¥{order.amount?.toLocaleString()}</p>
                            <span className={`text-xs px-2 py-1 rounded-full text-white ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
