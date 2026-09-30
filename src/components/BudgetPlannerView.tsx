import React, { useState } from 'react';
import { DollarSign, PieChart, Sparkles, TrendingDown, ShieldAlert, ArrowRight, Download, Sliders, Check } from 'lucide-react';
import { CURRENCY_RATES } from '../data/mockData';

interface BudgetPlannerViewProps {
  selectedCurrency: string;
  onPlanTripWithBudget: (budgetUSD: number, days: number, travelers: number) => void;
}

export const BudgetPlannerView: React.FC<BudgetPlannerViewProps> = ({
  selectedCurrency,
  onPlanTripWithBudget
}) => {
  const [totalBudget, setTotalBudget] = useState(3500);
  const [days, setDays] = useState(7);
  const [travelers, setTravelers] = useState(2);
  const [luxuryTier, setLuxuryTier] = useState<'budget' | 'balanced' | 'premium'>('balanced');

  const currencyInfo = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES['USD'];
  const formatCost = (usd: number) => {
    return `${currencyInfo.symbol}${Math.round(usd * currencyInfo.rate).toLocaleString()}`;
  };

  // Percentage distribution logic based on tier
  const allocations = luxuryTier === 'budget' ? {
    lodging: 0.30,
    transport: 0.30,
    food: 0.20,
    activities: 0.10,
    shopping: 0.05,
    emergency: 0.05
  } : luxuryTier === 'premium' ? {
    lodging: 0.42,
    transport: 0.22,
    food: 0.20,
    activities: 0.08,
    shopping: 0.05,
    emergency: 0.03
  } : {
    lodging: 0.35,
    transport: 0.25,
    food: 0.20,
    activities: 0.10,
    shopping: 0.05,
    emergency: 0.05
  };

  const lodgingCost = Math.round(totalBudget * allocations.lodging);
  const transportCost = Math.round(totalBudget * allocations.transport);
  const foodCost = Math.round(totalBudget * allocations.food);
  const activitiesCost = Math.round(totalBudget * allocations.activities);
  const shoppingCost = Math.round(totalBudget * allocations.shopping);
  const emergencyCost = Math.round(totalBudget * allocations.emergency);

  const dailyAllowancePerPerson = Math.round(totalBudget / days / travelers);

  const savingsTips = [
    { title: 'Lock Rail & Flight Corridors Early', desc: 'Booking intercity bullet trains and non-stop flights 45-60 days in advance saves up to 35% on standard fares.' },
    { title: 'Dine High at Lunch, Street at Dinner', desc: 'Top Michelin and heritage restaurants often offer multi-course lunch tasting menus for half the evening rate.' },
    { title: 'Grab Official City Pass Cards', desc: 'Integrated transit & museum passes provide unlimited subway rides and skip-the-line admissions to 40+ attractions.' },
    { title: 'Tax-Free Shopping Physical Passport', desc: 'Carry your original physical passport to claim immediate 8-15% VAT/Sales tax rebates at checkout counters.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-3">
          <DollarSign className="w-3.5 h-3.5 text-teal-600" />
          <span>Interactive Financial Forecasting</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Smart Travel Budget Planner
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Model your journey expenses, optimize categorical allocations, and forecast exact per-traveler daily allowances.
        </p>
      </div>

      {/* Main Interactive Controls + Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Controls Column */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" /> Budget Parameters
            </h3>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
              Active Model
            </span>
          </div>

          {/* Total Budget Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Target Trip Budget
              </label>
              <span className="text-base font-extrabold text-blue-600 font-heading">
                {formatCost(totalBudget)}
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={15000}
              step={100}
              value={totalBudget}
              onChange={(e) => setTotalBudget(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>{formatCost(500)}</span>
              <span>{formatCost(7500)}</span>
              <span>{formatCost(15000)}</span>
            </div>
          </div>

          {/* Days Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Trip Duration (Days)
              </label>
              <span className="text-sm font-bold text-slate-900">
                {days} Days ({days - 1} Nights)
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={21}
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>2 Days (Weekend)</span>
              <span>7 Days (Week)</span>
              <span>21 Days (Grand Tour)</span>
            </div>
          </div>

          {/* Travelers Counter */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase">
                Total Travelers
              </label>
              <span className="text-sm font-bold text-slate-900">
                {travelers} {travelers === 1 ? 'Guest' : 'Guests'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTravelers(num)}
                  className={`py-2 rounded-lg text-xs font-bold transition-colors ${
                    travelers === num
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {num} {num === 1 ? 'Solo' : num === 2 ? 'Pair' : 'Group'}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Tier Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase block mb-2">
              Allocation Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'budget', label: 'Budget Smart' },
                { id: 'balanced', label: 'Comfort & Value' },
                { id: 'premium', label: 'Luxury Focus' },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setLuxuryTier(tier.id as any)}
                  className={`py-2 px-1 text-center rounded-lg text-[11px] font-bold transition-all border ${
                    luxuryTier === tier.id
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick CTA */}
          <button
            onClick={() => onPlanTripWithBudget(totalBudget, days, travelers)}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Itinerary Matching This Budget</span>
          </button>
        </div>

        {/* Visual Forecast & Breakdown Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Budget</span>
              <div className="text-2xl font-extrabold text-slate-900 font-heading mt-1">
                {formatCost(totalBudget)}
              </div>
              <span className="text-[11px] text-teal-600 font-medium">All-inclusive model</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-slate-400">Per Person Daily</span>
              <div className="text-2xl font-extrabold text-blue-600 font-heading mt-1">
                {formatCost(dailyAllowancePerPerson)}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Avg. daily pace</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Safe Emergency Buffer</span>
              <div className="text-2xl font-extrabold text-emerald-600 font-heading mt-1">
                {formatCost(emergencyCost)}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium">Auto-reserved buffer</span>
            </div>
          </div>

          {/* Category Progress Bars */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-heading text-base font-bold text-slate-900 mb-1">
              Categorical Expense Distribution
            </h3>

            {/* Combined Bar */}
            <div className="w-full h-4 rounded-full overflow-hidden flex shadow-inner bg-slate-100">
              <div style={{ width: `${allocations.lodging * 100}%` }} className="bg-blue-600" title="Lodging" />
              <div style={{ width: `${allocations.transport * 100}%` }} className="bg-teal-500" title="Transit" />
              <div style={{ width: `${allocations.food * 100}%` }} className="bg-orange-500" title="Dining" />
              <div style={{ width: `${allocations.activities * 100}%` }} className="bg-purple-500" title="Activities" />
              <div style={{ width: `${allocations.shopping * 100}%` }} className="bg-pink-500" title="Shopping" />
              <div style={{ width: `${allocations.emergency * 100}%` }} className="bg-emerald-500" title="Emergency" />
            </div>

            {/* Detailed Category Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Lodging & Hotels</div>
                    <div className="text-[10px] text-slate-400">{Math.round(allocations.lodging * 100)}% of total</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-900 font-heading">{formatCost(lodgingCost)}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Flights & Transit</div>
                    <div className="text-[10px] text-slate-400">{Math.round(allocations.transport * 100)}% of total</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-900 font-heading">{formatCost(transportCost)}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Food & Gastronomy</div>
                    <div className="text-[10px] text-slate-400">{Math.round(allocations.food * 100)}% of total</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-900 font-heading">{formatCost(foodCost)}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Activities & Tours</div>
                    <div className="text-[10px] text-slate-400">{Math.round(allocations.activities * 100)}% of total</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-900 font-heading">{formatCost(activitiesCost)}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Shopping & Souvenirs</div>
                    <div className="text-[10px] text-slate-400">{Math.round(allocations.shopping * 100)}% of total</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-900 font-heading">{formatCost(shoppingCost)}</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-800">Emergency & Healthcare</div>
                    <div className="text-[10px] text-slate-400">{Math.round(allocations.emergency * 100)}% of total</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-emerald-600 font-heading">{formatCost(emergencyCost)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Suggestions Row */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-2">
          <TrendingDown className="w-4 h-4 text-teal-600" />
          <span>Voyana Financial Advisory</span>
        </div>
        <h3 className="font-heading text-xl font-bold text-slate-900 mb-6">
          Tailored Ways to Maximize Your Travel Capital
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savingsTips.map((tip, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1">
                <Check className="w-4 h-4 text-teal-600" />
                <span>{tip.title}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {tip.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
