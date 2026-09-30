import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { SAMPLE_TRIP_PLAN, HOTELS_CATALOG, POPULAR_DESTINATIONS, VISA_DATABASE } from './src/data/mockData';
import { TripPlan, TripPlanRequest } from './src/types/travel';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to compute dates difference
function calculateDays(start?: string, end?: string): number {
  if (!start || !end) return 5;
  try {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return diff > 0 && diff <= 30 ? diff : 5;
  } catch {
    return 5;
  }
}

// Fallback generator if Gemini is unavailable or errors
function generateFallbackTripPlan(reqBody: TripPlanRequest): TripPlan {
  const duration = calculateDays(reqBody.startDate, reqBody.endDate);
  const destination = reqBody.destination || 'Tokyo, Japan';
  const startLoc = reqBody.startLocation || 'San Francisco, CA';
  const travelers = reqBody.travelers || 2;
  const budgetMultiplier = reqBody.budgetLevel?.includes('Luxury') ? 2.5 : reqBody.budgetLevel?.includes('Budget') ? 0.6 : 1.2;

  // Clone sample plan and customize
  const plan: TripPlan = JSON.parse(JSON.stringify(SAMPLE_TRIP_PLAN));
  plan.id = `voyana-plan-${Date.now()}`;
  plan.title = `${duration}-Day Journey to ${destination}`;
  plan.destination = destination;
  plan.startLocation = startLoc;
  plan.dates = {
    start: reqBody.startDate || '2026-10-15',
    end: reqBody.endDate || '2026-10-22',
  };
  plan.durationDays = duration;
  plan.travelers = travelers;
  plan.budgetLevel = reqBody.budgetLevel || 'Moderate ($$)';
  plan.travelStyle = reqBody.travelStyle || 'Culture & Heritage';
  plan.summary = `A bespoke ${duration}-day itinerary designed for ${travelers} traveler(s) venturing from ${startLoc} to ${destination}. Curated for ${reqBody.travelStyle || 'cultural exploration'} with tailored ${reqBody.hotelPref || 'boutique stays'} and ${reqBody.foodPref || 'local culinary highlights'}.`;

  // Adjust route
  plan.route.origin = startLoc;
  plan.route.destination = destination;

  // Trim or expand daily itinerary to match exact duration
  const baseDays = plan.dailyItinerary;
  const adjustedDays = [];
  for (let i = 1; i <= duration; i++) {
    const templateIndex = (i - 1) % baseDays.length;
    const dayCopy = JSON.parse(JSON.stringify(baseDays[templateIndex]));
    dayCopy.day = i;
    dayCopy.date = `Day ${i}: ${i === 1 ? 'Arrival & First Impressions' : i === duration ? 'Farewell & Departure' : dayCopy.theme}`;
    dayCopy.dayBudget = Math.round(dayCopy.dayBudget * budgetMultiplier);
    adjustedDays.push(dayCopy);
  }
  plan.dailyItinerary = adjustedDays;

  // Adjust budget calculation
  plan.budget.accommodationCost = Math.round(180 * duration * budgetMultiplier);
  plan.budget.transportCost = Math.round(450 * travelers * (budgetMultiplier * 0.8));
  plan.budget.foodCost = Math.round(75 * duration * travelers * budgetMultiplier);
  plan.budget.activitiesCost = Math.round(45 * duration * travelers);
  plan.budget.shoppingCost = Math.round(50 * duration);
  plan.budget.emergencyFund = Math.round(200 * budgetMultiplier);
  plan.budget.totalEstimatedCost =
    plan.budget.accommodationCost +
    plan.budget.transportCost +
    plan.budget.foodCost +
    plan.budget.activitiesCost +
    plan.budget.shoppingCost +
    plan.budget.emergencyFund;

  plan.createdAt = new Date().toISOString();
  return plan;
}

