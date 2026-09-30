import React, { useState } from 'react';
import { Search, MapPin, Star, Calendar, DollarSign, Sparkles, Filter, ArrowRight, X } from 'lucide-react';
import { POPULAR_DESTINATIONS, CURRENCY_RATES } from '../data/mockData';
import { DestinationGuide } from '../types/travel';

interface DestinationsViewProps {
  onPlanTripTo: (destination: string) => void;
  selectedCurrency: string;
}

export const DestinationsView: React.FC<DestinationsViewProps> = ({ onPlanTripTo, selectedCurrency }) => {
  const [selectedContinent, setSelectedContinent] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGuideModal, setActiveGuideModal] = useState<DestinationGuide | null>(null);

  const currencyInfo = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES['USD'];
  const formatCost = (usd: number) => {
    return `${currencyInfo.symbol}${Math.round(usd * currencyInfo.rate).toLocaleString()}`;
  };

  const continents = ['All', 'Europe', 'Asia', 'Americas', 'Oceania & Pacific', 'Middle East & Africa'];

  const filteredDestinations = POPULAR_DESTINATIONS.filter((d) => {
    const matchesContinent = selectedContinent === 'All' || d.continent === selectedContinent;
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesContinent && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Curated Global Guides</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore World Destinations
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Discover handpicked global cities, islands, and alpine wonders with real-time costs, optimal seasons, and one-click AI itinerary synthesis.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs mb-8">
        {/* Continent Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {continents.map((continent) => (
            <button
              key={continent}
              onClick={() => setSelectedContinent(continent)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedContinent === continent
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {continent}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city or country..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group"
          >
            {/* Image Banner */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={dest.image}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
              <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{dest.rating}</span>
              </div>
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                  {dest.country} · {dest.continent}
                </span>
                <h3 className="font-heading text-xl font-bold text-white">
                  {dest.name}
                </h3>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <p className="text-xs font-semibold text-blue-600 mb-1">
                  {dest.tagline}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {dest.description}
                </p>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {dest.highlights.slice(0, 3).map((h, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer info & CTAs */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400">Est. Daily Cost</span>
                  <div className="text-sm font-bold text-slate-900 font-heading">
                    {formatCost(dest.avgDailyCost)}
                    <span className="text-[10px] font-normal text-slate-400"> / day</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveGuideModal(dest)}
                    className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Guide
                  </button>
                  <button
                    onClick={() => onPlanTripTo(`${dest.name}, ${dest.country}`)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                  >
                    <span>Plan Trip</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Guide Detail Modal */}
      {activeGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setActiveGuideModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-64 rounded-xl overflow-hidden mb-5">
              <img
                src={activeGuideModal.image}
                alt={activeGuideModal.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <div className="text-xs uppercase text-teal-300 font-semibold">
                  {activeGuideModal.country}
                </div>
                <h3 className="font-heading text-2xl font-bold">{activeGuideModal.name}</h3>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  About the Destination
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeGuideModal.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Best Season</span>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{activeGuideModal.bestSeason}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Avg Daily Cost</span>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{formatCost(activeGuideModal.avgDailyCost)} / day</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Traveler Rating</span>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">⭐ {activeGuideModal.rating} / 5.0</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Must-See Highlights
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {activeGuideModal.highlights.map((h, i) => (
                    <div key={i} className="text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 flex items-center gap-1.5">
                      <span className="text-blue-600 font-bold">✓</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  onClick={() => setActiveGuideModal(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const destName = `${activeGuideModal.name}, ${activeGuideModal.country}`;
                    setActiveGuideModal(null);
                    onPlanTripTo(destName);
                  }}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Build AI Itinerary Here</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
