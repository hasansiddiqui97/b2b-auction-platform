'use client';
import { useState, useEffect, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Package, Truck, ArrowRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function PurchaseSuccess(props) {
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    // Get orderId from searchParams inside useEffect
    const params = new URLSearchParams(window.location.search);
    const id = params.get('orderId');
    setOrderId(id);
    
    if (!id) {
      router.push('/auctions');
      return;
    }

    async function fetchOrder() {
      if (!isSupabaseConfigured() || !supabase) return;
      
      // Fetch order with auction details
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderError || !orderData) {
        setLoading(false);
        return;
      }

      setOrder(orderData);

      // Fetch auction details
      const { data: auctionData } = await supabase
        .from('auctions')
        .select('*')
        .eq('id', orderData.auction_id)
        .single();

      setAuction(auctionData);
      setLoading(false);
    }

    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!order || !auction) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold dark:text-white">Order not found</h2>
          <Link href="/auctions" className="text-amber-600 mt-2 block">Back to Auctions</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold dark:text-white mb-2">Purchase Successful!</h1>
          <p className="text-slate-600 dark:text-slate-400">Thank you for your purchase</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <h2 className="text-lg font-bold dark:text-white mb-4">Order Details</h2>
          
          {/* Product Info */}
          <div className="flex gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
            {auction.images && auction.images[0] ? (
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 flex-shrink-0">
                <Image src={auction.images[0]} alt={auction.title} width={96} height={96} className="object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-4xl">📱</div>
            )}
            <div>
              <h3 className="font-bold dark:text-white">{auction.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Grade {auction.grade} • {auction.condition}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{auction.location}</p>
            </div>
          </div>

          {/* Order Info */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Order ID</span>
              <span className="font-medium dark:text-white">{order.id.slice(0, 8)}...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Total Amount</span>
              <span className="font-bold text-emerald-500">¥{order.total_amount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Status</span>
              <span className="px-2 py-1 bg-emerald-500 text-white text-sm rounded-full">Completed</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Date</span>
              <span className="font-medium dark:text-white">{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <h2 className="text-lg font-bold dark:text-white mb-4">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="font-medium dark:text-white">Order Confirmation</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Your order has been confirmed and will be processed</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Truck className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="font-medium dark:text-white">Shipping</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Seller will ship within 2-3 business days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link href="/buyer/orders" className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 rounded-lg text-center flex items-center justify-center gap-2">
            View My Orders <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/auctions" className="flex-1 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-white font-medium py-3 rounded-lg text-center">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}