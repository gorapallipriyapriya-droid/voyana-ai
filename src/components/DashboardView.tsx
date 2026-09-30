import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Plane
} from 'lucide-react';
import { TripPlan } from '../types/travel';
import { SAMPLE_TRIP_PLAN, POPULAR_DESTINATIONS, CURRENCY_RATES } from '../data/mockData';

interface DashboardViewProps {
  savedTrips: TripPlan[];
  onOpenTrip: (trip: TripPlan) => void;
  selectedCurrency: string;
  onPlanNewTrip?: () => void;
}

interface LoggedExpense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  savedTrips,
  onOpenTrip,
  selectedCurrency,
  onPlanNewTrip
}) => {
  const [activeSection, setActiveSection] = useState<'trips' | 'expenses' | 'history'>('trips');
  
  // Real-time expense tracker state
  const [expenses, setExpenses] = useState<LoggedExpense[]>([
    { id: 'exp-1', category: 'Dining', description: 'Michelin Ramen lunch in Ginza', amount: 35, date: '2026-10-10' },
    { id: 'exp-2', category: 'Transport', description: 'Digital Suica card recharge', amount: 30, date: '2026-10-10' },
    { id: 'exp-3', category: 'Activities', description: 'TeamLab Planets admission tickets', amount: 76, date: '2026-10-11' },
    { id: 'exp-4', category: 'Shopping', description: 'Artisan green tea ceramics in Kyoto', amount: 65, date: '2026-10-12' },
  ]);

  const [newCategory, setNewCategory] = useState('Dining');
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');

  const currencyInfo = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES['USD'];
  const formatCost = (usd: number) => {
    return `${currencyInfo.symbol}${Math.round(usd * currencyInfo.rate).toLocaleString()}`;
  };

  const allTrips = savedTrips.length > 0 ? savedTrips : [SAMPLE_TRIP_PLAN];
  const upcomingTrip = allTrips[0];

  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc.trim() || !newAmount) return;
    const item: LoggedExpense = {
      id: `exp-${Date.now()}`,
      category: newCategory,
      description: newDesc.trim(),
      amount: parseFloat(newAmount),
      date: new Date().toISOString().split('T')[0],
    };
    setExpenses([item, ...expenses]);
    setNewDesc('');
    setNewAmount('');
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const exportTripJSON = (trip: TripPlan) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trip, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${trip.title.replace(/\s+/g, '_')}_VoyanaAI.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>Traveler Command Center</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Journeys & Budget Dashboard
          </h1>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveSection('trips')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSection === 'trips' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Saved Trips ({allTrips.length})
          </button>
          <button
            onClick={() => setActiveSection('expenses')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSection === 'expenses' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Expense Tracker
          </button>
          <button
            onClick={() => setActiveSection('history')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeSection === 'history' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past History
          </button>
        </div>
      </div>

      {/* 1. UPCOMING & SAVED TRIPS */}
      {activeSection === 'trips' && (
        <div className="space-y-8">
          {/* Upcoming Trip Spotlight Card */}
          {upcomingTrip && (
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 bg-teal-950 border border-teal-800 px-2 py-0.5 rounded">
                    Next Upcoming Journey
                  </span>
                  <h2 className="font-heading text-2xl font-bold mt-2">
                    {upcomingTrip.title}
                  </h2>
                  <div className="flex items-center gap-4 text-xs text-slate-300 mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-teal-400" /> {upcomingTrip.destination}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" /> {upcomingTrip.dates.start} to {upcomingTrip.dates.end}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-3 max-w-xl leading-relaxed">
                    {upcomingTrip.summary}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-3 border-t md:border-t-0 pt-4 md:pt-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 uppercase">Estimated Budget</span>
                    <div className="text-2xl font-extrabold text-white font-heading">
                      {formatCost(upcomingTrip.budget.totalEstimatedCost)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenTrip(upcomingTrip)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <span>View Full Plan</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => exportTripJSON(upcomingTrip)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                      title="Download JSON Trip Backup"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* All Saved Trips Grid */}
          <div>
            <h3 className="font-heading text-lg font-bold text-slate-900 mb-4">
              All Saved Itineraries ({allTrips.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span>{trip.durationDays} Days · {trip.travelers} Guests</span>
                      <span className="text-teal-600 font-semibold">{trip.budgetLevel}</span>
                    </div>
                    <h4 className="font-heading text-base font-bold text-slate-900 mb-1">
                      {trip.title}
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">{trip.destination}</p>
                    <div className="text-xs font-bold text-slate-900 font-heading">
                      Estimated Cost: {formatCost(trip.budget.totalEstimatedCost)}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Created: {new Date(trip.createdAt).toLocaleDateString()}</span>
                    <button
                      onClick={() => onOpenTrip(trip)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      Open Itinerary
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. EXPENSE TRACKER */}
      {activeSection === 'expenses' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Add Expense Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" /> Log Real-Time Travel Expense
            </h3>
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Expense Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
                >
                  <option>Dining</option>
                  <option>Transport</option>
                  <option>Activities</option>
                  <option>Lodging</option>
                  <option>Shopping</option>
                  <option>Emergency / Misc</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Description / Vendor
                </label>
                <input
                  type="text"
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Subway pass, espresso, museum ticket"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Amount in USD ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="e.g. 24.50"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Log Expense
              </button>
            </form>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="flex justify-between font-semibold text-slate-700">
                <span>Total Tracked to Date:</span>
                <span className="font-extrabold text-slate-900 font-heading text-sm">
                  {formatCost(totalSpent)}
                </span>
              </div>
            </div>
          </div>

          {/* Expense Log List */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading text-base font-bold text-slate-900">
                Logged Travel Purchases ({expenses.length})
              </h3>
              <span className="text-xs text-slate-500">{formatCost(totalSpent)} Total</span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3 rounded-lg border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {exp.category}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{exp.description}</div>
                      <div className="text-[10px] text-slate-400">{exp.date}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-900 font-heading">
                      {formatCost(exp.amount)}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(exp.id)}
                      className="p-1 text-slate-400 hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TRAVEL HISTORY */}
      {activeSection === 'history' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-heading text-base font-bold text-slate-900">
            Completed Past Expeditions
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Rome, Florence & Amalfi Coast', dates: 'May 2025', duration: '9 Days', rating: '5.0 ⭐', highlight: 'Private Path of Gods guided walk' },
              { title: 'Iceland Ring Road & Glaciers', dates: 'September 2024', duration: '7 Days', rating: '4.9 ⭐', highlight: 'Northern Lights at Reynisfjara' },
              { title: 'New York City Broadway Explorer', dates: 'November 2023', duration: '5 Days', rating: '4.8 ⭐', highlight: 'Summit One Vanderbilt skyline' },
            ].map((past, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{past.title}</h4>
                  <p className="text-[11px] text-slate-500">{past.dates} · {past.duration} · Highlight: {past.highlight}</p>
                </div>
                <div className="text-xs font-bold text-slate-800 bg-white px-2.5 py-1 rounded border border-slate-200">
                  {past.rating}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
