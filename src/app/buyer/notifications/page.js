'use client';

import { useState } from 'react';
import { 
  Bell,
  Settings,
  Trash2,
  Check,
  X,
  Gavel,
  Package,
  AlertCircle,
  DollarSign,
  User,
  Heart,
  ChevronRight,
  Mail,
  Smartphone,
  Clock,
  Filter
} from 'lucide-react';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Mock notifications
  const notifications = [
    { id: 1, type: 'outbid', title: 'You have been outbid!', message: 'Someone placed a higher bid on iPhone 15 Pro Max 256GB', time: '5 minutes ago', read: false, icon: Gavel },
    { id: 2, type: 'winning', title: 'You are currently winning!', message: 'Your bid of ¥92,500 is the highest for iPhone 15 Pro Max', time: '15 minutes ago', read: false, icon: Gavel },
    { id: 3, type: 'order', title: 'Order Shipped', message: 'Your order #ORD-001 has been shipped via Yamato Transport', time: '2 hours ago', read: true, icon: Package },
    { id: 4, type: 'payment', title: 'Payment Received', message: '¥18,500 has been added to your wallet', time: '3 hours ago', read: true, icon: DollarSign },
    { id: 5, type: 'ending', title: 'Auction Ending Soon', message: 'Sony WH-1000XM5 ends in 1 hour', time: '4 hours ago', read: true, icon: AlertCircle },
    { id: 6, type: 'watchlist', title: 'Watchlist Alert', message: 'New bid placed on MacBook Pro 14" M3 Pro you are watching', time: '5 hours ago', read: true, icon: Heart },
    { id: 7, type: 'account', title: 'Verification Complete', message: 'Your seller account has been verified', time: '1 day ago', read: true, icon: User },
    { id: 8, type: 'system', title: 'Maintenance Notice', message: 'Scheduled maintenance on March 10th, 2:00 AM JST', time: '2 days ago', read: true, icon: Bell },
  ];

  const tabs = [
    { id: 'all', name: 'All', count: notifications.length },
    { id: 'unread', name: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'bids', name: 'Bids', count: notifications.filter(n => ['outbid', 'winning', 'ending'].includes(n.type)).length },
    { id: 'orders', name: 'Orders', count: notifications.filter(n => n.type === 'order').length },
  ];

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.read;
    if (activeTab === 'bids') return ['outbid', 'winning', 'ending'].includes(n.type);
    if (activeTab === 'orders') return n.type === 'order';
    return true;
  });

  const getIconColor = (type) => {
    const colors = {
      outbid: 'bg-rose-100 text-rose-500 dark:bg-rose-900/30',
      winning: 'bg-emerald-100 text-emerald-500 dark:bg-emerald-900/30',
      order: 'bg-blue-100 text-blue-500 dark:bg-blue-900/30',
      payment: 'bg-emerald-100 text-emerald-500 dark:bg-emerald-900/30',
      ending: 'bg-amber-100 text-amber-500 dark:bg-amber-900/30',
      watchlist: 'bg-rose-100 text-rose-500 dark:bg-rose-900/30',
      account: 'bg-primary-100 text-primary-500 dark:bg-primary-900/30',
      system: 'bg-slate-100 text-slate-500 dark:bg-slate-800',
    };
    return colors[type] || 'bg-slate-100 text-slate-500';
  };

  const markAsRead = (id) => {
    // In real app, this would update the notification
    console.log('Mark as read:', id);
  };

  const markAllAsRead = () => {
    // In real app, this would mark all as read
    console.log('Mark all as read');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Notifications</h1>
            <p className="text-slate-500 dark:text-slate-400">Stay updated on your auction activity</p>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={markAllAsRead}
              className="text-sm text-primary-500 hover:text-primary-600 font-medium"
            >
              Mark all as read
            </button>
            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <Settings className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

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

        {/* Notifications List */}
        <div className="glass-card divide-y divide-slate-100 dark:divide-slate-700">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No notifications</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <div 
                  key={notification.id} 
                  className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                    !notification.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className={`font-medium ${notification.read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-800 dark:text-white'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{notification.message}</p>
                        </div>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2"></span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-1 text-xs text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{notification.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {!notification.read && (
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4 text-slate-400" />
                            </button>
                          )}
                          <button 
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Notification Settings */}
        <div className="mt-6 glass-card p-6">
          <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Notification Preferences</h3>
          <div className="space-y-4">
            {[
              { id: 'email', name: 'Email Notifications', desc: 'Receive notifications via email', icon: Mail },
              { id: 'push', name: 'Push Notifications', desc: 'Receive push notifications on your device', icon: Smartphone },
              { id: 'bids', name: 'Bid Alerts', desc: 'Get notified when outbid or winning', icon: Gavel },
              { id: 'orders', name: 'Order Updates', desc: 'Shipping and delivery notifications', icon: Package },
            ].map((setting) => {
              const Icon = setting.icon;
              return (
                <div key={setting.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white">{setting.name}</p>
                      <p className="text-sm text-slate-500">{setting.desc}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}