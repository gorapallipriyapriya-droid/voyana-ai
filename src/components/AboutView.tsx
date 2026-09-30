import React from 'react';
import { Compass, ShieldCheck, Globe2, Sparkles, Heart, Users, Award, Zap } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-4">
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span>Our Vision & Heritage</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Pioneering the Era of <span className="text-blue-600">Frictionless Travel</span>
        </h1>
        <p className="mt-4 text-base text-slate-600 leading-relaxed font-normal">
          Voyana AI was founded on a simple realization: travelers spend an average of 34 hours researching 28 fragmented websites just to plan a single one-week trip. We created the world's most sophisticated neural travel engine to turn that into 10 seconds of effortless perfection.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">
            Multi-Modal Logistics
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We do not just find flights. We calculate train transfer platforms, walking distances between shrines, and optimize itineraries to eliminate backtracking fatigue.
          </p>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5">
            <Heart className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">
            Locally Grounded Culture
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every recommendation respects local etiquette, avoids overcrowded tourist traps, and celebrates authentic neighborhood artisans and family-run trattorias.
          </p>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-5">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">
            Real Financial Transparency
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No hidden booking surcharges. Transparent budget forecasts down to subway tickets, tipping customs, and automatic emergency reserves.
          </p>
        </div>
      </div>

      {/* Team & Global Presence */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white text-center shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
            Backed by Navigators & Engineers Worldwide
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Headquartered in San Francisco with hubs in London, Singapore, and Tokyo, our team consists of travel researchers, pilots, cartographers, and machine learning architects committed to human exploration.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-8 text-slate-400 text-xs font-semibold">
            <span>📍 San Francisco</span>
            <span>📍 London</span>
            <span>📍 Singapore</span>
            <span>📍 Tokyo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