// 1. Generate Trip Endpoint
app.post('/api/generate-trip', async (req: Request, res: Response) => {
  const reqBody: TripPlanRequest = req.body;

  if (!apiKey) {
    // Return high quality fallback
    return res.json(generateFallbackTripPlan(reqBody));
  }

  try {
    const days = calculateDays(reqBody.startDate, reqBody.endDate);
    const prompt = `You are Voyana AI, the world's most advanced travel planner engine.
Generate a comprehensive, highly realistic JSON travel itinerary with the following parameters:
- Origin: ${reqBody.startLocation}
- Destination: ${reqBody.destination}
- Dates: ${reqBody.startDate} to ${reqBody.endDate} (${days} days)
- Travelers: ${reqBody.travelers}
- Budget Tier: ${reqBody.budgetLevel}
- Travel Style: ${reqBody.travelStyle}
- Hotel Preference: ${reqBody.hotelPref}
- Transport Preference: ${reqBody.transportPref}
- Food Preference: ${reqBody.foodPref}
- Special Notes: ${reqBody.notes || 'None'}

Return ONLY a valid JSON object matching this TypeScript structure:
{
  "id": "voyana-${Date.now()}",
  "title": "Short punchy trip title",
  "destination": "${reqBody.destination}",
  "startLocation": "${reqBody.startLocation}",
  "dates": { "start": "${reqBody.startDate}", "end": "${reqBody.endDate}" },
  "durationDays": ${days},
  "travelers": ${reqBody.travelers},
  "budgetLevel": "${reqBody.budgetLevel}",
  "travelStyle": "${reqBody.travelStyle}",
  "summary": "2-3 sentences overview",
  "highlights": ["3-5 specific unique highlights"],
  "route": {
    "origin": "${reqBody.startLocation}",
    "destination": "${reqBody.destination}",
    "distanceKm": 1200,
    "travelTimeHours": "e.g. 5 hours flight",
    "alternateRoutes": [
      { "name": "Route name", "description": "Details", "distanceKm": 1300, "time": "6 hours", "highlight": "Scenic view" }
    ],
    "fuelCostEstimate": 60,
    "routeWaypoints": [
      { "name": "Point 1", "lat": 0.0, "lng": 0.0, "type": "start", "description": "Start point" },
      { "name": "Point 2", "lat": 0.0, "lng": 0.0, "type": "destination", "description": "Arrival point" }
    ]
  },
  "dailyItinerary": [
    {
      "day": 1,
      "date": "Day 1: Theme",
      "theme": "Theme title",
      "morning": { "title": "Morning activity", "timeSlot": "09:00 AM - 12:00 PM", "duration": "3 hours", "cost": 25, "location": "Location", "description": "Description", "category": "Sightseeing", "tips": "Helpful tip" },
      "afternoon": { "title": "Afternoon activity", "timeSlot": "01:30 PM - 04:30 PM", "duration": "3 hours", "cost": 30, "location": "Location", "description": "Description", "category": "Culture", "tips": "Tip" },
      "evening": { "title": "Evening activity", "timeSlot": "06:00 PM - 08:30 PM", "duration": "2.5 hours", "cost": 50, "location": "Location", "description": "Dinner & atmosphere", "category": "Dining", "tips": "Tip" },
      "night": { "title": "Night activity", "timeSlot": "09:00 PM - 10:30 PM", "duration": "1.5 hours", "cost": 15, "location": "Location", "description": "Night view or stroll", "category": "Leisure", "tips": "Tip" },
      "dayBudget": 120
    }
  ],
  "hotels": [
    { "id": "h-1", "name": "Hotel Name", "stars": 4, "rating": 4.8, "reviewsCount": 420, "pricePerNight": 190, "currency": "USD", "amenities": ["WiFi", "Pool", "Breakfast"], "distanceToCenter": "0.5 km", "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80", "tag": "Recommended", "address": "Address", "description": "Description" }
  ],
  "transport": {
    "flights": [
      { "airline": "Airline Name", "flightNumber": "FL 101", "price": 450, "duration": "6h 30m", "departureTime": "08:00 AM", "arrivalTime": "02:30 PM", "stops": "Direct", "originAirport": "Origin", "destAirport": "Dest", "classType": "Economy" }
    ],
    "trains": [
      { "operator": "Rail Operator", "trainNumber": "EXP 202", "fare": 45, "departureTime": "10:00 AM", "arrivalTime": "12:15 PM", "duration": "2h 15m", "classType": "Standard", "departureStation": "Central", "arrivalStation": "Terminal" }
    ],
    "buses": [
      { "operator": "Coach Express", "fare": 25, "departureTime": "09:00 AM", "arrivalTime": "12:30 PM", "duration": "3h 30m", "busType": "AC Sleeper / WiFi" }
    ],
    "rentals": [
      { "vehicle": "Compact SUV", "type": "SUV", "costPerDay": 65, "fuelEstimate": 30, "seats": 5, "transmission": "Automatic", "image": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80", "provider": "Voyana Mobility" }
    ]
  },
  "budget": {
    "accommodationCost": 800,
    "transportCost": 600,
    "foodCost": 450,
    "activitiesCost": 250,
    "shoppingCost": 200,
    "emergencyFund": 150,
    "totalEstimatedCost": 2450,
    "currency": "USD",
    "savingsTips": ["Tip 1", "Tip 2", "Tip 3"]
  },
  "weather": {
    "destination": "${reqBody.destination}",
    "currentTemp": 22,
    "condition": "Partly Cloudy",
    "humidity": 60,
    "windSpeed": 14,
    "rainProbability": 20,
    "forecast": [
      { "day": "Day 1", "high": 24, "low": 16, "condition": "Sunny", "rainProb": 10, "iconName": "sun" },
      { "day": "Day 2", "high": 23, "low": 15, "condition": "Partly Cloudy", "rainProb": 20, "iconName": "cloud-sun" },
      { "day": "Day 3", "high": 22, "low": 15, "condition": "Clear", "rainProb": 5, "iconName": "sun" }
    ]
  },
  "attractions": [
    { "id": "attr-1", "name": "Key Sight", "destination": "${reqBody.destination}", "category": "Sightseeing", "rating": 4.9, "reviewsCount": 8500, "entryFee": 15, "bestTime": "Morning", "description": "Must visit attraction", "image": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80", "highlights": ["Feature 1", "Feature 2"] }
  ],
  "checklist": [
    { "id": "c-1", "category": "Essentials", "item": "Valid Passport (6+ months)", "checked": true },
    { "id": "c-2", "category": "Electronics", "item": "Universal adapter & power bank", "checked": false },
    { "id": "c-3", "category": "Health", "item": "Travel insurance coverage", "checked": true }
  ],
  "createdAt": "${new Date().toISOString()}"
}

Ensure all ${days} days are included in dailyItinerary. Do not include markdown code block syntax like \`\`\`json. Output pure JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '';
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleaned);
    return res.json(parsedData);
  } catch (error) {
    console.error('Gemini generate trip error:', error);
    return res.json(generateFallbackTripPlan(reqBody));
  }
});

// 2. AI Travel Concierge Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history, tripContext } = req.body;

  if (!apiKey) {
    return res.json({
      reply: `I'm Voyana AI, your travel concierge! Regarding "${message}": For your journey${tripContext ? ` to ${tripContext.destination}` : ''}, I recommend booking popular attractions 2-3 weeks in advance, taking advantage of local contactless transit cards, and packing light layers for varying microclimates. What specific detail can I optimize for you?`,
      suggestedActions: [
        'How should I pack for the weather?',
        'Suggest hidden gem restaurants',
        'What are the local transportation tips?',
        'Estimate local daily costs'
      ]
    });
  }

  try {
    const systemPrompt = `You are Voyana AI, an elite multilingual travel concierge and route strategist.
Provide concise, elegant, and exceptionally helpful travel recommendations.
Current Trip Context: ${tripContext ? JSON.stringify(tripContext) : 'General travel inquiry'}.
Respond in 2-3 structured paragraphs with bullet points for readability. Be warm, savvy, and practical. Suggest 3 short relevant follow-up questions at the end.`;

    const conversationPrompt = `${systemPrompt}\n\nUser Question: ${message}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: conversationPrompt,
      config: {
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'I am ready to help you plan your next dream adventure.';
    return res.json({
      reply: replyText,
      suggestedActions: [
        'Find best local food nearby',
        'Check visa requirements',
        'Optimize my budget breakdown',
        'Suggest day trips'
      ]
    });
  } catch (error) {
    console.error('Chat error:', error);
    return res.json({
      reply: `I'd love to help with "${message}". Make sure to carry local currency for smaller vendors, keep a digital backup of your passport, and book your tickets ahead during peak seasons!`,
      suggestedActions: ['Weather outlook', 'Best time to visit', 'Transport options']
    });
  }
});

