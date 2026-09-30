import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Hotel, 
  Plane, 
  Camera, 
  LayoutDashboard, 
  Info, 
  Mail, 
  Menu, 
  X, 
  Sparkles,
  Wrench,
  Globe2
} from 'lucide-react';
import { CURRENCY_RATES } from '../data/mockData';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedCurrency: string;
  setSelectedCurrency: (curr: string) => void;
  openToolsModal: () => void;
  openChatAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedCurrency,
  setSelectedCurrency,
  openToolsModal,
  openChatAssistant
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'planner', label: 'AI Planner', icon: Sparkles, highlight: true },
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'budget', label: 'Budget', icon: DollarSign },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'transport', label: 'Transport', icon: Plane },
    { id: 'attractions', label: 'Attractions', icon: Camera },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'about', label: 'About', icon: Info },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 glass-nav transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-teal-500 to-orange-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Compass className="w-6 h-6 text-blue-600 group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-xl font-extrabold tracking-tight text-slate-900">
                  Voyana<span className="text-blue-600">.ai</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
                  Smart Travel
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden md:block -mt-0.5">
                Plan Smart. Travel Better.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 shadow-xs'
                      : item.highlight
                      ? 'text-blue-600 hover:bg-blue-50/70 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : item.highlight ? 'text-blue-500' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools & CTA */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Quick Currency Selector */}
            <div className="flex items-center bg-slate-100/80 rounded-lg px-2 py-1 border border-slate-200/80 text-xs">
              <Globe2 className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer text-xs pr-1"
                title="Select Currency"
              >
                {Object.keys(CURRENCY_RATES).map((curr) => (
                  <option key={curr} value={curr}>
                    {curr} ({CURRENCY_RATES[curr].symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Travel Tools Quick Button */}
            <button
              onClick={openToolsModal}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs"
              title="Currency Converter, Visa Guide, Translator"
            >
              <Wrench className="w-3.5 h-3.5 text-slate-500" />
              <span>Tools</span>
            </button>

            {/* AI Concierge Chat Trigger */}
            <button
              onClick={openChatAssistant}
              className="px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50/80 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
              <span>AI Concierge</span>
            </button>

            {/* Primary Plan Trip CTA */}
            <button
              onClick={() => handleNavClick('planner')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all hover:shadow-lg active:scale-98 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-200" />
              <span>Plan My Trip</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-2">
            <button
              onClick={() => handleNavClick('planner')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm"
            >
              Plan Trip
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-1 shadow-lg">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center bg-slate-100 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
              <Globe2 className="w-4 h-4 mr-1 text-slate-400" />
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-transparent font-medium focus:outline-none"
              >
                {Object.keys(CURRENCY_RATES).map((curr) => (
                  <option key={curr} value={curr}>
                    {curr} ({CURRENCY_RATES[curr].symbol})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openToolsModal();
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Travel Tools</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openChatAssistant();
              }}
              className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-xs font-semibold text-teal-800 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>AI Chat</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
