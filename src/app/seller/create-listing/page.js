'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { 
  Plus, 
  Save, 
  Upload, 
  X, 
  Image as ImageIcon,
  DollarSign,
  Clock,
  Truck,
  CreditCard,
  CheckCircle
} from 'lucide-react';

const categories = ['Smartphones', 'Laptops', 'Tablets', 'Audio', 'Cameras', 'Wearables', 'Gaming'];
const conditions = ['New', 'Like New', 'Excellent', 'Good', 'Fair'];
const grades = ['New', 'A+', 'A', 'B', 'C'];

export default function CreateListing() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    brand: '',
    model: '',
    grade: 'A',
    condition: 'Excellent',
    startingPrice: '',
    reservePrice: '',
    buyNowPrice: '',
    bidIncrement: '1000',
    quantity: '1',
    location: 'Tokyo, Japan',
    shippingCost: '2500',
    shippingMethod: 'courier',
    paymentMethods: ['wallet', 'bank_transfer'],
    startTime: '',
    endTime: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (checked) {
        setFormData({ ...formData, paymentMethods: [...formData.paymentMethods, name] });
      } else {
        setFormData({ ...formData, paymentMethods: formData.paymentMethods.filter(p => p !== name) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare auction data
      const auctionData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        brand: formData.brand,
        model: formData.model,
        grade: formData.grade,
        condition: formData.condition,
        starting_price: parseInt(formData.startingPrice),
        reserve_price: formData.reservePrice ? parseInt(formData.reservePrice) : null,
        buy_now_price: formData.buyNowPrice ? parseInt(formData.buyNowPrice) : null,
        bid_increment: parseInt(formData.bidIncrement) || 1000,
        quantity: parseInt(formData.quantity) || 1,
        location: formData.location,
        shipping_cost: parseInt(formData.shippingCost) || 2500,
        shipping_method: formData.shippingMethod,
        payment_methods: formData.paymentMethods,
        start_time: formData.startTime || new Date().toISOString(),
        end_time: formData.endTime,
        current_bid: parseInt(formData.startingPrice),
        bid_count: 0,
        status: 'active',
        images: images.map(img => img.url),
        seller_id: 'user-001',
      };

      // Save to Supabase if configured
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from('auctions')
          .insert([auctionData])
          .select();
        
        if (error) throw error;
        console.log('Saved to Supabase:', data);
      } else {
        // Demo mode - just log
        console.log('Demo mode - Listing data:', auctionData);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/seller');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving listing:', error);
      alert('Failed to create listing: ' + error.message);
    }

    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Listing Created!</h2>
          <p className="text-slate-500">Redirecting to seller dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-900 dark:to-slate-800 pt-8 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Create New Listing</h1>
          <p className="text-emerald-100 mt-1">Fill in the details to list your product for auction</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input-field" placeholder="e.g., iPhone 15 Pro Max 256GB" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="input-field" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange} required className="input-field">
                    <option value="">Select category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Brand *</label>
                  <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="input-field" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Model</label>
                  <input type="text" name="model" value={formData.model} onChange={handleChange} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Grade *</label>
                  <select name="grade" value={formData.grade} onChange={handleChange} className="input-field">
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Condition</label>
                <select name="condition" value={formData.condition} onChange={handleChange} className="input-field">
                  {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" /> Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Starting Price (¥) *</label>
                <input type="number" name="startingPrice" value={formData.startingPrice} onChange={handleChange} required className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Buy Now Price (¥)</label>
                <input type="number" name="buyNowPrice" value={formData.buyNowPrice} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bid Increment (¥)</label>
                <input type="number" name="bidIncrement" value={formData.bidIncrement} onChange={handleChange} className="input-field" defaultValue="1000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
                <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} className="input-field" defaultValue="1" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" /> Auction Timing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time *</label>
                <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} required className="input-field" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2" /> Shipping
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-field" defaultValue="Tokyo, Japan" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Shipping Cost (¥)</label>
                <input type="number" name="shippingCost" value={formData.shippingCost} onChange={handleChange} className="input-field" defaultValue="2500" />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" /> Payment Methods
            </h2>
            <div className="flex flex-wrap gap-4">
              {[
                { id: 'wallet', label: 'Wallet Balance' },
                { id: 'bank_transfer', label: 'Bank Transfer' },
                { id: 'card', label: 'Credit/Debit Card' },
                { id: 'crypto', label: 'Cryptocurrency' }
              ].map(method => (
                <label key={method.id} className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" name={method.id} checked={formData.paymentMethods.includes(method.id)} onChange={handleChange} className="rounded text-primary-500" />
                  <span className="text-slate-700 dark:text-slate-300">{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2" /> Product Images
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {images.map(img => (
                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden">
                  <Image src={img.url} alt="Product" fill className="object-cover" />
                  <button type="button" onClick={() => removeImage(img.id)} className="absolute top-2 right-2 p-1 bg-rose-500 text-white rounded-full">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500">
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-sm text-slate-500">Upload</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex space-x-4">
            <button type="button" onClick={() => router.back()} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 flex items-center justify-center space-x-2">
              {isSubmitting ? <><div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div><span>Saving...</span></> : <><Save className="w-4 h-4" /><span>Create Listing</span></>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
