'use client';

import { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  CreditCard, 
  Shield, 
  Eye, 
  EyeOff,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Globe,
  Download,
  Link2,
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { currentUser } from '@/data/mockData';

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [profile, setProfile] = useState({
    name: currentUser.name,
    email: currentUser.email,
    phone: '+81 90-1234-5678',
    location: 'Tokyo, Japan',
    timezone: 'Asia/Tokyo',
    language: 'English'
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [notifications, setNotifications] = useState({
    emailBids: true,
    emailOutbid: true,
    emailWon: true,
    emailOrderShipped: true,
    pushBids: true,
    pushOutbid: false,
    pushWon: true,
    smsBids: false,
    smsOutbid: false,
    smsWon: true
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'payment', name: 'Payment Methods', icon: CreditCard },
    { id: 'account', name: 'Account', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 dark:from-slate-900 dark:to-slate-800 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Account Settings</h1>
          <p className="text-emerald-100 mt-1">Manage your profile and preferences</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="glass-card p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Profile Information</h2>
                
                {/* Avatar */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                      {profile.name.charAt(0)}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-200 dark:border-slate-700">
                      <Camera className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </button>
                  </div>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white">{profile.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Member since Jan 2026</p>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        className="input-field pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Timezone</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <select
                        value={profile.timezone}
                        onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                        className="input-field pl-10"
                      >
                        <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
                        <option value="Asia/Karachi">Asia/Karachi (PKT)</option>
                        <option value="America/New_York">America/New_York (EST)</option>
                        <option value="Europe/London">Europe/London (GMT)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Language</label>
                    <select
                      value={profile.language}
                      onChange={(e) => setProfile({...profile, language: e.target.value})}
                      className="input-field"
                    >
                      <option value="English">English</option>
                      <option value="Japanese">日本語</option>
                      <option value="Chinese">中文</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  {saved && <span className="text-emerald-600 text-sm">✓ Settings saved!</span>}
                  <button onClick={handleSave} className="btn-primary flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={passwords.current}
                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                        className="input-field pr-10"
                        placeholder="Enter current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwords.new}
                      onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                      className="input-field"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                      className="input-field"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>

                {/* Two-Factor Auth */}
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Add an extra layer of security</p>
                      </div>
                    </div>
                    <button className="btn-secondary">Enable 2FA</button>
                  </div>
                </div>

                <div className="mt-6">
                  <button onClick={handleSave} className="btn-primary flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Update Password</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div>
                    <h3 className="font-medium text-slate-800 dark:text-white mb-4">Email Notifications</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'emailBids', label: 'New bids on my items' },
                        { key: 'emailOutbid', label: 'When I\'ve been outbid' },
                        { key: 'emailWon', label: 'When I win an auction' },
                        { key: 'emailOrderShipped', label: 'Order shipped updates' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between cursor-pointer">
                          <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                          <input
                            type="checkbox"
                            checked={notifications[item.key]}
                            onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                            className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="font-medium text-slate-800 dark:text-white mb-4">Push Notifications</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'pushBids', label: 'New bids on my items' },
                        { key: 'pushOutbid', label: 'When I\'ve been outbid' },
                        { key: 'pushWon', label: 'When I win an auction' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between cursor-pointer">
                          <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                          <input
                            type="checkbox"
                            checked={notifications[item.key]}
                            onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                            className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* SMS Notifications */}
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="font-medium text-slate-800 dark:text-white mb-4">SMS Notifications</h3>
                    <div className="space-y-3">
                      {[
                        { key: 'smsBids', label: 'New bids on my items' },
                        { key: 'smsOutbid', label: 'When I\'ve been outbid' },
                        { key: 'smsWon', label: 'When I win an auction' },
                      ].map((item) => (
                        <label key={item.key} className="flex items-center justify-between cursor-pointer">
                          <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                          <input
                            type="checkbox"
                            checked={notifications[item.key]}
                            onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                            className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button onClick={handleSave} className="btn-primary flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Save Preferences</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Payment Methods</h2>
                
                <div className="space-y-4">
                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">•••• •••• •••• 4242</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Expires 12/27</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs rounded-full">Default</span>
                  </div>

                  <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        AMEX
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">•••• •••• •••• 8888</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Expires 06/26</p>
                      </div>
                    </div>
                    <button className="text-sm text-slate-500 hover:text-slate-700">Set as default</button>
                  </div>
                </div>

                <button className="mt-4 w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-500 dark:text-slate-400 hover:border-emerald-500 hover:text-emerald-500 transition-colors">
                  + Add Payment Method
                </button>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">Account Management</h2>
                
                {/* Export Data */}
                <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <Download className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">Export My Data</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Download all your data including bids, orders, and profile</p>
                      </div>
                    </div>
                    <button className="btn-secondary text-sm">Download</button>
                  </div>
                </div>

                {/* Connected Accounts */}
                <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                        <Link2 className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">Connected Accounts</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Link Google, Apple, or other accounts for easy login</p>
                      </div>
                    </div>
                    <button className="btn-secondary text-sm">Manage</button>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">Active Sessions</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">2 devices currently logged in</p>
                      </div>
                    </div>
                    <button className="btn-secondary text-sm">View All</button>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="p-4 border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/10 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/30 rounded-lg flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-medium text-rose-700 dark:text-rose-300">Delete Account</p>
                        <p className="text-sm text-rose-600 dark:text-rose-400">Permanently delete your account and all data</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium">Delete</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}