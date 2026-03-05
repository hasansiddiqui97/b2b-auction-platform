'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) newErrors.name = 'Name is required';
    
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!form.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (validateForm()) {
        setStep(2);
      }
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      router.push('/buyer');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Stats */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-yellow-400 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full"></div>
        </div>
        
        <div className="relative z-10">
          <img src="/hayaland-logo.jpg" alt="Hayaland" className="h-16" />
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            Join the Largest B2B Auction Platform
          </h1>
          <p className="text-white/90 text-lg mb-8">
            Connect with verified Japanese sellers and global buyers
          </p>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-white/80 text-sm">Auctions</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white">120+</div>
              <div className="text-white/80 text-sm">Sellers</div>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-white">5000+</div>
              <div className="text-white/80 text-sm">Buyers</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-white/70 text-sm">
          Trusted by 5000+ buyers worldwide
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img src="/hayaland-logo.jpg" alt="Hayaland" className="h-16 mx-auto mb-4" />
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className={`flex items-center ${step >= 1 ? 'text-orange-500' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-orange-500 text-white' : 'bg-slate-200'
              }`}>
                {step > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className="ml-2 text-sm font-medium">Account</span>
            </div>
            <div className="w-12 h-0.5 bg-slate-200 mx-4"></div>
            <div className={`flex items-center ${step >= 2 ? 'text-orange-500' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-orange-500 text-white' : 'bg-slate-200'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Verify</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 text-center mb-2">
            {step === 1 ? 'Create Account' : 'Verify Your Email'}
          </h1>
          <p className="text-slate-500 text-center mb-8">
            {step === 1 ? 'Join as a buyer on Hayaland Wholesale' : 'We sent a verification link to your email'}
          </p>

          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className={`input-field ${errors.name ? 'border-orange-500' : ''}`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-orange-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})}
                  className={`input-field ${errors.email ? 'border-orange-500' : ''}`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-orange-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                    className={`input-field pr-10 ${errors.password ? 'border-orange-500' : ''}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5 text-slate-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
                  </button>
                </div>
                {errors.password && <p className="text-orange-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                  className={`input-field ${errors.confirmPassword ? 'border-orange-500' : ''}`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-orange-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={form.agreeTerms}
                  onChange={(e) => setForm({...form, agreeTerms: e.target.checked})}
                  className="w-4 h-4 mt-1 rounded text-orange-500"
                />
                <span className="ml-2 text-sm text-slate-600">
                  I agree to the{' '}
                  <Link href="#" className="text-orange-500 hover:underline">Terms</Link>
                  {' '}and{' '}
                  <Link href="#" className="text-orange-500 hover:underline">Privacy Policy</Link>
                </span>
              </div>
              {errors.agreeTerms && <p className="text-orange-500 text-xs">{errors.agreeTerms}</p>}

              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)' }}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="text-center">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-orange-500" />
              </div>

              <p className="text-slate-600 mb-6">
                We've sent a verification link to<br/>
                <span className="font-medium text-slate-800">{form.email}</span>
              </p>

              <div className="p-4 bg-blue-50 rounded-lg mb-6">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <p className="text-sm text-blue-700 text-left">
                    <strong>Demo:</strong> Click below to skip verification.
                  </p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-lg text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFB347 100%)' }}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Continue to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={() => setStep(1)}
                className="mt-4 text-sm text-slate-500 hover:text-slate-700"
              >
                ← Back to edit details
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}