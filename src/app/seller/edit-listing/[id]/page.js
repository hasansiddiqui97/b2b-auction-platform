'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
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
  CheckCircle,
  ArrowLeft,
  Loader2
} from 'lucide-react';

const categories = ['Smartphones', 'Laptops', 'Tablets', 'Audio', 'Cameras', 'Wearables', 'Gaming'];
const conditions = ['New', 'Like New', 'Excellent', 'Good', 'Fair'];
const grades = ['New', 'A+', 'A', 'B', 'C'];

export default function EditListing() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const listingId = params.id;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  
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
    status: 'active',
  });

  // Fetch existing listing
  useEffect(() => {
    async function fetchListing() {
      if (!user) {
        router.push('/login');
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
          .eq('id', listingId)
          .eq('seller_id', user.id)
          .single();

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          setFormData({
            title: data.title || '',
            description: data.description || '',
            category: data.category || '',
            brand: data.brand || '',
            model: data.model || '',
            grade: data.grade || 'A',
            condition: data.condition || 'Excellent',
            startingPrice: data.starting_price?.toString() || '',
            reservePrice: data.reserve_price?.toString() || '',
            buyNowPrice: data.buy_now_price?.toString() || '',
            bidIncrement: data.bid_increment?.toString() || '1000',
            quantity: data.quantity?.toString() || '1',
            location: data.location || 'Tokyo, Japan',
            shippingCost: data.shipping_cost?.toString() || '2500',
            shippingMethod: data.shipping_method || 'courier',
            paymentMethods: data.payment_methods || ['wallet', 'bank_transfer'],
            startTime: data.start_time ? new Date(data.start_time).toISOString().slice(0, 16) : '',
            endTime: data.end_time ? new Date(data.end_time).toISOString().slice(0, 16) : '',
            status: data.status || 'active',
          });

          // Set images
          if (data.images && data.images.length > 0) {
            setImages(data.images.map((url, index) => ({
              id: index,
              url: url,
              isBlob: false
            })));
          }
        }
      } catch (err) {
        console.error('Error fetching listing:', err);
        setError('Failed to load listing');
      }
      setLoading(false);
    }

    fetchListing();
  }, [listingId, user]);

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

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `auctions/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('auction-images')
        .upload(filePath, file);
      
      if (error) {
        const newImage = {
          id: Date.now() + Math.random(),
          url: URL.createObjectURL(file),
          file,
          isBlob: true
        };
        setImages(prev => [...prev, newImage]);
      } else {
        const { data: urlData } = supabase.storage
          .from('auction-images')
          .getPublicUrl(filePath);
        
        const newImage = {
          id: Date.now() + Math.random(),
          url: urlData.publicUrl,
          filePath,
          isBlob: false
        };
        setImages(prev => [...prev, newImage]);
      }
    }
  };

  const removeImage = async (id) => {
    const img = images.find(i => i.id === id);
    if (img && img.filePath && !img.isBlob) {
      await supabase.storage
        .from('auction-images')
        .remove([img.filePath]);
    }
    setImages(images.filter(i => i.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Get image URLs
      const imageUrls = images.map(img => img.url);

      const updateData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        brand: formData.brand,
        model: formData.model,
        grade: formData.grade,
        condition: formData.condition,
        starting_price: parseFloat(formData.startingPrice) || 0,
        reserve_price: parseFloat(formData.reservePrice) || null,
        buy_now_price: parseFloat(formData.buyNowPrice) || null,
        bid_increment: parseInt(formData.bidIncrement) || 1000,
        quantity: parseInt(formData.quantity) || 1,
        location: formData.location,
        shipping_cost: parseFloat(formData.shippingCost) || 0,
        shipping_method: formData.shippingMethod,
        payment_methods: formData.paymentMethods,
        start_time: formData.startTime ? new Date(formData.startTime).toISOString() : null,
        end_time: formData.endTime ? new Date(formData.endTime).toISOString() : null,
        status: formData.status,
        images: imageUrls,
        updated_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('auctions')
        .update(updateData)
        .eq('id', listingId)
        .eq('seller_id', user.id);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => {
        router.push('/seller/inventory');
      }, 1500);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message);
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Listing Updated!</h2>
          <p className="text-slate-600 dark:text-slate-400">Redirecting to inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 dark:from-slate-900 dark:to-slate-800 pt-8 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <button 
            onClick={() => router.push('/seller/inventory')}
            className="flex items-center text-white/80 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Edit Listing</h1>
          <p className="text-emerald-100 mt-1">Update your auction details</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Images */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Product Images</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <Image src={img.url} alt="Product" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-colors">
                <Upload className="w-8 h-8 text-slate-400" />
                <span className="text-sm text-slate-500 mt-2">Add Image</span>
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="iPhone 15 Pro Max 256GB"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Describe your product..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                <select name="category" value={formData.category} onChange={handleChange} className="input-field">
                  <option value="">Select category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Grade</label>
                <select name="grade" value={formData.grade} onChange={handleChange} className="input-field">
                  {grades.map(grade => <option key={grade} value={grade}>{grade}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Condition</label>
                <select name="condition" value={formData.condition} onChange={handleChange} className="input-field">
                  {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
                <input type="number" name="quantity" min="1" value={formData.quantity} onChange={handleChange} className="input-field" />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Starting Price (¥) *</label>
                <input type="number" name="startingPrice" required min="1" value={formData.startingPrice} onChange={handleChange} className="input-field" placeholder="10000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Buy Now Price (¥)</label>
                <input type="number" name="buyNowPrice" min="1" value={formData.buyNowPrice} onChange={handleChange} className="input-field" placeholder="150000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bid Increment (¥)</label>
                <input type="number" name="bidIncrement" min="100" value={formData.bidIncrement} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reserve Price (¥)</label>
                <input type="number" name="reservePrice" min="0" value={formData.reservePrice} onChange={handleChange} className="input-field" placeholder="Optional" />
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Shipping</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Shipping Cost (¥)</label>
                <input type="number" name="shippingCost" min="0" value={formData.shippingCost} onChange={handleChange} className="input-field" />
              </div>
            </div>
          </div>

          {/* Auction Timing */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Auction Timing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start Time</label>
                <input type="datetime-local" name="startTime" value={formData.startTime} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End Time</label>
                <input type="datetime-local" name="endTime" value={formData.endTime} onChange={handleChange} className="input-field" />
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Listing Status</h3>
            <select name="status" value={formData.status} onChange={handleChange} className="input-field">
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="ended">Ended</option>
            </select>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/seller/inventory')}
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
