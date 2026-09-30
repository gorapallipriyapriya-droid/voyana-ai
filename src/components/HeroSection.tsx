import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowRight, 
  ShieldCheck, 
  Star, 
  Clock, 
  Plane, 
  TrendingUp, 
  BadgePercent,
  CheckCircle2
} from 'lucide-react';
import { TripPlanRequest } from '../types/travel';
import { WorldMapVisual } from './WorldMapVisual';

interface HeroSectionProps {
  onQuickPlan: (request: Partial<TripPlanRequest>) => void;
  onExploreDestinations: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onQuickPlan, onExploreDestinations }) => {
  const [startLocation, setStartLocation] = useState('San Francisco, CA (SFO)');
  const [destination, setDestination] = useState('Tokyo & Kyoto, Japan');
  const [startDate, setStartDate] = useState('2026-10-10');
  const [endDate, setEndDate] = useState('2026-10-17');
  const [travelers, setTravelers] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickPlan({
      startLocation,
      destination,
      startDate,
      endDate,
      travelers,
      budgetLevel: 'Moderate ($$)',
      travelStyle: 'Culture & Heritage',
      hotelPref: 'Boutique Hotels',
      transportPref: 'Mix of All',
      foodPref: 'Mix of Local & Casual'
    });
  };

  const presetTrips = [
    {
      title: 'Tokyo & Kyoto 7D',
      desc: 'Bullet trains & shrines',
      from: 'San Francisco, CA',
      dest: 'Tokyo & Kyoto, Japan',
      style: 'Culture & Heritage',
      days: 7,
      badge: 'Popular',
    },
    {
      title: 'Romantic Paris 5D',
      desc: 'Seine, Louvre & bistros',
      from: 'New York, NY',
      dest: 'Paris, France',
      style: 'Romantic Getaway',
      days: 5,
      badge: 'Trending',
    },
    {
      title: 'Tropical Bali 6D',
      desc: 'Rice terraces & reefs',
      from: 'Sydney, Australia',
      dest: 'Bali, Indonesia',
      style: 'Relaxation & Wellness',
      days: 6,
      badge: 'Best Value',
    },
    {
      title: 'Swiss Alps 5D',
      desc: 'Matterhorn & Glacier Express',
      from: 'London, UK',
      dest: 'Zermatt, Switzerland',
      style: 'Adventure & Nature',
      days: 5,
      badge: 'Iconic',
    },
  ];

  return (
    <div className="relative pt-6 pb-16 sm:pb-24 overflow-hidden">
      {/* Background Decorative Soft Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-100/50 via-teal-50/30 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Header */}
        <div className="text-center max-w-3xl mx-auto pt-4 pb-8 sm:pb-12">
          {/* Tagline kicker */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span>Next-Generation Travel Intelligence</span>
            <span className="text-slate-300">|</span>
            <span className="text-teal-700 font-bold">Plan Smart. Travel Better.</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Craft Your Perfect Trip in <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-orange-500 bg-clip-text text-transparent">Seconds, Not Hours.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            Voyana AI synthesizes intelligent route maps, boutique hotel reservations, multi-modal transport, curated daily timelines, and exact budget forecasts into one seamless journey.
          </p>
        </div>

        {/* Floating Quick Search Generator Bar */}
        <div className="max-w-5xl mx-auto bg-white rounded-2xl p-4 sm:p-5 shadow-xl shadow-slate-200/80 border border-slate-200/80 mb-12">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Origin */}
            <div className="flex flex-col text-left">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Plane className="w-3 h-3 text-blue-600" /> Origin
              </label>
              <input
                type="text"
                required
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                placeholder="City or Airport (e.g. SFO)"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            {/* Destination */}
            <div className="flex flex-col text-left">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-600" /> Destination
              </label>
              <input
                type="text"
                required
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Where to? (e.g. Tokyo)"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
              />
            </div>

            {/* Dates */}
            <div className="flex flex-col text-left">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-orange-500" /> Departure & Return
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs text-slate-700 focus:outline-none"
                />
                <span className="text-slate-400 text-xs">→</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs text-slate-700 focus:outline-none"
                />
              </div>
            </div>

            {/* Travelers */}
            <div className="flex flex-col text-left">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-purple-600" /> Travelers
              </label>
              <select
                value={travelers}
                onChange={(e) => setTravelers(parseInt(e.target.value, 10))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
              >
                <option value={1}>1 Solo Adventurer</option>
                <option value={2}>2 Couple / Duo</option>
                <option value={3}>3 Friends / Small Group</option>
                <option value={4}>4 Family (4 guests)</option>
                <option value={6}>6+ Group Travel</option>
              </select>
            </div>

            {/* Submit CTA */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full h-9 sm:h-10 bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-bold text-xs rounded-lg shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5 active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-orange-200" />
                <span>Generate Plan</span>
              </button>
            </div>
          </form>

          {/* Quick Presets */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Popular Inspos:
            </span>
            {presetTrips.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setStartLocation(preset.from);
                  setDestination(preset.dest);
                  onQuickPlan({
                    startLocation: preset.from,
                    destination: preset.dest,
                    startDate: '2026-10-10',
                    endDate: '2026-10-17',
                    travelers: 2,
                    travelStyle: preset.style as any,
                  });
                }}
                className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100/80 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-xs font-medium transition-colors border border-slate-200/60"
              >
                <span>{preset.title}</span>
                <span className="text-[10px] text-slate-400 group-hover:text-blue-500">· {preset.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Animated World Map Visual Component */}
        <div className="mb-16">
          <WorldMapVisual 
            onSelectDestination={(cityName) => {
              setDestination(cityName);
              onQuickPlan({
                startLocation: 'San Francisco, CA',
                destination: cityName,
                startDate: '2026-10-10',
                endDate: '2026-10-17',
                travelers: 2,
              });
            }} 
          />
        </div>

        {/* Live Statistics Counter Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto mb-16">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-heading">
              1.2M+
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Intelligent Trips Created
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-600 font-heading">
              140+
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Countries & Territories
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-orange-500 font-heading">
              $420
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Avg. Traveler Savings per Trip
            </p>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              4.9/5
            </div>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Verified Traveler Rating
            </p>
          </div>
        </div>

        {/* Core Value Pillars / Features */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
              Why Global Explorers Choose Voyana AI
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Engineered with deep multi-modal logistics, real-time pricing telemetry, and local cultural intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 mb-1">
                Dynamic Route Optimization
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect flights, bullet trains, and regional ferries with zero downtime. Voyana calculates transit buffers and eliminates backtrack fatigue.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                <BadgePercent className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 mb-1">
                Transparent Budget Forecasting
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No hidden surprises. View realistic daily breakdowns across lodging, transit passes, dining tiers, and emergency buffers with live currency conversions.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-heading text-base font-bold text-slate-900 mb-1">
                Morning-to-Night Pacing
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Say goodbye to unrealistic rush itineraries. Activities are spaced thoughtfully with scenic lunch stops, sunset vantage points, and relaxed evening strolls.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
