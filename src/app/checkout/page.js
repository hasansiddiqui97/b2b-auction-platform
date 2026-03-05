'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  CreditCard,
  Shield,
  Lock,
  Check,
  ChevronLeft,
  Truck,
  Package,
  AlertCircle,
  Wallet,
  Building,
  Smartphone,
  ArrowRight
} from 'lucide-react';

export default function CheckoutPage() {
  const [step, setStep] = useState(1); // 1: Cart, 2: Shipping, 3: Payment, 4: Confirm
  const [selectedPayment, setSelectedPayment] = useState('wallet');

  // Mock cart data
  const cartItems = [
    { 
      id: 'auc-001', 
      title: 'iPhone 15 Pro Max 256GB Natural Titanium', 
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200',
      seller: 'Hayaland Electronics',
      currentBid: 92500,
      winning: true
    },
    { 
      id: 'auc-002', 
      title: 'MacBook Pro 14" M3 Pro 18GB/512GB Space Black', 
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200',
      seller: 'Apple Store Japan',
      currentBid: 278000,
      winning: true
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.currentBid, 0);
  const buyerPremium = Math.round(subtotal * 0.03); // 3% buyer premium
  const shipping = 2500;
  const total = subtotal + buyerPremium + shipping;

  const paymentMethods = [
    { id: 'wallet', name: 'Wallet Balance', icon: Wallet, desc: 'Pay using your Hayaland wallet' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, JCB' },
    { id: 'bank', name: 'Bank Transfer', icon: Building, desc: 'Direct bank transfer' },
    { id: 'crypto', name: 'Cryptocurrency', icon: Smartphone, desc: 'Bitcoin, Ethereum' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-slate-500 mb-6">
          <Link href="/buyer" className="hover:text-primary-500">Dashboard</Link>
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span className="text-slate-800 dark:text-white">Checkout</span>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[
            { num: 1, label: 'Review' },
            { num: 2, label: 'Shipping' },
            { num: 3, label: 'Payment' },
            { num: 4, label: 'Confirm' }
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-medium ${
                step >= s.num 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
              }`}>
                {step > s.num ? <Check className="w-5 h-5" /> : s.num}
              </div>
              <span className={`ml-2 text-sm font-medium hidden sm:inline ${
                step >= s.num ? 'text-slate-800 dark:text-white' : 'text-slate-400'
              }`}>
                {s.label}
              </span>
              {i < 3 && (
                <div className={`w-12 sm:w-24 h-0.5 mx-2 ${
                  step > s.num ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Review Items */}
            {step === 1 && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Review Your Items</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-slate-800 dark:text-white">{item.title}</h3>
                            <p className="text-sm text-slate-500">Seller: {item.seller}</p>
                          </div>
                          {item.winning && (
                            <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                              Winning
                            </span>
                          )}
                        </div>
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mt-2">
                          ¥{item.currentBid.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setStep(2)}
                  className="w-full mt-6 btn-primary flex items-center justify-center space-x-2"
                >
                  <span>Continue to Shipping</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Shipping Information</h2>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                      <input type="text" className="input-field" defaultValue="John" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                      <input type="text" className="input-field" defaultValue="Smith" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name (Optional)</label>
                    <input type="text" className="input-field" placeholder="Your Company Ltd" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                    <input type="text" className="input-field" defaultValue="123 Business District" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
                      <input type="text" className="input-field" defaultValue="Tokyo" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Postal Code</label>
                      <input type="text" className="input-field" defaultValue="100-0001" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Country</label>
                    <select className="input-field">
                      <option>Japan</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>Germany</option>
                      <option>Australia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                    <input type="tel" className="input-field" defaultValue="+81 90-1234-5678" />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button type="button" onClick={() => setStep(1)} className="btn-secondary">Back</button>
                    <button type="button" onClick={() => setStep(3)} className="flex-1 btn-primary flex items-center justify-center space-x-2">
                      <span>Continue to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Payment Method</h2>
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label 
                        key={method.id}
                        className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${
                          selectedPayment === method.id 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="payment" 
                          value={method.id}
                          checked={selectedPayment === method.id}
                          onChange={() => setSelectedPayment(method.id)}
                          className="sr-only"
                        />
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          selectedPayment === method.id ? 'bg-primary-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-800 dark:text-white">{method.name}</p>
                          <p className="text-sm text-slate-500">{method.desc}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === method.id ? 'border-primary-500' : 'border-slate-300'
                        }`}>
                          {selectedPayment === method.id && <div className="w-3 h-3 rounded-full bg-primary-500"></div>}
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Escrow Notice */}
                <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-emerald-700 dark:text-emerald-400">Escrow Protection</p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-500">Your payment is held securely until you receive and verify your items.</p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-6">
                  <button type="button" onClick={() => setStep(2)} className="btn-secondary">Back</button>
                  <button type="button" onClick={() => setStep(4)} className="flex-1 btn-primary flex items-center justify-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Pay ¥{total.toLocaleString()}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="glass-card p-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Payment Successful!</h2>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Your order has been placed successfully.</p>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-6 text-left">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-500">Order Number</span>
                    <span className="font-medium text-slate-800 dark:text-white">ORD-20260306-001</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-500">Payment Method</span>
                    <span className="font-medium text-slate-800 dark:text-white">Wallet Balance</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Paid</span>
                    <span className="font-bold text-primary-600 dark:text-primary-400">¥{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Link href="/buyer" className="flex-1 btn-secondary text-center">Go to Dashboard</Link>
                  <Link href="/buyer/orders" className="flex-1 btn-primary text-center">View Orders</Link>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          {step < 4 && (
            <div className="lg:col-span-1">
              <div className="glass-card p-6 sticky top-24">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal ({cartItems.length} items)</span>
                    <span className="text-slate-800 dark:text-white">¥{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Buyer Premium (3%)</span>
                    <span className="text-slate-800 dark:text-white">¥{buyerPremium.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Shipping</span>
                    <span className="text-slate-800 dark:text-white">¥{shipping.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-800 dark:text-white">Total</span>
                    <span className="text-xl font-bold text-primary-600 dark:text-primary-400">¥{total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Escrow Protected</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}