'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Menu, X, Bell, Wallet, Search, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const currentRole = 'buyer';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
                <span className="text-sm text-emerald-700">¥0</span>
              </div>

              <button onClick={toggleTheme} className="p-2">
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <Link href="/buyer/notifications" className="p-2 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              </Link>

              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="w-8 h-8 bg-slate-700 rounded-full text-white font-medium">
                  U
                </button>
                
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                    <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                      My Dashboard
                    </Link>
                    <Link href="/buyer/settings" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">
                      Settings
                    </Link>
                    <button 
                    onClick={() => {
                      localStorage.removeItem('hw_user_id');
                      window.location.href = '/login';
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
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
            <Link href="/dashboard" className="block py-2">👤 My Dashboard</Link>
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
