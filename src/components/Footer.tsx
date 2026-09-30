import React, { useState } from 'react';
import { Compass, Mail, ShieldCheck, Heart, ArrowUp, PhoneCall, Globe2, Sparkles } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  openToolsModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, openToolsModal }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center shadow-md shadow-blue-500/30">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-2xl font-bold tracking-tight text-white">
                Voyana<span className="text-teal-400">.ai</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              "Plan Smart. Travel Better." Voyana AI synthesizes billions of flight, hotel, transit, and local attraction data points into seamless personalized travel itineraries in seconds.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-teal-400">
                <ShieldCheck className="w-4 h-4" /> AI Grounded Real-Time
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-blue-400">
                <Globe2 className="w-4 h-4" /> 140+ Countries
              </span>
            </div>

            {/* Newsletter */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-2">
                Join 120,000+ Smart Travelers
              </p>
              {subscribed ? (
                <div className="text-xs text-teal-300 bg-teal-900/40 border border-teal-700/50 rounded-lg p-2.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>You're subscribed! Exclusive itinerary drops sent every Thursday.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column: Planning */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              AI Travel Planner
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentTab('planner')} className="hover:text-white transition-colors">
                  Create New Itinerary
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('destinations')} className="hover:text-white transition-colors">
                  Popular Destinations
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('budget')} className="hover:text-white transition-colors">
                  Smart Budget Calculator
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('hotels')} className="hover:text-white transition-colors">
                  Curated Boutique Hotels
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('transport')} className="hover:text-white transition-colors">
                  Multi-Modal Transit
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('attractions')} className="hover:text-white transition-colors">
                  Curated Attractions
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Smart Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Traveler Toolkit
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={openToolsModal} className="hover:text-white transition-colors">
                  Live Currency Converter
                </button>
              </li>
              <li>
                <button onClick={openToolsModal} className="hover:text-white transition-colors">
                  Global Visa Requirement Check
                </button>
              </li>
              <li>
                <button onClick={openToolsModal} className="hover:text-white transition-colors">
                  Local Phrasebook & Translator
                </button>
              </li>
              <li>
                <button onClick={openToolsModal} className="hover:text-white transition-colors">
                  Route Distance & Fuel Estimator
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('dashboard')} className="hover:text-white transition-colors">
                  Travel Expense Tracker
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('dashboard')} className="hover:text-white transition-colors">
                  Interactive Packing Checklist
                </button>
              </li>
            </ul>
          </div>

          {/* Column: Company & Emergency */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Company & Help
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-white transition-colors">
                  About Voyana AI
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('contact')} className="hover:text-white transition-colors">
                  Contact & Support
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('dashboard')} className="hover:text-white transition-colors">
                  My Trips Dashboard
                </button>
              </li>
              <li className="pt-2 text-slate-500">
                <div className="flex items-center gap-1.5 text-orange-400 text-xs font-medium">
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>24/7 Travel SOS</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">+1 (800) 869-2621</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Voyana AI, Inc. All rights reserved.</span>
            <span>·</span>
            <span>Crafted for explorers worldwide</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentTab('about')} className="hover:text-slate-300">Privacy Policy</button>
            <button onClick={() => setCurrentTab('about')} className="hover:text-slate-300">Terms of Service</button>
            <button onClick={() => setCurrentTab('contact')} className="hover:text-slate-300">Security</button>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-xs"
              title="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
