'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Upload,
  X,
  Check,
  AlertCircle,
  Grid3X3,
  List,
  ChevronDown,
  Save,
  Clock,
  DollarSign,
  Tag,
  Image as ImageIcon
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

export default function InventoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user's auctions from Supabase
  useEffect(() => {
    async function fetchInventory() {
      // Wait for auth to load
      if (authLoading) return;
      
      if (!user) {
        setError('Please log in to view your inventory');
        setLoading(false);
        return;
      }

      if (!isSupabaseConfigured() || !supabase) {
        setError('Supabase not configured');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('auctions')
          .select('*')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) {
          console.error('Fetch error:', fetchError);
          setError(fetchError.message);
        } else if (data) {
          // Transform data to match inventory format
          const transformed = data.map(item => ({
            id: item.id,
            title: item.title,
            sku: item.sku || `SKU-${item.id.slice(0, 8).toUpperCase()}`,
            category: item.category || 'Uncategorized',
            grade: item.grade || 'A',
            quantity: item.quantity || 1,
            price: item.current_bid || item.starting_price || 0,
            status: item.status || 'active',
            image: item.images?.[0] || null,
            created_at: item.created_at,
            start_time: item.start_time,
            end_time: item.end_time,
            bid_count: item.bid_count || 0,
            current_bid: item.current_bid,
            starting_price: item.starting_price,
          }));
          setInventory(transformed);
        }
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      }
      setLoading(false);
    }

    fetchInventory();
  }, [user, authLoading]);

  const categories = ['All', 'Smartphones', 'Laptops', 'Tablets', 'Audio', 'Cameras', 'Wearables', 'Gaming'];
  const grades = ['New', 'A+', 'A', 'B', 'C'];

  const getStatusColor = (status) => {
    const colors = { active: 'bg-emerald-500', draft: 'bg-slate-500', sold: 'bg-blue-500' };
    return colors[status] || 'bg-slate-500';
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'all' || item.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-900 dark:to-slate-800 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Inventory Management</h1>
              <p className="text-emerald-100 mt-1">Manage your product listings and stock</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-emerald-50"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{inventory.length}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Products</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{inventory.filter(i => i.status === 'active').length}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Active Listings</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">¥{(inventory.reduce((a, i) => a + i.price * i.quantity, 0) / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Value</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{inventory.reduce((a, i) => a + i.quantity, 0)}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total Stock</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat.toLowerCase())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === cat.toLowerCase()
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredInventory.map((item) => (
              <div key={item.id} className="glass-card p-4 hover:shadow-lg transition-shadow">
                <div className="relative aspect-square rounded-lg overflow-hidden mb-3 bg-slate-100 dark:bg-slate-800">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                  <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full text-white ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <h3 className="font-medium text-slate-800 dark:text-white text-sm line-clamp-2 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 mb-2">SKU: {item.sku}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-400">¥{item.price.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">Stock: {item.quantity}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                      <Eye className="w-4 h-4 text-slate-400" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                      <Edit className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">SKU</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Grade</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                        </div>
                        <span className="text-sm font-medium text-slate-800 dark:text-white line-clamp-1">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{item.sku}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{item.category}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{item.grade}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{item.quantity}</td>
                    <td className="px-4 py-3 text-sm font-medium text-primary-600 dark:text-primary-400">¥{item.price.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end space-x-1">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                          <Eye className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                          <Edit className="w-4 h-4 text-slate-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                          <Trash2 className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add New Product</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Title</label>
                <input type="text" className="input-field" placeholder="e.g., iPhone 15 Pro Max 256GB" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">SKU</label>
                  <input type="text" className="input-field" placeholder="e.g., IP15PM-256" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select className="input-field">
                    <option>Smartphones</option>
                    <option>Laptops</option>
                    <option>Tablets</option>
                    <option>Audio</option>
                    <option>Cameras</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Grade</label>
                  <select className="input-field">
                    {grades.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
                  <input type="number" className="input-field" defaultValue="1" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Starting Price (¥)</label>
                  <input type="number" className="input-field" placeholder="50000" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea className="input-field" rows={3} placeholder="Product description..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Images</label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
                  <ImageIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Drag and drop images here, or click to browse</p>
                  <button type="button" className="mt-2 text-sm text-primary-500 hover:text-primary-600">Upload Images</button>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary">Cancel</button>
                <button type="submit" className="flex-1 btn-primary flex items-center justify-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save as Draft</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}