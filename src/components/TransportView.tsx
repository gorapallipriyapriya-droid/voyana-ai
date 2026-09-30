import React, { useState } from 'react';
import { Plane, Train, Bus, Car, Clock, Shield, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { SAMPLE_TRIP_PLAN, CURRENCY_RATES } from '../data/mockData';

interface TransportViewProps {
  selectedCurrency: string;
}

export const TransportView: React.FC<TransportViewProps> = ({ selectedCurrency }) => {
  const [activeTransitType, setActiveTransitType] = useState<'flights' | 'trains' | 'buses' | 'rentals'>('flights');
  const [filterNonStop, setFilterNonStop] = useState(false);
  const [bookedItem, setBookedItem] = useState<string | null>(null);

  const currencyInfo = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES['USD'];
  const formatCost = (usd: number) => {
    return `${currencyInfo.symbol}${Math.round(usd * currencyInfo.rate).toLocaleString()}`;
  };

  const flights = SAMPLE_TRIP_PLAN.transport.flights.filter(f => !filterNonStop || f.stops.includes('Direct') || f.stops.includes('Non-stop'));
  const trains = SAMPLE_TRIP_PLAN.transport.trains;
  const buses = SAMPLE_TRIP_PLAN.transport.buses;
  const rentals = SAMPLE_TRIP_PLAN.transport.rentals;

  const handleBook = (name: string) => {
    setBookedItem(name);
    setTimeout(() => setBookedItem(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
          <Plane className="w-3.5 h-3.5 text-blue-600" />
          <span>Multi-Modal Logistics</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Transit Hub & Mobility Options
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Compare commercial flights, high-speed rail, regional luxury sleeper coaches, and car rentals with live seat availability.
        </p>
      </div>

      {bookedItem && (
        <div className="mb-6 p-4 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800 font-semibold flex items-center justify-between animate-fadeIn">
          <span>✓ Reservation simulated for <strong>{bookedItem}</strong>. Confirmation voucher added to your Dashboard.</span>
          <button onClick={() => setBookedItem(null)} className="text-teal-600 hover:text-teal-900 font-bold">Dismiss</button>
        </div>
      )}

      {/* Transit Category Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
        <div className="flex items-center gap-2">
          {[
            { id: 'flights', label: 'Flights', icon: Plane, count: flights.length },
            { id: 'trains', label: 'High-Speed Rail', icon: Train, count: trains.length },
            { id: 'buses', label: 'Express Coaches', icon: Bus, count: buses.length },
            { id: 'rentals', label: 'Car Rentals', icon: Car, count: rentals.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTransitType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTransitType(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-100 text-slate-500'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {activeTransitType === 'flights' && (
          <label className="hidden sm:flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterNonStop}
              onChange={(e) => setFilterNonStop(e.target.checked)}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>Non-stop flights only</span>
          </label>
        )}
      </div>

      {/* Content Panels */}
      {/* 1. FLIGHTS */}
      {activeTransitType === 'flights' && (
        <div className="space-y-4">
          {flights.map((flight, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:border-blue-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Plane className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-base font-bold text-slate-900">{flight.airline}</h3>
                    <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {flight.flightNumber}
                    </span>
                    <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-semibold">
                      {flight.stops}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {flight.classType} · Boeing 787 Dreamliner · Wi-Fi & Seatback Media
                  </p>
                </div>
              </div>

              {/* Timing */}
              <div className="flex items-center gap-6 text-center">
                <div>
                  <div className="text-sm font-bold text-slate-900">{flight.departureTime}</div>
                  <div className="text-[11px] text-slate-400">{flight.originAirport}</div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-medium">{flight.duration}</span>
                  <div className="w-20 sm:w-28 h-0.5 bg-blue-200 relative my-1">
                    <div className="w-2 h-2 rounded-full bg-blue-600 absolute -top-0.75 left-1/2 -translate-x-1/2" />
                  </div>
                  <span className="text-[10px] text-teal-600 font-semibold">{flight.stops}</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{flight.arrivalTime}</div>
                  <div className="text-[11px] text-slate-400">{flight.destAirport}</div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400">Total Roundtrip</span>
                  <div className="text-xl font-extrabold text-slate-900 font-heading">
                    {formatCost(flight.price)}
                  </div>
                </div>
                <button
                  onClick={() => handleBook(`${flight.airline} (${flight.flightNumber})`)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  Select Flight
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. TRAINS */}
      {activeTransitType === 'trains' && (
        <div className="space-y-4">
          {trains.map((train, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:border-teal-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
                  <Train className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-base font-bold text-slate-900">{train.operator}</h3>
                    <span className="text-[11px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {train.trainNumber}
                    </span>
                    <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-semibold">
                      {train.classType}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Scenic Mountain Corridors · 320 km/h · Reserved Window Seating
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-center">
                <div>
                  <div className="text-sm font-bold text-slate-900">{train.departureTime}</div>
                  <div className="text-[11px] text-slate-400">{train.departureStation}</div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-medium">{train.duration}</span>
                  <div className="w-20 sm:w-28 h-0.5 bg-teal-200 relative my-1">
                    <div className="w-2 h-2 rounded-full bg-teal-600 absolute -top-0.75 left-1/2 -translate-x-1/2" />
                  </div>
                  <span className="text-[10px] text-teal-600 font-semibold">High-Speed Express</span>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{train.arrivalTime}</div>
                  <div className="text-[11px] text-slate-400">{train.arrivalStation}</div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400">One-way Fare</span>
                  <div className="text-xl font-extrabold text-slate-900 font-heading">
                    {formatCost(train.fare)}
                  </div>
                </div>
                <button
                  onClick={() => handleBook(`${train.operator} (${train.trainNumber})`)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  Book Seat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. BUSES */}
      {activeTransitType === 'buses' && (
        <div className="space-y-4">
          {buses.map((bus, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs hover:border-purple-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <Bus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-slate-900">{bus.operator}</h3>
                  <p className="text-xs text-slate-500 mt-1">{bus.busType}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-center">
                <div>
                  <div className="text-sm font-bold text-slate-900">{bus.departureTime}</div>
                  <div className="text-[11px] text-slate-400">Central Depot</div>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-slate-400 font-medium">{bus.duration}</span>
                  <div className="w-20 sm:w-28 h-0.5 bg-purple-200 relative my-1" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{bus.arrivalTime}</div>
                  <div className="text-[11px] text-slate-400">Destination Terminal</div>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-400">Ticket Price</span>
                  <div className="text-xl font-extrabold text-slate-900 font-heading">
                    {formatCost(bus.fare)}
                  </div>
                </div>
                <button
                  onClick={() => handleBook(bus.operator)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  Reserve Coach
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. RENTALS */}
      {activeTransitType === 'rentals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rentals.map((car, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <img
                  src={car.image}
                  alt={car.vehicle}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase text-teal-600">{car.provider}</span>
                    <span className="text-xs font-semibold text-slate-500">{car.transmission}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-slate-900 mb-1">{car.vehicle}</h3>
                  <p className="text-xs text-slate-500 mb-3">{car.type} · {car.seats} Passengers · Unlimited Kilometers</p>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600">
                    ⛽ Estimated Fuel Consumption: <strong>{formatCost(car.fuelEstimate)}/tank</strong>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400">Daily rate</span>
                    <div className="text-xl font-extrabold text-slate-900 font-heading">
                      {formatCost(car.costPerDay)}
                      <span className="text-xs font-normal text-slate-500"> / day</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBook(car.vehicle)}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                  >
                    Rent Vehicle
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
