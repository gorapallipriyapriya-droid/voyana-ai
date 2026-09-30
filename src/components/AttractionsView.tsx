import React, { useState } from 'react';
import { Camera, Star, Clock, DollarSign, Bookmark, Check, Sparkles, MapPin, Search } from 'lucide-react';
import { SAMPLE_TRIP_PLAN, CURRENCY_RATES } from '../data/mockData';
import { Attraction } from '../types/travel';

interface AttractionsViewProps {
  selectedCurrency: string;
  onPlanAroundAttraction?: (attraction: string) => void;
}

export const AttractionsView: React.FC<AttractionsViewProps> = ({ selectedCurrency, onPlanAroundAttraction }) => {
  const [search, setSearch] = useState('');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const currencyInfo = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES['USD'];
  const formatCost = (usd: number) => {
    if (usd === 0) return 'Free Admission';
    return `${currencyInfo.symbol}${Math.round(usd * currencyInfo.rate).toLocaleString()}`;
  };

  const attractions: Attraction[] = SAMPLE_TRIP_PLAN.attractions;

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filtered = attractions.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.destination.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-3">
          <Camera className="w-3.5 h-3.5 text-teal-600" />
          <span>Curated Landmarks & Culture</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Iconic Sights & Cultural Wonders
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Explore world-renowned UNESCO heritage shrines, contemporary digital art museums, and breathtaking open-air observation decks.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-8 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter attractions by name, type, or city..."
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 shadow-xs"
        />
      </div>

      {/* Attractions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((attraction) => {
          const isBookmarked = bookmarkedIds.includes(attraction.id);
          return (
            <div
              key={attraction.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={attraction.image}
                    alt={attraction.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-800">
                    {attraction.category}
                  </div>
                  <button
                    onClick={() => toggleBookmark(attraction.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                      isBookmarked
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-900/60 text-white hover:bg-slate-900/90'
                    }`}
                    title={isBookmarked ? 'Saved to Wishlist' : 'Save Attraction'}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{attraction.rating} ({attraction.reviewsCount.toLocaleString()})</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{attraction.destination}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-900 mb-2">
                    {attraction.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {attraction.description}
                  </p>

                  <div className="space-y-2 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-teal-600" /> Best Time:
                      </span>
                      <span className="font-semibold text-slate-800">{attraction.bestTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-blue-600" /> Entry Fee:
                      </span>
                      <span className="font-bold text-slate-900">{formatCost(attraction.entryFee)}</span>
                    </div>
                  </div>

                  {/* Highlights list */}
                  <div className="flex flex-wrap gap-1.5">
                    {attraction.highlights.map((h, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => onPlanAroundAttraction && onPlanAroundAttraction(attraction.destination)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-300" />
                  <span>Include in My Trip Plan</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
