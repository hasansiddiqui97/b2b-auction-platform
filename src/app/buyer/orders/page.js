'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  ChevronRight,
  MapPin,
  Eye,
  Shield
} from 'lucide-react';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock orders data
  const orders = [
    {
      id: 'ORD-20260306-001',
      items: [
        { title: 'iPhone 15 Pro Max 256GB Natural Titanium', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200', price: 92500, quantity: 1 }
      ],
      seller: 'Hayaland Electronics',
      total: 95225,
      status: 'shipped',
      date: '2026-03-06',
      tracking: 'YT8234567890',
      carrier: 'Yamato Transport',
      steps: [
        { status: 'ordered', label: 'Order Placed', complete: true, time: 'Mar 6, 10:30 AM' },
        { status: 'paid', label: 'Payment Confirmed', complete: true, time: 'Mar 6, 10:31 AM' },
        { status: 'shipped', label: 'Shipped', complete: true, time: 'Mar 6, 2:00 PM' },
        { status: 'delivered', label: 'Out for Delivery', complete: false, time: '' }
      ]
    },
    {
      id: 'ORD-20260301-001',
      items: [
        { title: 'Sony WH-1000XM5 Wireless Headphones', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=200', price: 18500, quantity: 1 }
      ],
      seller: 'AudioDirect',
      total: 19025,
      status: 'delivered',
      date: '2026-03-01',
      tracking: 'YT1234567890',
      carrier: 'Yamato Transport',
      steps: [
        { status: 'ordered', label: 'Order Placed', complete: true, time: 'Mar 1, 9:00 AM' },
        { status: 'paid', label: 'Payment Confirmed', complete: true, time: 'Mar 1, 9:05 AM' },
        { status: 'shipped', label: 'Shipped', complete: true, time: 'Mar 2, 11:00 AM' },
        { status: 'delivered', label: 'Delivered', complete: true, time: 'Mar 4, 3:30 PM' }
      ]
    },
    {
      id: 'ORD-20260225-001',
      items: [
        { title: 'iPad Pro 11" M4 256GB', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200', price: 98000, quantity: 1 }
      ],
      seller: 'Apple Store Japan',
      total: 100940,
      status: 'delivered',
      date: '2026-02-25',
      tracking: 'YT9876543210',
      carrier: 'FedEx',
      steps: [
        { status: 'ordered', label: 'Order Placed', complete: true, time: 'Feb 25, 2:00 PM' },
        { status: 'paid', label: 'Payment Confirmed', complete: true, time: 'Feb 25, 2:10 PM' },
        { status: 'shipped', label: 'Shipped', complete: true, time: 'Feb 26, 9:00 AM' },
        { status: 'delivered', label: 'Delivered', complete: true, time: 'Mar 1, 11:00 AM' }
      ]
    },
    {
      id: 'ORD-20260220-001',
      items: [
        { title: 'MacBook Pro 14" M3 Pro 512GB', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200', price: 278000, quantity: 1 },
        { title: 'Magic Keyboard', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=200', price: 18000, quantity: 1 }
      ],
      seller: 'Apple Store Japan',
      total: 304780,
      status: 'delivered',
      date: '2026-02-20',
      tracking: 'YT5555555555',
      carrier: 'DHL',
      steps: [
        { status: 'ordered', label: 'Order Placed', complete: true, time: 'Feb 20, 4:00 PM' },
        { status: 'paid', label: 'Payment Confirmed', complete: true, time: 'Feb 20, 4:15 PM' },
        { status: 'shipped', label: 'Shipped', complete: true, time: 'Feb 21, 10:00 AM' },
        { status: 'delivered', label: 'Delivered', complete: true, time: 'Feb 24, 2:00 PM' }
      ]
    }
  ];

  const tabs = [
    { id: 'all', name: 'All Orders', count: orders.length },
    { id: 'active', name: 'Active', count: orders.filter(o => ['pending', 'paid', 'shipped'].includes(o.status)).length },
    { id: 'delivered', name: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-500',
      paid: 'bg-blue-500',
      shipped: 'bg-blue-500',
      delivered: 'bg-emerald-500',
    };
    return colors[status] || 'bg-slate-500';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Truck;
      case 'paid': return Shield;
      default: return Clock;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'paid', 'shipped'].includes(order.status);
    if (activeTab === 'delivered') return order.status === 'delivered';
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