export type TravelStyle = 'Culture & Heritage' | 'Adventure & Nature' | 'Relaxation & Wellness' | 'Food & Culinary' | 'Romantic Getaway' | 'Family Fun' | 'Luxury & Shopping';

export type BudgetLevel = 'Budget ($)' | 'Moderate ($$)' | 'Luxury ($$$)' | 'Ultra-Luxury ($$$$)';

export type HotelPreference = 'Boutique Hotels' | 'Resort & Spa' | 'City Center 4-5 Star' | 'Hostels & Co-living' | 'Eco-lodges' | 'Vacation Rentals';

export type TransportPreference = 'Flight & Private Cab' | 'Scenic Trains' | 'Self-Drive / Car Rental' | 'Public Transit & Walking' | 'Mix of All';

export type FoodPreference = 'Local Street Food' | 'Fine Dining & Michelin' | 'Vegetarian / Vegan' | 'Halal Friendly' | 'Mix of Local & Casual';

export interface TripPlanRequest {
  startLocation: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budgetLevel: BudgetLevel;
  travelStyle: TravelStyle;
  hotelPref: HotelPreference;
  transportPref: TransportPreference;
  foodPref: FoodPreference;
  notes?: string;
}

export interface Activity {
  title: string;
  timeSlot: string; // e.g. "09:00 AM - 12:00 PM"
  duration: string;
  cost: number;
  location: string;
  description: string;
  category: 'Sightseeing' | 'Dining' | 'Culture' | 'Leisure' | 'Transport' | 'Adventure';
  tips?: string;
}

export interface DayItinerary {
  day: number;
  date: string;
  theme: string;
  morning: Activity;
  afternoon: Activity;
  evening: Activity;
  night: Activity;
  dayBudget: number;
}

export interface Hotel {
  id: string;
  name: string;
  stars: number;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  currency: string;
  amenities: string[];
  distanceToCenter: string;
  image: string;
  tag: string;
  address: string;
  description: string;
}

export interface FlightOption {
  airline: string;
  flightNumber: string;
  price: number;
  duration: string;
  departureTime: string;
  arrivalTime: string;
  stops: string;
  originAirport: string;
  destAirport: string;
  classType: string;
}

export interface TrainOption {
  operator: string;
  trainNumber: string;
  fare: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classType: string;
  departureStation: string;
  arrivalStation: string;
}

export interface BusOption {
  operator: string;
  fare: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  busType: string;
}

export interface RentalCarOption {
  vehicle: string;
  type: string;
  costPerDay: number;
  fuelEstimate: number;
  seats: number;
  transmission: 'Automatic' | 'Manual';
  image: string;
  provider: string;
}

export interface RouteWaypoint {
  name: string;
  lat: number;
  lng: number;
  type: 'start' | 'waypoint' | 'destination' | 'attraction';
  description: string;
}

export interface RoutePlan {
  origin: string;
  destination: string;
  distanceKm: number;
  travelTimeHours: string;
  alternateRoutes: Array<{
    name: string;
    description: string;
    distanceKm: number;
    time: string;
    highlight: string;
  }>;
  fuelCostEstimate: number;
  routeWaypoints: RouteWaypoint[];
}

export interface BudgetBreakdown {
  accommodationCost: number;
  transportCost: number;
  foodCost: number;
  activitiesCost: number;
  shoppingCost: number;
  emergencyFund: number;
  totalEstimatedCost: number;
  currency: string;
  savingsTips: string[];
}

export interface WeatherForecastDay {
  day: string;
  high: number;
  low: number;
  condition: string;
  rainProb: number;
  iconName: 'sun' | 'cloud' | 'rain' | 'cloud-sun';
}

export interface DestinationWeather {
  destination: string;
  currentTemp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  forecast: WeatherForecastDay[];
}

export interface Attraction {
  id: string;
  name: string;
  destination: string;
  category: string;
  rating: number;
  reviewsCount: number;
  entryFee: number;
  bestTime: string;
  description: string;
  image: string;
  highlights: string[];
  lat?: number;
  lng?: number;
}

export interface PackingItem {
  id: string;
  category: string;
  item: string;
  checked: boolean;
}

export interface TripPlan {
  id: string;
  title: string;
  destination: string;
  startLocation: string;
  dates: {
    start: string;
    end: string;
  };
  durationDays: number;
  travelers: number;
  budgetLevel: string;
  travelStyle: string;
  summary: string;
  highlights: string[];
  route: RoutePlan;
  dailyItinerary: DayItinerary[];
  hotels: Hotel[];
  transport: {
    flights: FlightOption[];
    trains: TrainOption[];
    buses: BusOption[];
    rentals: RentalCarOption[];
  };
  budget: BudgetBreakdown;
  weather: DestinationWeather;
  attractions: Attraction[];
  checklist: PackingItem[];
  createdAt: string;
}

export interface DestinationGuide {
  id: string;
  name: string;
  country: string;
  continent: 'Europe' | 'Asia' | 'Americas' | 'Oceania & Pacific' | 'Middle East & Africa';
  tagline: string;
  description: string;
  image: string;
  avgDailyCost: number;
  bestSeason: string;
  rating: number;
  popularFor: string[];
  highlights: string[];
  lat: number;
  lng: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
