'use client';

import { useState } from 'react';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Revenue', value: '¥4,250,000', change: '+18.2%', trend: 'up', icon: DollarSign, color: 'emerald' },
    { label: 'Total Sales', value: '156', change: '+12', trend: 'up', icon: ShoppingCart, color: 'blue' },
    { label: 'Active Bidders', value: '89', change: '+5', trend: 'up', icon: Users, color: 'purple' },
    { label: 'Page Views', value: '12.5K', change: '+23%', trend: 'up', icon: Eye, color: 'orange' },
  ];

  // Mock chart data
  const revenueData = [
    { day: 'Mon', value: 45000 },
    { day: 'Tue', value: 52000 },
    { day: 'Wed', value: 48000 },
    { day: 'Thu', value: 61000 },
    { day: 'Fri', value: 55000 },
    { day: 'Sat', value: 67000 },
    { day: 'Sun', value: 72000 },
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro Max 256GB', sales: 28, revenue: 2590000 },
    { name: 'MacBook Pro 14" M3 Pro', sales: 15, revenue: 4200000 },
    { name: 'iPad Pro 12.9" M2', sales: 22, revenue: 2310000 },
    { name: 'Sony WH-1000XM5', sales: 45, revenue: 832500 },
    { name: 'Canon EOS R6 Mark II', sales: 8, revenue: 1560000 },
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.value));

  const getColorClass = (color) => {
    const colors = {
      emerald: 'bg-emerald-500 text-emerald-500',
      blue: 'bg-blue-500 text-blue-500',
      purple: 'bg-purple-500 text-purple-500',
      orange: 'bg-orange-500 text-orange-500',
    };
    return colors[color] || 'bg-slate-500 text-slate-500';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-900 dark:to-slate-800 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Analytics & Reports</h1>
              <p className="text-emerald-100 mt-1">Track your auction performance</p>
            </div>
            <div className="flex items-center space-x-3">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-emerald-50">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClass(stat.color).split(' ')[0]} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${getColorClass(stat.color).split(' ')[1]}`} />
                  </div>
                  <span className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    <span className="ml-1">{stat.change}</span>
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'sales', name: 'Sales' },
            { id: 'bidders', name: 'Bidders' },
            { id: 'revenue', name: 'Revenue' },
          ].map((tab) => (
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
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-6">Revenue Overview</h3>
            <div className="flex items-end justify-between h-64 space-x-2">
              {revenueData.map((data, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-primary-500 rounded-t-lg transition-all hover:bg-primary-600"
                    style={{ height: `${(data.value / maxRevenue) * 100}%` }}
                  ></div>
                  <span className="text-xs text-slate-500 mt-2">{data.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-6">Top Selling Products</h3>
            <div className="space-y-4">
              {topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-sm text-slate-700 dark:text-slate-300 line-clamp-1">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-800 dark:text-white">¥{(product.revenue / 10000).toFixed(0)}K</p>
                    <p className="text-xs text-slate-500">{product.sales} sales</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Bid Analysis */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-6">Bid Analysis</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-slate-600 dark:text-slate-300">Total Bids Received</span>
                <span className="font-bold text-slate-800 dark:text-white">1,247</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-slate-600 dark:text-slate-300">Average Bid Amount</span>
                <span className="font-bold text-slate-800 dark:text-white">¥45,200</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-slate-600 dark:text-slate-300">Conversion Rate</span>
                <span className="font-bold text-emerald-500">23.5%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-slate-600 dark:text-slate-300">Avg. Time to Sale</span>
                <span className="font-bold text-slate-800 dark:text-white">2.4 days</span>
              </div>
            </div>
          </div>

          {/* Buyer Insights */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-6">Buyer Insights</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-slate-600 dark:text-slate-300">Returning Buyers</span>
                <span className="font-bold text-emerald-500">68%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-slate-600 dark:text-slate-300">New Buyers</span>
                <span className="font-bold text-slate-800 dark:text-white">32%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-slate-600 dark:text-slate-300">Avg. Orders per Buyer</span>
                <span className="font-bold text-slate-800 dark:text-white">3.2</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="text-slate-600 dark:text-slate-300">Top Buyer Location</span>
                <span className="font-bold text-slate-800 dark:text-white">Tokyo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}