// 3. Language Translator & Phrasebook
app.post('/api/translate', async (req: Request, res: Response) => {
  const { text, targetLang } = req.body;

  if (!apiKey) {
    const commonPhrases: Record<string, { translation: string; phonetic: string; tip: string }> = {
      'Hello': { translation: 'Konnichiwa (こんにちは)', phonetic: 'kohn-nee-chee-wah', tip: 'Use with a slight polite bow.' },
      'Thank you': { translation: 'Arigatou Gozaimasu (ありがとうございます)', phonetic: 'ah-ree-gah-toh goh-zahy-mahs', tip: 'Standard formal appreciation.' },
      'Where is the train station?': { translation: 'Eki wa doko desu ka? (駅はどこですか？)', phonetic: 'eh-kee wah doh-koh dess kah', tip: 'Show your map on mobile if needed.' },
      'How much is this?': { translation: 'Kore wa ikura desu ka? (これはいくらですか？)', phonetic: 'koh-reh wah ee-koo-rah dess kah', tip: 'Hand cash with both hands.' },
      'Delicious!': { translation: 'Oishii desu! (美味しいです！)', phonetic: 'oy-shee dess', tip: 'Compliment the chef enthusiastically.' },
    };

    const match = commonPhrases[text] || {
      translation: `Translated: "${text}" [${targetLang || 'Local'}]`,
      phonetic: 'Pronounced naturally with polite tone',
      tip: 'Remember to smile and use polite hand gestures.'
    };
    return res.json(match);
  }

  try {
    const prompt = `Translate the phrase "${text}" into ${targetLang || 'Japanese'}.
Return a JSON object:
{
  "translation": "Translated text with native script and romanization",
  "phonetic": "Clear phonetic pronunciation guide for English speakers",
  "tip": "1 sentence cultural etiquette tip when saying this"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error) {
    console.error('Translation error:', error);
    return res.json({
      translation: text,
      phonetic: text,
      tip: 'Polite gestures and smiles bridge language gaps everywhere!'
    });
  }
});

// 4. Visa requirements endpoint
app.post('/api/visa-info', (req: Request, res: Response) => {
  const { nationality, destination } = req.body;
  const key = `${nationality}-to-${destination}`;
  const data = VISA_DATABASE[key] || VISA_DATABASE['Default'];
  return res.json(data);
});

// Setup Vite middlewares in development or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Voyana AI server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Voyana AI server:', err);
});
