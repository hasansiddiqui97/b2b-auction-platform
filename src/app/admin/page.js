'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard,
  ShoppingCart,
  Store,
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
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  LogOut,
  BarChart3,
  CreditCard,
  Shield
} from 'lucide-react';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'auctions', name: 'Auctions', icon: ShoppingCart },
    { id: 'sellers', name: 'Sellers', icon: Store },
    { id: 'buyers', name: 'Buyers', icon: Users },
    { id: 'orders', name: 'Orders', icon: Package },
    { id: 'transactions', name: 'Transactions', icon: CreditCard },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
    { id: 'disputes', name: 'Disputes', icon: AlertCircle },
    { id: 'content', name: 'Content', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const stats = [
    { label: 'Total Revenue', value: '¥12.5M', change: '+12.5%', trend: 'up', icon: DollarSign },
    { label: 'Active Auctions', value: '523', change: '+8.2%', trend: 'up', icon: ShoppingCart },
    { label: 'Active Sellers', value: '128', change: '+3.1%', trend: 'up', icon: Store },
    { label: 'Active Buyers', value: '2,847', change: '+15.3%', trend: 'up', icon: Users },
  ];

  const recentActivity = [
    { type: 'new_auction', user: 'TechResale Tokyo', action: 'listed new item', time: '2 min ago', icon: ShoppingCart },
    { type: 'new_seller', user: 'Osaka Electronics', action: 'completed verification', time: '15 min ago', icon: Store },
    { type: 'new_buyer', user: 'John Smith', action: 'registered as buyer', time: '32 min ago', icon: Users },
    { type: 'dispute', user: 'Buyer #1247', action: 'opened dispute for order #8921', time: '1 hr ago', icon: AlertCircle },
    { type: 'resolved', user: 'Admin', action: 'resolved dispute #8915', time: '2 hrs ago', icon: CheckCircle },
  ];

  const pendingActions = [
    { id: 1, type: 'seller_verify', title: 'Seller Verification', count: 5, urgent: true },
    { id: 2, type: 'dispute', title: 'Pending Disputes', count: 3, urgent: true },
    { id: 3, type: 'withdrawal', title: 'Withdrawal Requests', count: 8, urgent: false },
    { id: 4, type: 'kyc', title: 'KYC Reviews', count: 12, urgent: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-white transition-all duration-300 flex flex-col fixed h-full z-50`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <img src="/hayaland-logo.jpg" alt="Hayaland" className="h-8" />
              <span className="font-bold">Admin</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-slate-800 rounded">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                href="#"
                onClick={() => setActiveMenu(item.id)}
                className={`flex items-center space-x-3 px-4 py-3 mx-2 rounded-lg transition-colors ${
                  activeMenu === item.id
                    ? 'bg-gradient-to-r from-slate-700 to-yellow-500 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-yellow-500 rounded-full flex items-center justify-center font-bold">
              A
            </div>
            {sidebarOpen && (
              <div className="flex-1">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-slate-400">admin@hayaland.com</p>
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
            <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-slate-700"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-slate-100 rounded-lg">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-slate-700 rounded-full"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-slate-700 to-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-slate-700" />
                    </div>
                    <span className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {stat.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span className="ml-1">{stat.change}</span>
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Recent Activity</h3>
                <button className="text-sm text-slate-700 hover:text-slate-800 font-medium">View All →</button>
              </div>
              <div className="p-6 space-y-4">
                {recentActivity.map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <div key={idx} className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'dispute' ? 'bg-rose-100' : 
                        activity.type === 'resolved' ? 'bg-emerald-100' : 'bg-slate-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          activity.type === 'dispute' ? 'text-rose-500' : 
                          activity.type === 'resolved' ? 'text-emerald-500' : 'text-slate-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-800">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-slate-400">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pending Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-semibold text-slate-800">Pending Actions</h3>
              </div>
              <div className="p-6 space-y-4">
                {pendingActions.map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${action.urgent ? 'bg-slate-700' : 'bg-slate-400'}`}></div>
                      <span className="text-sm font-medium text-slate-700">{action.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-slate-800">{action.count}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}