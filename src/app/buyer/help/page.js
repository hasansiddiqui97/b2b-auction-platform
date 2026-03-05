'use client';

import { useState } from 'react';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  Search, 
  ChevronRight, 
  ChevronDown,
  FileText,
  Shield,
  Package,
  CreditCard,
  Clock,
  ExternalLink,
  Send
} from 'lucide-react';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const categories = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: HelpCircle,
      questions: [
        { q: 'How do I create an account?', a: 'Click the "Sign Up" button in the top right corner. You can register using your email address or connect via social accounts like Google.' },
        { q: 'How do I verify my account?', a: 'After registration, you\'ll receive a verification email. Click the link in the email to verify your account. You can also enable 2FA for added security.' },
        { q: 'What documents do I need to become a verified seller?', a: 'Sellers need to provide business registration documents, ID verification, and proof of address. Our team typically reviews applications within 24-48 hours.' },
      ]
    },
    {
      id: 'bidding',
      name: 'Bidding & Auctions',
      icon: CreditCard,
      questions: [
        { q: 'How does bidding work?', a: 'Find an item you like, enter your maximum bid amount, and click "Place Bid". The system will automatically bid on your behalf up to your maximum.' },
        { q: 'What is Auto-Bid?', a: 'Auto-Bid allows you to set a maximum price and the system will automatically bid for you, keeping you in the lead until your maximum is reached.' },
        { q: 'Can I retract my bid?', a: 'You can retract your bid up to 12 hours before the auction ends. Go to "My Bids" and click "Retract" next to your active bid.' },
        { q: 'What happens if I win an auction?', a: 'You\'ll receive an email notification with payment instructions. Payment is held in escrow until you receive the item and confirm satisfaction.' },
      ]
    },
    {
      id: 'payments',
      name: 'Payments & Shipping',
      icon: Package,
      questions: [
        { q: 'What payment methods are accepted?', a: 'We accept major credit cards (Visa, MasterCard, Amex), PayPal, and cryptocurrency (BTC, ETH). All payments are processed through secure escrow.' },
        { q: 'How does escrow work?', a: 'When you win an auction, your payment is held securely until you receive the item and confirm it matches the description. Only then is the payment released to the seller.' },
        { q: 'How long does shipping take?', a: 'International shipping typically takes 5-14 business days depending on destination. Domestic Japan shipping is usually 2-5 business days.' },
        { q: 'Can I track my shipment?', a: 'Yes! Once shipped, you\'ll receive a tracking number via email. You can also track your order in real-time from your dashboard.' },
      ]
    },
    {
      id: 'security',
      name: 'Security & Trust',
      icon: Shield,
      questions: [
        { q: 'How is my personal information protected?', a: 'We use bank-level encryption (SSL/TLS) for all data transmission. Your payment information is never stored on our servers.' },
        { q: 'What if the item arrives damaged or not as described?', a: 'You can open a dispute within 7 days of delivery. Our team will investigate and facilitate a refund through our buyer protection program.' },
        { q: 'Are sellers verified?', a: 'Yes! All sellers go through a verification process including business registration, identity verification, and rating history review.' },
      ]
    },
    {
      id: 'account',
      name: 'Account & Settings',
      icon: FileText,
      questions: [
        { q: 'How do I update my profile?', a: 'Go to "My Dashboard" → "Settings" → "Profile" to update your name, contact information, and preferences.' },
        { q: 'How do I change my password?', a: 'Navigate to "Settings" → "Security" and follow the prompts to change your password.' },
        { q: 'Can I delete my account?', a: 'Yes, you can request account deletion from "Settings" → "Account". Note that this action is irreversible.' },
      ]
    },
  ];

  const [tickets, setTickets] = useState([
    { id: 1, subject: 'Payment not processing', status: 'open', date: '2026-03-05', category: 'Payments' },
    { id: 2, subject: 'Item not as described', status: 'resolved', date: '2026-02-28', category: 'Dispute' },
  ]);

  const [newTicket, setNewTicket] = useState({ subject: '', category: 'General', message: '' });

  const handleSubmitTicket = () => {
    if (newTicket.subject && newTicket.message) {
      setTickets([{ 
        id: tickets.length + 1, 
        subject: newTicket.subject, 
        status: 'open', 
        date: '2026-03-06',
        category: newTicket.category 
      }, ...tickets]);
      setNewTicket({ subject: '', category: 'General', message: '' });
    }
  };

  const filteredCategories = searchQuery 
    ? categories.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q => 
          q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
          q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.questions.length > 0)
    : categories;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Hero */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 dark:from-slate-900 dark:to-slate-800 pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">How can we help?</h1>
          <p className="text-emerald-100 mb-6">Search our knowledge base or contact our support team</p>
          
          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-4 rounded-xl border-0 shadow-2xl text-slate-800"
            />
          </div>

          {/* Quick Contact */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="#contact" className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
              <MessageCircle className="w-4 h-4" />
              <span>Live Chat</span>
            </a>
            <a href="mailto:support@hayaland.com" className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
              <Mail className="w-4 h-4" />
              <span>support@hayaland.com</span>
            </a>
            <a href="tel:+81-3-1234-5678" className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
              <Phone className="w-4 h-4" />
              <span>+81 3-1234-5678</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-4">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} className="glass-card overflow-hidden">
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-emerald-600" />
                      </div>
                      <span className="font-medium text-slate-800 dark:text-white">{category.name}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedCategory === category.id ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedCategory === category.id && (
                    <div className="border-t border-slate-200 dark:border-slate-700">
                      {category.questions.map((item, idx) => (
                        <div key={idx} className="p-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
                          <h4 className="font-medium text-slate-800 dark:text-white mb-2">{item.q}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{item.a}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {filteredCategories.length === 0 && (
              <div className="glass-card p-8 text-center">
                <HelpCircle className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 dark:text-slate-400">No results found. Try a different search term or contact support.</p>
              </div>
            )}
          </div>

          {/* Support Ticket */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Submit a Support Ticket</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    className="input-field"
                    placeholder="Brief description of your issue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                    className="input-field"
                  >
                    <option>General</option>
                    <option>Payments</option>
                    <option>Bidding</option>
                    <option>Shipping</option>
                    <option>Dispute</option>
                    <option>Account</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
                  <textarea
                    value={newTicket.message}
                    onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                    className="input-field h-32 resize-none"
                    placeholder="Describe your issue in detail..."
                  />
                </div>
                <button onClick={handleSubmitTicket} className="w-full btn-primary flex items-center justify-center space-x-2">
                  <Send className="w-4 h-4" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </div>

            {/* My Tickets */}
            <div className="glass-card p-6">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4">My Tickets</h3>
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-slate-800 dark:text-white">{ticket.subject}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        ticket.status === 'open' 
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{ticket.category}</span>
                      <span>{ticket.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50">
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}