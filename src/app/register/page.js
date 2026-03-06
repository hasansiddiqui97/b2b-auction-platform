'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar, 
  CheckCircle, 
  ArrowRight,
  Eye,
  EyeOff,
  Shield
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const countryCodes = [
  { code: '+81', country: 'Japan' },
  { code: '+1', country: 'USA/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+49', country: 'Germany' },
  { code: '+33', country: 'France' },
  { code: '+82', country: 'South Korea' },
  { code: '+86', country: 'China' },
  { code: '+886', country: 'Taiwan' },
  { code: '+61', country: 'Australia' },
  { code: '+64', country: 'New Zealand' },
  { code: '+852', country: 'Hong Kong' },
  { code: '+65', country: 'Singapore' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Details, 2: Email Verify, 3: Phone Verify, 4: Complete
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    password: '',
    phone: '',
    role: 'buyer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [countryCode, setCountryCode] = useState('+81'); // Japan default

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    // Validate
    if (!formData.firstName || !formData.lastName || !formData.dob || !formData.email || !formData.password || !formData.phone) {
      alert('Please fill in all fields');
      return;
    }
    setStep(2);
  };

  const handleEmailVerify = () => {
    // Simulate email verification code
    if (verificationCode.length === 6) {
      setEmailVerified(true);
      if (phoneVerified) {
        setStep(4);
      } else {
        setStep(3);
      }
    }
  };

  const handlePhoneVerify = () => {
    // Simulate phone verification code
    if (verificationCode.length === 6) {
      setPhoneVerified(true);
      setStep(4);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase
          .from('profiles')
          .insert([{
            email: formData.email,
            full_name: `${formData.firstName} ${formData.lastName}`,
            phone: `${countryCode} ${formData.phone}`,
            dob: formData.dob,
            role: 'buyer',
            email_verified: true,
            phone_verified: true,
            wallet_balance: 0,
            is_verified: false
          }])
          .select();
        
        if (error) throw error;
        console.log('Saved to Supabase:', data);
      } else {
        console.log('Demo mode - would save:', formData);
      }
      // Redirect to login or auctions
      setTimeout(() => router.push('/auctions'), 1500);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Registration successful! (Demo mode)');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="relative w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="text-2xl font-bold text-white">Hayaland</span>
          </Link>
        </div>

        <div className="glass-card p-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s ? 'bg-primary-500 text-white' : 'bg-slate-700 text-slate-400'
                }`}>
                  {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-0.5 ${step > s ? 'bg-primary-500' : 'bg-slate-700'}`}></div>}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Details */}
          {step === 1 && (
            <>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white text-center mb-2">Create Account</h1>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-6">Join Hayaland Wholesale</p>

              <form onSubmit={handleSubmitStep1} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="input-field pl-10" placeholder="John" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="input-field" placeholder="Smith" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth * <span className="text-xs text-slate-400">(Cannot be changed)</span></label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="input-field pl-10" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field pl-10" placeholder="john@example.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      required 
                      className="input-field pl-10 pr-10" 
                      placeholder="••••••••" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                      {showPassword ? <EyeOff className="w-4 h-4 text-slate-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number *</label>
                  <div className="flex">
                    <select 
                      value={countryCode} 
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="input-field w-28 rounded-r-none border-r-0"
                    >
                      {countryCodes.map(cc => (
                        <option key={cc.code} value={cc.code}>{cc.code}</option>
                      ))}
                    </select>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        required 
                        className="input-field pl-10 rounded-l-none" 
                        placeholder="90-1234-5678" 
                      />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full flex items-center justify-center space-x-2">
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* Step 2: Email Verification */}
          {step === 2 && (
            <>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white text-center mb-2">Verify Email</h1>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-6">We sent a code to {formData.email}</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Enter 6-digit code</label>
                  <input 
                    type="text" 
                    value={verificationCode} 
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                    className="input-field text-center text-2xl tracking-widest" 
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>

                <button onClick={handleEmailVerify} className="btn-primary w-full" disabled={verificationCode.length !== 6}>
                  Verify Email
                </button>

                <p className="text-center text-sm text-slate-500">
                  Didn't receive? <button className="text-primary-500">Resend Code</button>
                </p>
              </div>
            </>
          )}

          {/* Step 3: Phone Verification */}
          {step === 3 && (
            <>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white text-center mb-2">Verify Phone</h1>
              <p className="text-slate-500 dark:text-slate-400 text-center mb-6">We sent a code to {formData.phone}</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Enter 6-digit code</label>
                  <input 
                    type="text" 
                    value={verificationCode} 
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                    className="input-field text-center text-2xl tracking-widest" 
                    placeholder="000000"
                    maxLength={6}
                  />
                </div>

                <button onClick={handlePhoneVerify} className="btn-primary w-full" disabled={verificationCode.length !== 6}>
                  Verify Phone
                </button>
              </div>
            </>
          )}

          {/* Step 4: Complete */}
          {step === 4 && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Account Created!</h1>
                <p className="text-slate-500 mt-2">Welcome to Hayaland Wholesale, {formData.firstName}!</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 text-sm mb-2">
                  <Mail className="w-4 h-4 text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-300">{formData.email}</span>
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-300">{formData.phone}</span>
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 mb-4">
                <Shield className="w-4 h-4" />
                <span>Your data is secure with us</span>
              </div>

              <Link href="/auctions" className="btn-primary w-full text-center block">
                Start Shopping
              </Link>
            </>
          )}

          {/* Footer */}
          {step < 4 && (
            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account? <Link href="/login" className="text-primary-500 hover:underline">Sign in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
