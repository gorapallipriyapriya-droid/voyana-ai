import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { AITripPlanner } from './components/AITripPlanner';
import { DestinationsView } from './components/DestinationsView';
import { BudgetPlannerView } from './components/BudgetPlannerView';
import { HotelsView } from './components/HotelsView';
import { TransportView } from './components/TransportView';
import { AttractionsView } from './components/AttractionsView';
import { DashboardView } from './components/DashboardView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { AIChatDrawer } from './components/AIChatDrawer';
import { QuickToolsModal } from './components/QuickToolsModal';
import { TripPlan, TripPlanRequest } from './types/travel';
import { SAMPLE_TRIP_PLAN } from './data/mockData';
import { Sparkles, MessageSquare, ArrowRight, Compass, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [activeTripPlan, setActiveTripPlan] = useState<TripPlan | null>(SAMPLE_TRIP_PLAN);
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>([SAMPLE_TRIP_PLAN]);
  const [chatOpen, setChatOpen] = useState(false);
  const [toolsModalOpen, setToolsModalOpen] = useState(false);

  const handleSaveTrip = (plan: TripPlan) => {
    setSavedTrips((prev) => {
      const exists = prev.some((p) => p.id === plan.id);
      return exists ? prev.map((p) => (p.id === plan.id ? plan : p)) : [plan, ...prev];
    });
  };

  const handleQuickPlan = (request: Partial<TripPlanRequest>) => {
    setCurrentTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanTripToDestination = (destinationName: string) => {
    setCurrentTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanTripWithBudget = (budgetUSD: number, days: number, travelers: number) => {
    setCurrentTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTripFromDashboard = (plan: TripPlan) => {
    setActiveTripPlan(plan);
    setCurrentTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-blue-600 selection:text-white">
      {/* Global Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        openToolsModal={() => setToolsModalOpen(true)}
        openChatAssistant={() => setChatOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* PAGE 1: HOME */}
        {currentTab === 'home' && (
          <div>
            <HeroSection
              onQuickPlan={handleQuickPlan}
              onExploreDestinations={() => {
                setCurrentTab('destinations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Popular Destinations Teaser on Home */}
            <div className="bg-white py-16 sm:py-20 border-t border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                  <div>
                    <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                      Handpicked Inspiration
                    </span>
                    <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                      Trending Destinations This Season
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentTab('destinations');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group self-start sm:self-auto"
                  >
                    <span>View all 12+ destinations</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      name: 'Tokyo, Japan',
                      desc: 'Futuristic Metropolises Meets Sacred Shinto Shrines',
                      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80',
                      budget: '$165 / day',
                      season: 'Mar - May',
                    },
                    {
                      name: 'Paris, France',
                      desc: 'The City of Light, Haute Cuisine & Bohemian Montmartre',
                      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
                      budget: '$220 / day',
                      season: 'Apr - Jun',
                    },
                    {
                      name: 'Bali, Indonesia',
                      desc: 'Island of the Gods, Emerald Terraces & Azure Reefs',
                      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
                      budget: '$85 / day',
                      season: 'May - Sep',
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handlePlanTripToDestination(item.name)}
                      className="group cursor-pointer rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all"
                    >
                      <div className="relative h-60 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent" />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] font-bold text-slate-900">
                          {item.budget}
                        </div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="font-heading text-xl font-bold">{item.name}</h3>
                          <p className="text-xs text-slate-300 mt-1 line-clamp-1">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Traveler Testimonials */}
            <div className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                  Real Adventurer Experiences
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  Trusted by Over 120,000 Explorers
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    name: 'Elena Rostova',
                    role: 'Solo Travel Photographer',
                    quote: 'Voyana planned my 10-day Kyoto and Tokyo route flawlessly. The early morning Fushimi Inari timing recommendation let me photograph the gates without a single person in sight!',
                    stars: 5,
                    location: 'Visited Japan',
                  },
                  {
                    name: 'Marcus & Chloe Chen',
                    role: 'Honeymoon Travelers',
                    quote: 'The budget breakdown was 100% accurate down to the daily train pass. We saved over $600 by following the lunchtime Michelin dining tips in Paris.',
                    stars: 5,
                    location: 'Visited France',
                  },
                  {
                    name: 'David Van Der Bilt',
                    role: 'Digital Nomad',
                    quote: 'The multi-modal transport planner found an overnight sleeper coach from Tokyo to Kyoto that saved me an entire night of hotel accommodation. Incredible platform.',
                    stars: 5,
                    location: 'Visited Switzerland & Japan',
                  },
                ].map((testimonial, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-amber-400 text-sm mb-3">★★★★★</div>
                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{testimonial.name}</div>
                        <div className="text-[10px] text-slate-400">{testimonial.role}</div>
                      </div>
                      <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded">
                        {testimonial.location}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 via-teal-600 to-orange-500 py-16 text-white text-center">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Ready to Plan Your Next Dream Journey?
                </h2>
                <p className="mt-3 text-sm text-blue-100 leading-relaxed max-w-xl mx-auto">
                  Experience seamless route mapping, handpicked stays, and accurate budget calculations in seconds.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setCurrentTab('planner');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 bg-white text-blue-600 hover:bg-slate-100 font-extrabold text-xs rounded-xl shadow-lg transition-all"
                  >
                    Launch AI Trip Planner
                  </button>
                  <button
                    onClick={() => {
                      setCurrentTab('destinations');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 bg-blue-900/40 hover:bg-blue-900/60 border border-white/30 text-white font-bold text-xs rounded-xl transition-all"
                  >
                    Browse Destinations
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: AI TRIP PLANNER */}
        {currentTab === 'planner' && (
          <AITripPlanner
            initialPlan={activeTripPlan}
            onSaveTrip={handleSaveTrip}
            selectedCurrency={selectedCurrency}
          />
        )}

        {/* PAGE 3: DESTINATIONS */}
        {currentTab === 'destinations' && (
          <DestinationsView
            onPlanTripTo={handlePlanTripToDestination}
            selectedCurrency={selectedCurrency}
          />
        )}

        {/* PAGE 4: BUDGET PLANNER */}
        {currentTab === 'budget' && (
          <BudgetPlannerView
            selectedCurrency={selectedCurrency}
            onPlanTripWithBudget={handlePlanTripWithBudget}
          />
        )}

        {/* PAGE 5: HOTELS */}
        {currentTab === 'hotels' && (
          <HotelsView selectedCurrency={selectedCurrency} />
        )}

        {/* PAGE 6: TRANSPORT */}
        {currentTab === 'transport' && (
          <TransportView selectedCurrency={selectedCurrency} />
        )}

        {/* PAGE 7: ATTRACTIONS */}
        {currentTab === 'attractions' && (
          <AttractionsView selectedCurrency={selectedCurrency} />
        )}

        {/* PAGE 8: DASHBOARD */}
        {currentTab === 'dashboard' && (
          <DashboardView
            savedTrips={savedTrips}
            selectedCurrency={selectedCurrency}
            onOpenTrip={handleOpenTripFromDashboard}
            onPlanNewTrip={() => {
              setCurrentTab('planner');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* PAGE 9: ABOUT */}
        {currentTab === 'about' && <AboutView />}

        {/* PAGE 10: CONTACT */}
        {currentTab === 'contact' && <ContactView />}
      </main>

      {/* Floating AI Chat Assistant Widget Button */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-5 right-5 z-40 p-3.5 bg-gradient-to-r from-blue-600 via-teal-600 to-orange-500 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer border-2 border-white"
          title="Open Voyana AI Travel Concierge"
        >
          <Sparkles className="w-5 h-5 animate-pulse text-orange-200" />
          <span className="hidden sm:inline-block text-xs font-bold pr-1">
            AI Concierge
          </span>
        </button>
      )}

      {/* Floating Chat Drawer */}
      <AIChatDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        activeTripPlan={activeTripPlan}
      />

      {/* Quick Travel Toolkit Modal (Currency, Visa, Translator, Distance) */}
      <QuickToolsModal
        isOpen={toolsModalOpen}
        onClose={() => setToolsModalOpen(false)}
        selectedCurrency={selectedCurrency}
      />

      {/* Global Footer */}
      <Footer
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        openToolsModal={() => setToolsModalOpen(true)}
      />
    </div>
  );
}
