import React, { useState } from 'react';
import { Search, Star, MapPin, Check, Hotel as HotelIcon, Wifi, Sparkles, Filter, X, ShieldCheck } from 'lucide-react';
import { HOTELS_CATALOG, CURRENCY_RATES } from '../data/mockData';
import { Hotel } from '../types/travel';

interface HotelsViewProps {
  selectedCurrency: string;
}

export const HotelsView: React.FC<HotelsViewProps> = ({ selectedCurrency }) => {
  const [search, setSearch] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [maxPriceUSD, setMaxPriceUSD] = useState(600);
  const [selectedAmenity, setSelectedAmenity] = useState<string>('All');
  const [bookingHotel, setBookingHotel] = useState<Hotel | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [guestName, setGuestName] = useState('Alex Morgan');
  const [nights, setNights] = useState(3);

  const currencyInfo = CURRENCY_RATES[selectedCurrency] || CURRENCY_RATES['USD'];
  const formatCost = (usd: number) => {
    return `${currencyInfo.symbol}${Math.round(usd * currencyInfo.rate).toLocaleString()}`;
  };

  const amenitiesList = ['All', 'Infinity Pool', 'Luxury Spa', 'Free High-Speed WiFi', 'Michelin Chef Restaurant', 'Airport Chauffeur'];

  const filteredHotels = HOTELS_CATALOG.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(search.toLowerCase()) ||
      hotel.address.toLowerCase().includes(search.toLowerCase()) ||
      hotel.description.toLowerCase().includes(search.toLowerCase());
    const matchesRating = hotel.rating >= minRating;
    const matchesPrice = hotel.pricePerNight <= maxPriceUSD;
    const matchesAmenity = selectedAmenity === 'All' || hotel.amenities.includes(selectedAmenity);
    return matchesSearch && matchesRating && matchesPrice && matchesAmenity;
  });

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
          <HotelIcon className="w-3.5 h-3.5 text-blue-600" />
          <span>Verified Accommodations</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Curated Boutique & Luxury Hotels
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Discover vetted design stays, five-star heritage palaces, and eco-lodges with guaranteed price matching and instant confirmation.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hotel name or neighborhood..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Max Price Filter */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Max Price per Night</span>
              <span className="text-blue-600 font-bold">{formatCost(maxPriceUSD)}</span>
            </div>
            <input
              type="range"
              min={100}
              max={650}
              step={25}
              value={maxPriceUSD}
              onChange={(e) => setMaxPriceUSD(parseInt(e.target.value, 10))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Rating filter */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Guest Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none"
            >
              <option value={0}>All Verified Ratings</option>
              <option value={4.7}>⭐ 4.7+ Exceptional</option>
              <option value={4.8}>⭐ 4.8+ Superior</option>
              <option value={4.9}>⭐ 4.9+ World-Class</option>
            </select>
          </div>
        </div>

        {/* Amenity Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-400 uppercase mr-1">
            Amenities:
          </span>
          {amenitiesList.map((am) => (
            <button
              key={am}
              onClick={() => setSelectedAmenity(am)}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                selectedAmenity === am
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {am}
            </button>
          ))}
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-52 overflow-hidden">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-800 shadow-xs">
                  {hotel.tag}
                </div>
                <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{hotel.rating} ({hotel.reviewsCount})</span>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{hotel.distanceToCenter}</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-slate-900 mb-1">
                  {hotel.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {hotel.description}
                </p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {hotel.amenities.map((am, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                    >
                      {am}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400">Nightly rate from</span>
                  <div className="text-xl font-extrabold text-slate-900 font-heading">
                    {formatCost(hotel.pricePerNight)}
                    <span className="text-xs font-normal text-slate-500"> / night</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setBookingHotel(hotel);
                    setBookingConfirmed(false);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
                >
                  Book Stay
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Checkout Modal */}
      {bookingHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setBookingHotel(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingConfirmed ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-slate-900">
                  Reservation Confirmed!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Your stay at <strong>{bookingHotel.name}</strong> for {nights} nights has been secured.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Guest:</span>
                    <span className="font-bold text-slate-800">{guestName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Confirmation Code:</span>
                    <span className="font-mono font-bold text-blue-600">VOY-HTL-{Math.floor(100000 + Math.random() * 900000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Billed:</span>
                    <span className="font-bold text-slate-900">{formatCost(bookingHotel.pricePerNight * nights)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setBookingHotel(null)}
                  className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={bookingHotel.image}
                    alt={bookingHotel.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <span className="text-[10px] text-teal-600 font-bold uppercase">{bookingHotel.tag}</span>
                    <h3 className="font-heading text-lg font-bold text-slate-900">{bookingHotel.name}</h3>
                    <p className="text-xs text-slate-500">{bookingHotel.address}</p>
                  </div>
                </div>

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Lead Guest Name
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Length of Stay
                      </label>
                      <select
                        value={nights}
                        onChange={(e) => setNights(parseInt(e.target.value, 10))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5, 7, 10].map((n) => (
                          <option key={n} value={n}>{n} Nights</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Room Category
                      </label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none">
                        <option>Deluxe King Suite</option>
                        <option>Executive Skyline View</option>
                        <option>Garden Terrace Suite</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Rate ({nights} nights × {formatCost(bookingHotel.pricePerNight)})</span>
                      <span>{formatCost(bookingHotel.pricePerNight * nights)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Taxes & Service Fees</span>
                      <span className="text-teal-600 font-semibold">Included</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                      <span>Total Reservation</span>
                      <span>{formatCost(bookingHotel.pricePerNight * nights)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Free cancellation up to 48 hours before check-in</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                  >
                    Confirm & Reserve Room
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
