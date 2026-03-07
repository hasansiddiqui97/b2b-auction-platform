'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { getSupabaseClient } from '@/lib/supabase';
import { hashPassword, verifyPassword } from '@/lib/password';
import { 
  User, Lock, Bell, CreditCard, Shield, Eye, EyeOff,
  Save, Mail, Phone, MapPin, Loader2, ChevronLeft
} from 'lucide-react';

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    timezone: 'Asia/Tokyo',
    language: 'English'
  });

  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    async function fetchUser() {
      const userId = localStorage.getItem('hw_user_id');
      
      if (!userId) {
        router.push('/login');
        return;
      }
      
      const supabase = getSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (data) {
        setUser(data);
        setProfile({
          name: data.full_name || '',
          email: data.email || '',
          phone: data.phone || '',
          location: '',
          timezone: 'Asia/Tokyo',
          language: 'English'
        });
      }
      setLoading(false);
    }
    
    fetchUser();
  }, [router]);

  const handleSaveProfile = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwords.new.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setUpdatingPassword(true);
    setPasswordMessage({ type: '', text: '' });

    try {
      const userId = localStorage.getItem('hw_user_id');
      const supabase = getSupabaseClient();
      
      // Get current user data
      const { data: userData } = await supabase
        .from('profiles')
        .select('password')
        .eq('id', userId)
        .single();

      if (!userData) {
        setPasswordMessage({ type: 'error', text: 'User not found' });
        setUpdatingPassword(false);
        return;
      }

      // Verify current password
      const isValid = await verifyPassword(passwords.current, userData.password);
      if (!isValid) {
        setPasswordMessage({ type: 'error', text: 'Current password is incorrect' });
        setUpdatingPassword(false);
        return;
      }

      // Hash new password and update
      const hashedPassword = await hashPassword(passwords.new);
      const { error } = await supabase
        .from('profiles')
        .update({ password: hashedPassword })
        .eq('id', userId);

      if (error) throw error;

      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err) {
      setPasswordMessage({ type: 'error', text: 'Failed to update password' });
      console.error(err);
    }

    setUpdatingPassword(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <main className="pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        </main>
      </div>
    );
  }

  const SidebarItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        activeTab === id 
          ? 'bg-slate-800 text-white' 
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />
      <main className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back link */}
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Account Settings</h1>

          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-48 space-y-1">
              <SidebarItem id="profile" icon={User} label="Profile" />
              <SidebarItem id="password" icon={Lock} label="Password" />
              <SidebarItem id="notifications" icon={Bell} label="Notifications" />
              <SidebarItem id="privacy" icon={Shield} label="Privacy" />
            </div>

            {/* Content */}
            <div className="flex-1">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Profile Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="email" 
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="input-field pl-10 bg-slate-50" 
                          disabled
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          value={profile.location}
                          onChange={(e) => setProfile({...profile, location: e.target.value})}
                          className="input-field pl-10" 
                          placeholder="Tokyo, Japan"
                        />
                      </div>
                    </div>

                    {saved && (
                      <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-sm">
                        Settings saved successfully!
                      </div>
                    )}

                    <button onClick={handleSaveProfile} className="btn-primary">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === 'password' && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Change Password</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          value={passwords.current}
                          onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                          className="input-field pr-10" 
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                      <input 
                        type="password"
                        value={passwords.new}
                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                        className="input-field" 
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm New Password</label>
                      <input 
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                        className="input-field" 
                        placeholder="••••••••"
                      />
                    </div>

                    {passwordMessage.text && (
                      <div className={`px-4 py-2 rounded-lg text-sm ${
                        passwordMessage.type === 'error' 
                          ? 'bg-red-50 text-red-700' 
                          : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        {passwordMessage.text}
                      </div>
                    )}

                    <button 
                      onClick={handleUpdatePassword} 
                      disabled={updatingPassword}
                      className="btn-primary"
                    >
                      {updatingPassword ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'bids', label: 'Bid updates', desc: 'Get notified when someone bids on your items' },
                      { id: 'outbid', label: 'Outbid alerts', desc: 'Get notified when you are outbid' },
                      { id: 'won', label: 'Auction won', desc: 'Get notified when you win an auction' },
                      { id: 'ending', label: 'Ending soon', desc: 'Get notified when your auctions are ending' },
                      { id: 'news', label: 'News & updates', desc: 'Receive news about Hayaland' }
                    ].map(item => (
                      <label key={item.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                        <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded" />
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white">{item.label}</p>
                          <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Privacy Settings</h2>
                  
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">Show my profile to other users</p>
                        <p className="text-sm text-slate-500">Allow others to view your profile</p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">Show my activity status</p>
                        <p className="text-sm text-slate-500">Let others see when I'm online</p>
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}