'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  BarChart3,
  CreditCard,
  Wallet,
  Store,
  Star,
  History
} from 'lucide-react';

export default function SellerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('active');

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'listings', name: 'My Listings', icon: ShoppingCart },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'buyers', name: 'Buyers', icon: Users },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'messages', name: 'Messages', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  // Mock data
  const stats = [
    { label: 'Total Revenue', value: '¥4,250,000', change: '+18.2%', trend: 'up', icon: DollarSign },
    { label: 'Active Listings', value: '24', change: '+4', trend: 'up', icon: ShoppingCart },
    { label: 'Total Orders', value: '156', change: '+12', trend: 'up', icon: Package },
    { label: 'Avg. Rating', value: '4.8', change: '+0.2', trend: 'up', icon: Star },
  ];

  const myListings = [
    { id: 'auc-001', title: 'iPhone 15 Pro Max 256GB', image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200', price: 92500, bids: 23, endsIn: '5h 57m', status: 'active' },
    { id: 'auc-002', title: 'MacBook Pro 14" M3 Pro', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200', price: 278000, bids: 45, endsIn: '11h 57m', status: 'active' },
    { id: 'auc-004', title: 'iPad Pro 12.9" M2 256GB', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200', price: 105000, bids: 18, endsIn: '23h 57m', status: 'active' },
  ];

  const recentOrders = [
    { id: 'ord-001', item: 'Sony WH-1000XM5', buyer: 'TechWorld Ltd', price: 18500, status: 'shipped', date: '2026-03-05' },
    { id: 'ord-002', item: 'iPad Pro 11" M4', buyer: 'BulkBuy Co', price: 98000, status: 'pending', date: '2026-03-05' },
    { id: 'ord-003', item: 'Canon EOS R6 II', buyer: 'PhotoPro Inc', price: 195000, status: 'delivered', date: '2026-03-04' },
  ];

  const pendingPayments = [
    { id: 'pay-001', amount: 18500, status: 'processing', date: '2026-03-05' },
    { id: 'pay-002', amount: 98000, status: 'pending', date: '2026-03-05' },
    { id: 'pay-003', amount: 65000, status: 'completed', date: '2026-03-04' },
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-emerald-500',
      shipped: 'bg-blue-500',
      pending: 'bg-amber-500',
      delivered: 'bg-emerald-500',
      processing: 'bg-blue-500',
      completed: 'bg-emerald-500',
    };
    return colors[status] || 'bg-slate-500';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-all duration-300 flex flex-col fixed h-full z-50`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <Image 
                  src="/hayaland-logo.jpg" 
                  alt="Hayaland" 
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold">Seller Hub</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-slate-700 rounded">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                  activeMenu === item.id
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white'
                    : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* Wallet */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-700">
            <div className="glass-card bg-slate-800/50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Available Balance</span>
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xl font-bold text-white">¥2,500,000</p>
              <button className="mt-2 w-full text-xs bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-medium">
                Withdraw Funds
              </button>
            </div>
          </div>
        )}

        {/* User */}
        <div className="border-t border-slate-700 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center font-bold">
              H
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium">Hayaland Electronics</p>
                <p className="text-xs text-slate-400">Verified Seller</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-slate-800">Seller Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search listings..."
                className="pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-slate-100 rounded-lg">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
            </button>

            {/* New Listing Button */}
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium">
              <Plus className="w-4 h-4" />
              <span>New Listing</span>
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
                <div key={idx} className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-500" />
                    </div>
                    <span className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="ml-1">{stat.change}</span>
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Listings */}
            <div className="lg:col-span-2">
              <div className="glass-card">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800 dark:text-white">My Listings</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setActiveTab('active')}
                      className={`px-3 py-1 text-sm rounded-lg ${activeTab === 'active' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'text-slate-500'}`}
                    >
                      Active
                    </button>
                    <button 
                      onClick={() => setActiveTab('ended')}
                      className={`px-3 py-1 text-sm rounded-lg ${activeTab === 'ended' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'text-slate-500'}`}
                    >
                      Ended
                    </button>
                    <button 
                      onClick={() => setActiveTab('draft')}
                      className={`px-3 py-1 text-sm rounded-lg ${activeTab === 'draft' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600' : 'text-slate-500'}`}
                    >
                      Drafts
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {myListings.map((listing) => (
                    <div key={listing.id} className="p-4 flex items-center space-x-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={listing.image} alt={listing.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-800 dark:text-white truncate">{listing.title}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-slate-500">{listing.bids} bids</span>
                          <span className="text-sm text-slate-400">Ends in {listing.endsIn}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600 dark:text-primary-400">¥{listing.price.toLocaleString()}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                            <Eye className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                            <Edit className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                  <button className="w-full text-center text-sm text-primary-500 hover:text-primary-600 font-medium">
                    View All Listings →
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="glass-card">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <h3 className="font-semibold text-slate-800 dark:text-white">Recent Orders</h3>
              </div>
              <div className="p-4 space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{order.item}</p>
                      <p className="text-xs text-slate-500">{order.buyer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary-600 dark:text-primary-400">¥{order.price.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full text-white ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                <button className="w-full text-center text-sm text-primary-500 hover:text-primary-600 font-medium">
                  View All Orders →
                </button>
              </div>
            </div>
          </div>

          {/* Pending Payments */}
          <div className="mt-6 glass-card">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700">
              <h3 className="font-semibold text-slate-800 dark:text-white">Payment History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Payment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {pendingPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-white">{payment.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">¥{payment.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{payment.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button className="text-primary-500 hover:text-primary-600 text-sm font-medium">Details →</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}