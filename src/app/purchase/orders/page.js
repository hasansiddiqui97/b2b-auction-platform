'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
} from 'lucide-react';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        // Check if user is available
        if (!user) {
          console.log('No user logged in');
          setLoading(false);
          return;
        }

        // Check if Supabase is configured
        if (!isSupabaseConfigured()) {
          console.log('Supabase not configured');
          setLoading(false);
          return;
        }

        if (!supabase) {
          console.log('Supabase client is null');
          setLoading(false);
          return;
        }

        console.log('Fetching orders for user:', user.id);

        // Fetch orders where buyer_id matches current user
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false });

        if (ordersError) {
          console.error('Error fetching orders:', ordersError);
          setError(ordersError.message);
          setLoading(false);
          return;
        }

        console.log('Orders data:', ordersData);

        if (!ordersData || ordersData.length === 0) {
          setOrders([]);
          setLoading(false);
          return;
        }

        // Fetch auction details for each order
        const ordersWithAuctions = await Promise.all(
          ordersData.map(async (order) => {
            let auction = null;
            let seller = null;
            
            try {
              if (order.auction_id) {
                const { data: auctionData } = await supabase
                  .from('auctions')
                  .select('title, images')
                  .eq('id', order.auction_id)
                  .single();
                auction = auctionData;
              }
              
              if (order.seller_id) {
                const { data: sellerData } = await supabase
                  .from('profiles')
                  .select('full_name')
                  .eq('id', order.seller_id)
                  .single();
                seller = sellerData;
              }
            } catch (e) {
              console.error('Error fetching related data:', e);
            }

            return {
              id: order.order_number || order.id,
              items: auction ? [{
                title: auction.title || 'Unknown Item',
                image: (auction.images && auction.images[0]) ? auction.images[0] : '',
                price: order.total_amount || 0,
                quantity: 1
              }] : [],
              seller: seller?.full_name || 'Seller',
              total: order.total_amount || 0,
              status: order.status || 'unknown',
              date: order.created_at ? new Date(order.created_at).toISOString().split('T')[0] : '',
              tracking: order.tracking_number || '',
              carrier: order.shipping_carrier || '',
            };
          })
        );
        
        setOrders(ordersWithAuctions);
      } catch (err) {
        console.error('Exception in fetchOrders:', err);
        setError(err.message);
      }
      
      setLoading(false);
    }

    fetchOrders();
  }, [user]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-500',
      paid: 'bg-blue-500',
      shipped: 'bg-blue-500',
      completed: 'bg-emerald-500',
      delivered: 'bg-emerald-500',
    };
    return colors[status] || 'bg-slate-500';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': 
      case 'completed':
        return CheckCircle;
      case 'shipped': return Truck;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <Package className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold dark:text-white mb-2">Error</h2>
          <p className="text-slate-500 dark:text-slate-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <Package className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold dark:text-white mb-2">Please log in</h2>
          <p className="text-slate-500 dark:text-slate-400">Log in to view your orders</p>
        </div>
      </div>
    );
  }

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'paid', 'shipped', 'completed'].includes(order.status);
    if (activeTab === 'delivered') return order.status === 'delivered' || order.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold dark:text-white">My Purchases</h1>
            <p className="text-slate-500 dark:text-slate-400">View your order history</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'all', name: 'All', count: orders.length },
            { id: 'active', name: 'Active', count: orders.filter(o => ['pending', 'paid', 'shipped', 'completed'].includes(o.status)).length },
            { id: 'delivered', name: 'Delivered', count: orders.filter(o => o.status === 'delivered' || o.status === 'completed').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                    <span className="font-medium dark:text-white">Order #{order.id}</span>
                    <span className={`px-2 py-1 text-xs rounded-full text-white ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{order.date}</span>
                </div>
                
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    {item.image && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100">
                        <Image src={item.image} alt={item.title} width={80} height={80} className="object-cover w-full h-full" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium dark:text-white">{item.title}</h3>
                      <p className="text-amber-500 font-bold">¥{item.price?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Seller: {order.seller}</span>
                  <span className="text-lg font-bold dark:text-white">Total: ¥{order.total?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
