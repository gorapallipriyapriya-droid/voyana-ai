import { TripPlan, TripPlanRequest, ChatMessage } from '../types/travel';
import { SAMPLE_TRIP_PLAN, VISA_DATABASE } from '../data/mockData';

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

export function generateClientSideFallbackPlan(req: TripPlanRequest): TripPlan {
  const duration = calculateDays(req.startDate, req.endDate);
  const destination = req.destination || 'Tokyo, Japan';
  const startLoc = req.startLocation || 'San Francisco, CA';
  const travelers = req.travelers || 2;
  const budgetMultiplier = req.budgetLevel?.includes('Luxury') ? 2.2 : req.budgetLevel?.includes('Budget') ? 0.6 : 1.1;

  const base: TripPlan = JSON.parse(JSON.stringify(SAMPLE_TRIP_PLAN));
  base.id = `voyana-plan-${Date.now()}`;
  base.title = `${duration}-Day Journey to ${destination}`;
  base.destination = destination;
  base.startLocation = startLoc;
  base.dates = {
    start: req.startDate || '2026-10-15',
    end: req.endDate || '2026-10-22',
  };
  base.durationDays = duration;
  base.travelers = travelers;
  base.budgetLevel = req.budgetLevel;
  base.travelStyle = req.travelStyle;
  base.summary = `An immersive ${duration}-day travel experience crafted for ${travelers} guest(s) exploring ${destination} from ${startLoc}. Blending authentic local experiences, top-rated stays, and curated culinary adventures.`;

  base.route.origin = startLoc;
  base.route.destination = destination;

  // Build daily itinerary
  const templateDays = base.dailyItinerary;
  const adjusted = [];
  for (let i = 1; i <= duration; i++) {
    const tIndex = (i - 1) % templateDays.length;
    const day = JSON.parse(JSON.stringify(templateDays[tIndex]));
    day.day = i;
    day.date = `Day ${i}: ${i === 1 ? 'Arrival & Neighborhood Stroll' : i === duration ? 'Farewell Highlights & Departure' : day.theme}`;
    day.dayBudget = Math.round(day.dayBudget * budgetMultiplier);
    adjusted.push(day);
  }
  base.dailyItinerary = adjusted;

  // Recalculate budget
  base.budget.accommodationCost = Math.round(180 * duration * budgetMultiplier);
  base.budget.transportCost = Math.round(420 * travelers * (budgetMultiplier * 0.8));
  base.budget.foodCost = Math.round(70 * duration * travelers * budgetMultiplier);
  base.budget.activitiesCost = Math.round(40 * duration * travelers);
  base.budget.shoppingCost = Math.round(45 * duration);
  base.budget.emergencyFund = Math.round(180 * budgetMultiplier);
  base.budget.totalEstimatedCost =
    base.budget.accommodationCost +
    base.budget.transportCost +
    base.budget.foodCost +
    base.budget.activitiesCost +
    base.budget.shoppingCost +
    base.budget.emergencyFund;

  base.createdAt = new Date().toISOString();
  return base;
}

export async function requestTripGeneration(request: TripPlanRequest): Promise<TripPlan> {
  try {
    const res = await fetch('/api/generate-trip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.dailyItinerary && data.dailyItinerary.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Backend /api/generate-trip not reachable, using intelligent client engine:', err);
  }
  // Return client fallback
  return generateClientSideFallbackPlan(request);
}

export async function requestChatReply(
  message: string,
  history: ChatMessage[],
  tripContext?: TripPlan | null
): Promise<{ reply: string; suggestedActions?: string[] }> {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, tripContext }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend /api/chat not reachable, using smart assistant engine:', err);
  }

  // Intelligent fallback responses
  const q = message.toLowerCase();
  let reply = `Here are my top recommendations for your travels:`;
  let suggested = ['Best local restaurants', 'Public transport tips', 'Packing checklist suggestions', 'Emergency contact guide'];

  if (q.includes('pack') || q.includes('weather')) {
    reply = `For your trip, pack versatile layers (breathable shirts, lightweight jacket, and comfortable broken-in walking shoes). Remember a universal adapter, portable power bank (under 100Wh for carry-on), and a refillable water bottle. Keep essential prescription medicines in your carry-on bag!`;
    suggested = ['Is tap water safe to drink?', 'What footwear is best for temples?', 'Local tipping customs'];
  } else if (q.includes('food') || q.includes('restaurant') || q.includes('eat')) {
    reply = `Local food tip: Avoid restaurants directly in front of major tourist plazas with huge picture menus in 6 languages. Instead, walk 2-3 blocks into side alleys where local office workers and families dine. Look for places with handwritten chalkboards and short, focused daily menus!`;
    suggested = ['How to tip in local eateries?', 'Street food hygiene tips', 'Vegetarian options'];
  } else if (q.includes('visa') || q.includes('passport')) {
    reply = `Always ensure your passport has at least 6 months of validity beyond your intended return date, along with at least 2 consecutive blank visa pages. Save digital scans of your passport bio-page and travel insurance on cloud storage for quick emergency access.`;
    suggested = ['Visa-free entry requirements', 'ETIAS / eTA details', 'Travel insurance coverage'];
  } else {
    reply = `I'm happy to help you with "${message}". Voyana AI can optimize your transit routes, adjust your daily budget allocations, or recommend specific morning activities based on local crowd patterns. What would you like to explore next?`;
  }

  return { reply, suggestedActions: suggested };
}

export async function requestTranslation(text: string, targetLang: string = 'Japanese') {
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLang }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  return {
    translation: `Phrase: "${text}"`,
    phonetic: 'Pronounce phonetically with polite posture',
    tip: 'A polite smile and greeting works wonders in any language!'
  };
}

export function queryVisaRequirements(nationality: string, destination: string) {
  const key = `${nationality}-to-${destination}`;
  return VISA_DATABASE[key] || VISA_DATABASE['Default'];
}
