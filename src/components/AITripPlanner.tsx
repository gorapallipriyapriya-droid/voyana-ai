import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Compass, 
  Hotel as HotelIcon, 
  Plane, 
  Utensils, 
  ChevronRight, 
  Clock, 
  Check, 
  Share2, 
  Bookmark, 
  Printer, 
  Download, 
  CloudSun, 
  Sun, 
  CloudRain, 
  Droplets, 
  Wind, 
  Fuel, 
  Car, 
  Train, 
  Bus, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Plus,
  Layers,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  TripPlan, 
  TripPlanRequest, 
  BudgetLevel, 
  TravelStyle, 
  HotelPreference, 
  TransportPreference, 
  FoodPreference,
  PackingItem
} from '../types/travel';
import { requestTripGeneration } from '../services/api';
import { CURRENCY_RATES } from '../data/mockData';

interface AITripPlannerProps {
  initialPlan?: TripPlan | null;
  onSaveTrip?: (plan: TripPlan) => void;
  selectedCurrency: string;
}

export const AITripPlanner: React.FC<AITripPlannerProps> = ({
  initialPlan,
  onSaveTrip,
  selectedCurrency
}) => {
  // Input Form States
  const [startLocation, setStartLocation] = useState('San Francisco, CA (SFO)');
  const [destination, setDestination] = useState('Tokyo & Kyoto, Japan');
  const [startDate, setStartDate] = useState('2026-10-10');
  const [endDate, setEndDate] = useState('2026-10-17');
  const [travelers, setTravelers] = useState(2);
  const [budgetLevel, setBudgetLevel] = useState<BudgetLevel>('Moderate ($$)');
  const [travelStyle, setTravelStyle] = useState<TravelStyle>('Culture & Heritage');
  const [hotelPref, setHotelPref] = useState<HotelPreference>('Boutique Hotels');
  const [transportPref, setTransportPref] = useState<TransportPreference>('Mix of All');
  const [foodPref, setFoodPref] = useState<FoodPreference>('Mix of Local & Casual');
  const [notes, setNotes] = useState('');

  // Generation & Results States
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(initialPlan || null);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'route' | 'hotels' | 'transport' | 'budget' | 'weather' | 'checklist'>('itinerary');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Checklist interactive state
  const [checklist, setChecklist] = useState<PackingItem[]>(
    initialPlan?.checklist || []
  );
  const [newItemText, setNewItemText] = useState('');

  // Currency multiplier helper
  const currencyInfo = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES['USD'];
  const formatCost = (usdAmount: number) => {
    const converted = Math.round(usdAmount * currencyInfo.rate);
    return `${currencyInfo.symbol}${converted.toLocaleString()}`;
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoadingStep(0);

    const steps = [
      'Scanning multi-modal transit corridors...',
      'Selecting top boutique accommodations...',
      'Synthesizing morning-to-night personalized daily timeline...',
      'Computing precise localized budget & currency breakdowns...'
    ];

    const timer = setInterval(() => {
      setLoadingStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 900);

    try {
      const generated = await requestTripGeneration({
        startLocation,
        destination,
        startDate,
        endDate,
        travelers,
        budgetLevel,
        travelStyle,
        hotelPref,
        transportPref,
        foodPref,
        notes,
      });

      clearInterval(timer);
      setCurrentPlan(generated);
      setChecklist(generated.checklist || []);
      setSelectedDayIndex(0);
      setIsLoading(false);

      // Trigger celebratory confetti
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      clearInterval(timer);
      setIsLoading(false);
    }
  };

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const addChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    const newItem: PackingItem = {
      id: `c-custom-${Date.now()}`,
      category: 'Custom Item',
      item: newItemText.trim(),
      checked: false,
    };
    setChecklist([...checklist, newItem]);
    setNewItemText('');
  };

  const handleSave = () => {
    if (!currentPlan) return;
    if (onSaveTrip) {
      onSaveTrip(currentPlan);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Voyana Neural Travel Engine</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI Trip Planner & Route Architect
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Provide your destinations, timing, and travel tastes. Voyana AI designs a hyper-personalized route, reservations, and daily itinerary in seconds.
        </p>
      </div>

      {/* Input Configuration Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 mb-12">
        <form onSubmit={handleGenerate} className="space-y-6">
          {/* Row 1: Core Logistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Start Location
              </label>
              <div className="relative">
                <Plane className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={startLocation}
                  onChange={(e) => setStartLocation(e.target.value)}
                  placeholder="e.g. San Francisco (SFO)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Destination
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-teal-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Tokyo & Kyoto, Japan"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-teal-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Departure & Return Dates
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                />
                <span className="text-slate-400 text-xs">→</span>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Travelers
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-purple-500 absolute left-3 top-2.5" />
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-500"
                >
                  <option value={1}>1 Solo Explorer</option>
                  <option value={2}>2 Couple / Two Friends</option>
                  <option value={3}>3 Small Group (3 people)</option>
                  <option value={4}>4 Family (4 guests)</option>
                  <option value={6}>6+ Group Adventure</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 2: Style & Preferences */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Budget Tier
              </label>
              <select
                value={budgetLevel}
                onChange={(e) => setBudgetLevel(e.target.value as BudgetLevel)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Budget ($)">Budget ($ - Cost conscious & hostels)</option>
                <option value="Moderate ($$)">Moderate ($$ - Boutique & best value)</option>
                <option value="Luxury ($$$)">Luxury ($$$ - 4/5-star suites & fine dining)</option>
                <option value="Ultra-Luxury ($$$$)">Ultra-Luxury ($$$$ - Aman, private tours)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Travel Style
              </label>
              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value as TravelStyle)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Culture & Heritage">Culture & Heritage (Temples, history)</option>
                <option value="Adventure & Nature">Adventure & Nature (Hiking, mountains)</option>
                <option value="Relaxation & Wellness">Relaxation & Wellness (Spas, beach)</option>
                <option value="Food & Culinary">Food & Culinary (Street food, Michelin)</option>
                <option value="Romantic Getaway">Romantic Getaway (Couples, scenic sunsets)</option>
                <option value="Family Fun">Family Fun (Kid-friendly parks, comfort)</option>
                <option value="Luxury & Shopping">Luxury & Shopping (Boutiques, lounges)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Hotel Preference
              </label>
              <select
                value={hotelPref}
                onChange={(e) => setHotelPref(e.target.value as HotelPreference)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Boutique Hotels">Boutique Hotels (Character & charm)</option>
                <option value="City Center 4-5 Star">City Center 4-5 Star (Walk to all)</option>
                <option value="Resort & Spa">Resort & Spa (Pools & pampering)</option>
                <option value="Eco-lodges">Eco-lodges (Nature immersion)</option>
                <option value="Vacation Rentals">Vacation Rentals (Apartment / Airbnb)</option>
                <option value="Hostels & Co-living">Hostels & Co-living (Social & budget)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Transit Preference
              </label>
              <select
                value={transportPref}
                onChange={(e) => setTransportPref(e.target.value as TransportPreference)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Mix of All">Mix of All (Fastest & most convenient)</option>
                <option value="Scenic Trains">Scenic High-Speed Trains & Rail</option>
                <option value="Flight & Private Cab">Flight & Private Chauffeur</option>
                <option value="Self-Drive / Car Rental">Self-Drive / Scenic Road Trip</option>
                <option value="Public Transit & Walking">Subway, Metro & Scenic Walking</option>
              </select>
            </div>
          </div>

          {/* Row 3: Food & Custom Notes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Culinary Focus
              </label>
              <select
                value={foodPref}
                onChange={(e) => setFoodPref(e.target.value as FoodPreference)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Mix of Local & Casual">Mix of Local Markets & Casual Cafés</option>
                <option value="Local Street Food">Authentic Street Food & Night Markets</option>
                <option value="Fine Dining & Michelin">Fine Dining, Omakase & Michelin Stars</option>
                <option value="Vegetarian / Vegan">Vegetarian & Plant-Based Specialties</option>
                <option value="Halal Friendly">Halal-Friendly Certified Dining</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                Special Requests or Interests (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Must include Mount Fuji view, prefer morning activities before crowds, anniversary celebration"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-center">
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3.5 bg-gradient-to-r from-blue-600 via-teal-600 to-orange-500 hover:from-blue-700 hover:to-teal-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-98 flex items-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Itinerary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-orange-200 animate-pulse" />
                  <span>Generate Complete Itinerary & Budget</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading Progress State */}
        {isLoading && (
          <div className="mt-8 pt-6 border-t border-slate-100 text-center max-w-md mx-auto">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
              <div
                className="bg-gradient-to-r from-blue-600 to-teal-500 h-full transition-all duration-700 ease-out"
                style={{ width: `${(loadingStep + 1) * 25}%` }}
              />
            </div>
            <p className="text-xs font-semibold text-slate-700 animate-pulse">
              {[
                'Scanning multi-modal transit corridors...',
                'Selecting top boutique accommodations...',
                'Synthesizing morning-to-night personalized daily timeline...',
                'Computing precise localized budget & currency breakdowns...'
              ][loadingStep]}
            </p>
          </div>
        )}
      </div>

      {/* Generated Trip Results Section */}
      {currentPlan && (
        <div className="space-y-8 animate-fadeIn">
          {/* Trip Header Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-teal-400 mb-2">
                  <span className="bg-teal-950 border border-teal-800 px-2 py-0.5 rounded">
                    {currentPlan.durationDays} Days / {currentPlan.durationDays - 1} Nights
                  </span>
                  <span>·</span>
                  <span>{currentPlan.travelers} Travelers</span>
                  <span>·</span>
                  <span>{currentPlan.travelStyle}</span>
                  <span>·</span>
                  <span>{currentPlan.budgetLevel}</span>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {currentPlan.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-2 leading-relaxed">
                  {currentPlan.summary}
                </p>

                {/* Key Highlights */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {currentPlan.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="text-[11px] bg-slate-800/90 border border-slate-700 text-slate-200 px-2.5 py-1 rounded-md flex items-center gap-1.5"
                    >
                      <Check className="w-3 h-3 text-teal-400" />
                      <span>{h}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons & Quick Cost */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    Estimated Total Budget
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                    {formatCost(currentPlan.budget.totalEstimatedCost)}
                  </div>
                  <div className="text-[10px] text-teal-400">
                    ≈ {formatCost(Math.round(currentPlan.budget.totalEstimatedCost / currentPlan.travelers / currentPlan.durationDays))}/person/day
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{savedSuccess ? 'Saved!' : 'Save Trip'}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                    title="Print or Save as PDF"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold scrollbar-none">
            {[
              { id: 'itinerary', label: 'Day-wise Itinerary', icon: Calendar },
              { id: 'route', label: 'Route & Map', icon: Compass },
              { id: 'hotels', label: 'Recommended Hotels', icon: HotelIcon },
              { id: 'transport', label: 'Transport Hub', icon: Plane },
              { id: 'budget', label: 'Budget Breakdown', icon: DollarSign },
              { id: 'weather', label: 'Weather & Forecast', icon: CloudSun },
              { id: 'checklist', label: 'Packing Checklist', icon: CheckCircle2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENT: 1. DAY-WISE ITINERARY */}
          {activeTab === 'itinerary' && (
            <div className="space-y-6">
              {/* Day Selector Pill Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {currentPlan.dailyItinerary.map((day, idx) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDayIndex(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors border ${
                      selectedDayIndex === idx
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>Day {day.day}</span>
                  </button>
                ))}
              </div>

              {/* Active Day Detail Card */}
              {currentPlan.dailyItinerary[selectedDayIndex] && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
                    <div>
                      <span className="text-[11px] font-bold text-teal-600 uppercase tracking-wider">
                        {currentPlan.dailyItinerary[selectedDayIndex].date}
                      </span>
                      <h3 className="font-heading text-lg font-bold text-slate-900">
                        {currentPlan.dailyItinerary[selectedDayIndex].theme}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Daily Budget</span>
                      <div className="text-sm font-bold text-slate-800">
                        {formatCost(currentPlan.dailyItinerary[selectedDayIndex].dayBudget)}
                      </div>
                    </div>
                  </div>

                  {/* 4 Time Slots: Morning, Afternoon, Evening, Night */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Morning */}
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 flex items-center gap-1">
                          <Sun className="w-3 h-3 text-amber-500" /> Morning
                        </span>
                        <span className="text-slate-400 font-medium">
                          {currentPlan.dailyItinerary[selectedDayIndex].morning.timeSlot}
                        </span>
                      </div>
                      <h4 className="font-heading text-base font-bold text-slate-900 mb-1">
                        {currentPlan.dailyItinerary[selectedDayIndex].morning.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {currentPlan.dailyItinerary[selectedDayIndex].morning.description}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 text-slate-700">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {currentPlan.dailyItinerary[selectedDayIndex].morning.location}
                        </span>
                        <span className="font-bold text-blue-600">
                          {currentPlan.dailyItinerary[selectedDayIndex].morning.cost === 0
                            ? 'Free'
                            : formatCost(currentPlan.dailyItinerary[selectedDayIndex].morning.cost)}
                        </span>
                      </div>
                      {currentPlan.dailyItinerary[selectedDayIndex].morning.tips && (
                        <div className="mt-2 text-[10px] text-teal-700 bg-teal-50/70 p-2 rounded border border-teal-100/80">
                          💡 <strong>Voyana Tip:</strong> {currentPlan.dailyItinerary[selectedDayIndex].morning.tips}
                        </div>
                      )}
                    </div>

                    {/* Afternoon */}
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 flex items-center gap-1">
                          <CloudSun className="w-3 h-3 text-blue-500" /> Afternoon
                        </span>
                        <span className="text-slate-400 font-medium">
                          {currentPlan.dailyItinerary[selectedDayIndex].afternoon.timeSlot}
                        </span>
                      </div>
                      <h4 className="font-heading text-base font-bold text-slate-900 mb-1">
                        {currentPlan.dailyItinerary[selectedDayIndex].afternoon.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {currentPlan.dailyItinerary[selectedDayIndex].afternoon.description}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 text-slate-700">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {currentPlan.dailyItinerary[selectedDayIndex].afternoon.location}
                        </span>
                        <span className="font-bold text-blue-600">
                          {currentPlan.dailyItinerary[selectedDayIndex].afternoon.cost === 0
                            ? 'Free'
                            : formatCost(currentPlan.dailyItinerary[selectedDayIndex].afternoon.cost)}
                        </span>
                      </div>
                      {currentPlan.dailyItinerary[selectedDayIndex].afternoon.tips && (
                        <div className="mt-2 text-[10px] text-teal-700 bg-teal-50/70 p-2 rounded border border-teal-100/80">
                          💡 <strong>Voyana Tip:</strong> {currentPlan.dailyItinerary[selectedDayIndex].afternoon.tips}
                        </div>
                      )}
                    </div>

                    {/* Evening */}
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60 flex items-center gap-1">
                          <Utensils className="w-3 h-3 text-orange-500" /> Evening Dining & Sunset
                        </span>
                        <span className="text-slate-400 font-medium">
                          {currentPlan.dailyItinerary[selectedDayIndex].evening.timeSlot}
                        </span>
                      </div>
                      <h4 className="font-heading text-base font-bold text-slate-900 mb-1">
                        {currentPlan.dailyItinerary[selectedDayIndex].evening.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {currentPlan.dailyItinerary[selectedDayIndex].evening.description}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 text-slate-700">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {currentPlan.dailyItinerary[selectedDayIndex].evening.location}
                        </span>
                        <span className="font-bold text-blue-600">
                          {formatCost(currentPlan.dailyItinerary[selectedDayIndex].evening.cost)}
                        </span>
                      </div>
                      {currentPlan.dailyItinerary[selectedDayIndex].evening.tips && (
                        <div className="mt-2 text-[10px] text-teal-700 bg-teal-50/70 p-2 rounded border border-teal-100/80">
                          💡 <strong>Voyana Tip:</strong> {currentPlan.dailyItinerary[selectedDayIndex].evening.tips}
                        </div>
                      )}
                    </div>

                    {/* Night */}
                    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-500" /> Night Experience
                        </span>
                        <span className="text-slate-400 font-medium">
                          {currentPlan.dailyItinerary[selectedDayIndex].night.timeSlot}
                        </span>
                      </div>
                      <h4 className="font-heading text-base font-bold text-slate-900 mb-1">
                        {currentPlan.dailyItinerary[selectedDayIndex].night.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {currentPlan.dailyItinerary[selectedDayIndex].night.description}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 text-slate-700">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {currentPlan.dailyItinerary[selectedDayIndex].night.location}
                        </span>
                        <span className="font-bold text-blue-600">
                          {currentPlan.dailyItinerary[selectedDayIndex].night.cost === 0
                            ? 'Free'
                            : formatCost(currentPlan.dailyItinerary[selectedDayIndex].night.cost)}
                        </span>
                      </div>
                      {currentPlan.dailyItinerary[selectedDayIndex].night.tips && (
                        <div className="mt-2 text-[10px] text-teal-700 bg-teal-50/70 p-2 rounded border border-teal-100/80">
                          💡 <strong>Voyana Tip:</strong> {currentPlan.dailyItinerary[selectedDayIndex].night.tips}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: 2. ROUTE & MAP */}
          {activeTab === 'route' && (
            <div className="space-y-6">
              {/* Route Summary Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Total Distance</span>
                  <div className="text-xl font-bold text-slate-900 font-heading mt-1">
                    {currentPlan.route.distanceKm.toLocaleString()} km
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Est. Travel Time</span>
                  <div className="text-xl font-bold text-blue-600 font-heading mt-1">
                    {currentPlan.route.travelTimeHours}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Estimated Fuel Cost</span>
                  <div className="text-xl font-bold text-teal-600 font-heading mt-1">
                    {formatCost(currentPlan.route.fuelCostEstimate)}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Waypoint Checkpoints</span>
                  <div className="text-xl font-bold text-slate-900 font-heading mt-1">
                    {currentPlan.route.routeWaypoints.length} Stays & Stops
                  </div>
                </div>
              </div>

              {/* Waypoint Sequence */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-heading text-base font-bold text-slate-900 mb-4">
                  Multi-Leg Route Waypoints & Transfers
                </h3>
                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200">
                  {currentPlan.route.routeWaypoints.map((wp, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-xs" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{wp.name}</span>
                          <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {wp.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{wp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternate Routes */}
              {currentPlan.route.alternateRoutes && currentPlan.route.alternateRoutes.length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                  <h3 className="font-heading text-base font-bold text-slate-900 mb-3">
                    Alternate Scenic Corridors
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentPlan.route.alternateRoutes.map((alt, idx) => (
                      <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-bold text-slate-900">{alt.name}</h4>
                          <span className="text-[11px] font-semibold text-teal-600">{alt.time}</span>
                        </div>
                        <p className="text-xs text-slate-600 mb-2">{alt.description}</p>
                        <div className="text-[10px] text-slate-500 bg-white p-2 rounded border border-slate-200/80">
                          ✨ <strong>Scenic Highlight:</strong> {alt.highlight}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: 3. HOTELS */}
          {activeTab === 'hotels' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentPlan.hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-bold text-slate-800">
                      {hotel.tag}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-2 py-0.5 rounded text-xs font-bold">
                      ⭐ {hotel.rating} ({hotel.reviewsCount})
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-heading text-base font-bold text-slate-900 mb-1">
                        {hotel.name}
                      </h4>
                      <p className="text-xs text-slate-500 mb-3">{hotel.distanceToCenter}</p>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">{hotel.description}</p>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {hotel.amenities.slice(0, 4).map((am, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                          >
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400">Nightly rate</span>
                        <div className="text-base font-extrabold text-slate-900 font-heading">
                          {formatCost(hotel.pricePerNight)}
                          <span className="text-xs font-normal text-slate-500"> / night</span>
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`Simulated booking for ${hotel.name}! Voyana has locked in guaranteed rates with no cancellation fee.`)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB CONTENT: 4. TRANSPORT */}
          {activeTab === 'transport' && (
            <div className="space-y-6">
              {/* Flights */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-heading text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-blue-600" /> Recommended Flight Connections
                </h3>
                <div className="space-y-3">
                  {currentPlan.transport.flights.map((f, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{f.airline}</span>
                          <span className="text-[10px] text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded font-mono">
                            {f.flightNumber}
                          </span>
                          <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                            {f.stops}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          {f.departureTime} ({f.originAirport}) → {f.arrivalTime} ({f.destAirport}) · {f.duration}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400">Round-trip / person</span>
                          <div className="text-base font-bold text-slate-900 font-heading">
                            {formatCost(f.price)}
                          </div>
                        </div>
                        <button
                          onClick={() => alert(`Simulated flight checkout for ${f.airline} flight ${f.flightNumber}`)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trains & Rail */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-heading text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Train className="w-4 h-4 text-teal-600" /> High-Speed Rail & Scenic Trains
                </h3>
                <div className="space-y-3">
                  {currentPlan.transport.trains.map((t, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{t.operator}</span>
                          <span className="text-[10px] text-slate-500 font-mono bg-slate-200 px-1.5 py-0.5 rounded">
                            {t.trainNumber}
                          </span>
                          <span className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                            {t.classType}
                          </span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          {t.departureStation} ({t.departureTime}) → {t.arrivalStation} ({t.arrivalTime}) · Duration: {t.duration}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400">Ticket Fare</span>
                          <div className="text-base font-bold text-slate-900 font-heading">
                            {formatCost(t.fare)}
                          </div>
                        </div>
                        <button
                          onClick={() => alert(`Simulated rail seat reservation for ${t.trainNumber}`)}
                          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          Book Rail
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rental Vehicles & Mobility */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-heading text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Car className="w-4 h-4 text-orange-600" /> Rental Cars & Local Mobility
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentPlan.transport.rentals.map((r, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-4"
                    >
                      <img
                        src={r.image}
                        alt={r.vehicle}
                        className="w-24 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-slate-900">{r.vehicle}</h4>
                        <p className="text-[11px] text-slate-500">
                          {r.type} · {r.seats} Seats · {r.transmission}
                        </p>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Fuel Est: {formatCost(r.fuelEstimate)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900 font-heading">
                          {formatCost(r.costPerDay)}
                          <span className="text-[10px] font-normal text-slate-400"> /day</span>
                        </div>
                        <button
                          onClick={() => alert(`Simulated rental reserved for ${r.vehicle}`)}
                          className="mt-1 px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[11px] font-bold transition-colors"
                        >
                          Rent
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 5. BUDGET BREAKDOWN */}
          {activeTab === 'budget' && (
            <div className="space-y-6">
              {/* Category Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Lodging</span>
                  <div className="text-lg font-bold text-slate-900 font-heading mt-1">
                    {formatCost(currentPlan.budget.accommodationCost)}
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Transit</span>
                  <div className="text-lg font-bold text-slate-900 font-heading mt-1">
                    {formatCost(currentPlan.budget.transportCost)}
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                    <div className="bg-teal-500 h-full rounded-full" style={{ width: '25%' }} />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Food & Dining</span>
                  <div className="text-lg font-bold text-slate-900 font-heading mt-1">
                    {formatCost(currentPlan.budget.foodCost)}
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Activities</span>
                  <div className="text-lg font-bold text-slate-900 font-heading mt-1">
                    {formatCost(currentPlan.budget.activitiesCost)}
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: '10%' }} />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Shopping</span>
                  <div className="text-lg font-bold text-slate-900 font-heading mt-1">
                    {formatCost(currentPlan.budget.shoppingCost)}
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                    <div className="bg-pink-500 h-full rounded-full" style={{ width: '8%' }} />
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Fund</span>
                  <div className="text-lg font-bold text-emerald-600 font-heading mt-1">
                    {formatCost(currentPlan.budget.emergencyFund)}
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '7%' }} />
                  </div>
                </div>
              </div>

              {/* Savings Tips & Strategies */}
              <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-6">
                <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3">
                  <TrendingDown className="w-4 h-4 text-teal-600" />
                  <span>Voyana Insider Savings Intelligence</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentPlan.budget.savingsTips.map((tip, idx) => (
                    <div key={idx} className="bg-white p-3.5 rounded-lg border border-teal-100 text-xs text-slate-700 flex items-start gap-2">
                      <span className="text-teal-600 font-bold">✓</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: 6. WEATHER & FORECAST */}
          {activeTab === 'weather' && (
            <div className="space-y-6">
              {/* Current Weather Card */}
              <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-md">
                <div>
                  <span className="text-xs uppercase tracking-wider text-teal-200 font-semibold">
                    Current Conditions
                  </span>
                  <h3 className="font-heading text-2xl font-bold mt-1">
                    {currentPlan.weather.destination}
                  </h3>
                  <p className="text-xs text-blue-100 mt-1">{currentPlan.weather.condition}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-4xl font-extrabold font-heading">
                    {currentPlan.weather.currentTemp}°C
                  </div>
                  <div className="space-y-1 text-xs text-blue-100 border-l border-blue-400/40 pl-4">
                    <div className="flex items-center gap-1.5">
                      <Droplets className="w-3.5 h-3.5" /> Humidity: {currentPlan.weather.humidity}%
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wind className="w-3.5 h-3.5" /> Wind: {currentPlan.weather.windSpeed} km/h
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CloudRain className="w-3.5 h-3.5" /> Rain Chance: {currentPlan.weather.rainProbability}%
                    </div>
                  </div>
                </div>
              </div>

              {/* 7-Day Forecast Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {currentPlan.weather.forecast.map((f, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl p-4 border border-slate-200 text-center shadow-xs"
                  >
                    <span className="text-xs font-bold text-slate-800">{f.day}</span>
                    <div className="my-2 flex justify-center text-blue-600">
                      {f.iconName === 'sun' ? (
                        <Sun className="w-6 h-6 text-amber-500" />
                      ) : f.iconName === 'rain' ? (
                        <CloudRain className="w-6 h-6 text-blue-500" />
                      ) : (
                        <CloudSun className="w-6 h-6 text-teal-500" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-900">
                      {f.high}° <span className="text-slate-400 font-normal">/ {f.low}°</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">{f.condition}</div>
                    <div className="text-[10px] text-blue-600 mt-1 font-semibold">
                      ☔ {f.rainProb}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: 7. PACKING CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="bg-white rounded-xl p-6 border border-slate-200 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900">
                    Smart Weather & Luggage Checklist
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tailored for {currentPlan.destination} climate and {currentPlan.travelStyle}.
                  </p>
                </div>
                <div className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                  {checklist.filter((c) => c.checked).length} of {checklist.length} Packed
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-full transition-all duration-300"
                  style={{
                    width: `${checklist.length > 0 ? (checklist.filter((c) => c.checked).length / checklist.length) * 100 : 0}%`,
                  }}
                />
              </div>

              {/* Item List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`p-3 rounded-lg border cursor-pointer select-none transition-colors flex items-center justify-between ${
                      item.checked
                        ? 'bg-teal-50/50 border-teal-200 text-slate-400'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          item.checked
                            ? 'bg-teal-600 border-teal-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {item.checked && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className={`text-xs font-medium ${item.checked ? 'line-through text-slate-400' : ''}`}>
                        {item.item}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>

              {/* Add Custom Item */}
              <form onSubmit={addChecklistItem} className="flex gap-2 max-w-md pt-2">
                <input
                  type="text"
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="Add custom packing item..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
