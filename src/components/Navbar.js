'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { currentUser } from '@/data/mockData';
import { Sun, Moon, Menu, X, Bell, Wallet, Search, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const currentRole = 'buyer';

  const handleSignOut = () => {
    console.log('Sign out');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="text-xl font-bold text-slate-800 dark:text-white hidden sm:block">Hayaland</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auctions" className="text-slate-600 dark:text-slate-300 hover:text-primary-600">Auctions</Link>
              
              <select 
                value={currentRole}
                onChange={() => {}}
                className="bg-slate-100 dark:bg-slate-800 text-sm py-1 px-2 rounded"
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>

              <div className="flex items-center space-x-1 px-2 py-1 bg-emerald-50 rounded">
                <Wallet className="w-4 h-4 text-emerald-600" />
                <span className="text-sm text-emerald-700">¥{currentUser.balance.toLocaleString()}</span>
              </div>

              <button onClick={toggleTheme} className="p-2">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <Link href="/buyer/notifications" className="p-2 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              </Link>

              <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="w-8 h-8 bg-primary-500 rounded-full text-white">
                {currentUser.name.charAt(0)}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 p-4 space-y-2">
            <Link href="/auctions" className="block py-2">🔍 Auctions</Link>
            <Link href="/buyer" className="block py-2">👤 My Dashboard</Link>
            <Link href="/buyer/settings" className="block py-2">⚙️ Settings</Link>
            <button onClick={toggleTheme} className="block py-2 w-full text-left">
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        )}
      </nav>
    </>
  );
}
