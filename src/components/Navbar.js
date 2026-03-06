'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { currentUser } from '@/data/mockData';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Bell, 
  Wallet, 
  Search,
  User,
  ShoppingCart,
  Shield,
  ChevronDown
} from 'lucide-react';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Bell, 
  Wallet, 
  Search,
  Globe,
  User,
  ShoppingCart,
  Store,
  Shield,
  ChevronDown
} from 'lucide-react';

function LoadingLogo() {
  return <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>;
}

export default function Navbar() {
  let theme = 'light';
  let toggleTheme = () => {};
  
  try {
    const context = useTheme();
    theme = context.theme;
    toggleTheme = context.toggleTheme;
  } catch (e) {
    // Context not available yet, use defaults
  }
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState(currentUser.role);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const roleIcons = {
    buyer: ShoppingCart,
    seller: Store,
    admin: Shield,
  };

  const RoleIcon = roleIcons[currentRole];

  const roles = [
    { id: 'buyer', name: 'Buyer', icon: ShoppingCart },
    { id: 'seller', name: 'Seller', icon: Store },
    { id: 'admin', name: 'Admin', icon: Shield },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-slate-200 dark:border-slate-700 rounded-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-10 w-24">
              <Image 
                src="/hayaland-logo.jpg" 
                alt="Hayaland" 
                fill
                sizes="96px"
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Role Switcher */}
            <div className="relative">
              <button 
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <RoleIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 capitalize">{currentRole}</span>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {roleDropdownOpen && (
                <div className="absolute top-full mt-2 w-48 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.id}
                        onClick={() => {
                          setCurrentRole(role.id);
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors ${currentRole === role.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
                      >
                        <Icon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{role.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <Link href="/auctions" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">
              Auctions
            </Link>
            {currentRole === 'buyer' && (
              <Link href="/buyer" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">
                My Dashboard
              </Link>
            )}
            {currentRole === 'seller' && (
              <Link href="/seller" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">
                Seller Hub
              </Link>
            )}
            {currentRole === 'admin' && (
              <Link href="/admin" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">
                Admin Panel
              </Link>
            )}
            <Link href="/buyer/settings" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">
              Settings
            </Link>
            <Link href="/buyer/help" className="text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">
              Help
            </Link>
          </div>

          {/* Right Side - Search, Notifications, Wallet, Theme */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="hidden lg:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search auctions..." 
                  className="w-64 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-0 rounded-lg text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Wallet Balance */}
            <button className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                ¥{currentUser.balance.toLocaleString()}
              </span>
            </button>

            {/* Notifications */}
            <Link href="/buyer/notifications" className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </Link>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* User Avatar */}
            <button className="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex flex-col space-y-3">
              <input 
                type="text" 
                placeholder="Search auctions..." 
                className="input-field"
              />
              <Link href="/auctions" className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                Auctions
              </Link>
              {currentRole === 'buyer' && (
                <Link href="/buyer" className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  My Dashboard
                </Link>
              )}
              {currentRole === 'seller' && (
                <Link href="/seller" className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  Seller Hub
                </Link>
              )}
              {currentRole === 'admin' && (
                <Link href="/admin" className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  Admin Panel
                </Link>
              )}
              <Link href="/buyer/settings" className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                Settings
              </Link>
              <Link href="/buyer/help" className="px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                Help Center
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
