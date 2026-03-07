'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  Package,
  Truck,
  CheckCircle,
  Clock,
  Search,
  ChevronRight,
} from 'lucide-react';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      if (!user || !isSupabaseConfigured() || !supabase) {
        setLoading(false);
        return;
      }

      // Fetch orders where buyer_id matches current user
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        // Fetch auction details for each order
        const ordersWithAuctions = await Promise.all(
          (ordersData || []).map(async (order) => {
            const { data: auction } = await supabase
              .from('auctions')
              .select('*')
              .eq('id', order.auction_id)
              .single();
            
            const { data: seller } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', order.seller_id)
              .single();

            return {
              id: order.order_number || order.id,
              items: auction ? [{
                title: auction.title,
                image: auction.images?.[0] || '',
                price: order.total_amount,
                quantity: 1
              }] : [],
              seller: seller?.full_name || 'Seller',
              total: order.total_amount,
              status: order.status,
              date: new Date(order.created_at).toISOString().split('T')[0],
              tracking: order.tracking_number || '',
              carrier: order.shipping_carrier || '',
            };
          })
        );
        setOrders(ordersWithAuctions);
      }
      setLoading(false);
    }

    fetchOrders();
  }, [user]);

  const tabs = [
    { id: 'all', name: 'All Orders', count: orders.length },
    { id: 'active', name: 'Active', count: orders.filter(o => ['pending', 'paid', 'shipped', 'completed'].includes(o.status)).length },
    { id: 'delivered', name: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
  ];

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
      case 'paid': return Shield;
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
  }).filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-900 dark:to-slate-800 pt-8 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">My Orders</h1>
          <p className="text-emerald-100 mt-1">Track and manage your purchases</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.name}
              <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="glass-card p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by order ID or product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <div key={order.id} className="glass-card overflow-hidden">
                  {/* Order Header */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(order.status)}`}>
                        <StatusIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white">{order.id}</p>
                        <p className="text-sm text-slate-500">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full text-white capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={item.image} alt={item.title} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-800 dark:text-white text-sm line-clamp-1">{item.title}</p>
                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-semibold text-slate-800 dark:text-white">¥{item.price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <div>
                        <p className="text-sm text-slate-500">Seller: {order.seller}</p>
                        {order.tracking && (
                          <p className="text-sm text-slate-500 flex items-center space-x-1">
                            <Truck className="w-3 h-3" />
                            <span>{order.carrier}: {order.tracking}</span>
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">¥{order.total.toLocaleString()}</p>
                        <button className="text-sm text-primary-500 hover:text-primary-600 font-medium">Track Package →</button>
                      </div>
                    </div>

                    {/* Progress Steps */}
                    {order.status !== 'delivered' && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between">
                          {order.steps.map((step, idx) => (
                            <div key={step.status} className="flex-1 flex items-center">
                              <div className="flex flex-col items-center">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                  step.complete ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'
                                }`}>
                                  {step.complete ? (
                                    <CheckCircle className="w-4 h-4 text-white" />
                                  ) : (
                                    <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                  )}
                                </div>
                                <span className={`text-xs mt-1 hidden sm:inline ${step.complete ? 'text-slate-800 dark:text-white' : 'text-slate-400'}`}>
                                  {step.label}
                                </span>
                              </div>
                              {idx < order.steps.length - 1 && (
                                <div className={`flex-1 h-0.5 mx-2 ${order.steps[idx + 1].complete ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}