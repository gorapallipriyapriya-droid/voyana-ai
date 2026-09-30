# Voyana AI — Plan Smart. Travel Better.

**Voyana AI** is a next-generation AI-powered travel planning web application. It synthesizes complete multi-modal travel routes, verified boutique hotel recommendations, transportation schedules, day-by-day itineraries, and localized budget estimates in seconds.

---

## 🚀 Features

- **AI Trip Planner**: Generates full day-by-day itineraries with Morning, Afternoon, Evening, and Night timeline activities, duration, estimated costs, and insider travel tips.
- **Dynamic Route Architecture**: Multi-waypoint route maps with distance in kilometers, estimated travel times, alternate scenic corridors, and fuel cost calculation.
- **Curated Boutique & Luxury Hotels**: Verified hotel catalog with high-resolution imagery, guest review ratings, amenities, distances to city centers, and instant simulated booking with confirmation codes.
- **Multi-Modal Transit Hub**: Real-time flight schedules, high-speed bullet trains, cross-country express coaches, and rental vehicles.
- **Interactive Budget Planner**: Dynamic sliders and charts modeling accommodation, transport, food, activities, shopping, and emergency reserve funds with live multi-currency conversion (USD, EUR, GBP, JPY, AUD, CAD, INR, SGD, CHF, AED).
- **Weather & 7-Day Forecast**: Current temperature, humidity, wind speed, precipitation probability, and extended 7-day outlook.
- **Interactive Packing Checklist**: Climate-tailored luggage checklists with category sorting, completion tracking, and custom item creation.
- **Voyana AI Concierge**: Real-time travel assistant drawer grounded with Gemini 3.8 Flash for instant advice on dining, transit, tipping, and weather.
- **Traveler Command Dashboard**: Saved trip management, past travel history, and an interactive in-trip expense tracker.
- **Quick Travel Utilities**: Live multi-currency converter, international visa requirement lookup, and local language phrasebook with phonetic guides.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Full-Stack Server**: Express + Node.js (via `tsx server.ts`)
- **AI Engine**: Google Gemini API (`@google/genai` with `gemini-3.8-flash`)
- **Styling**: Tailwind CSS v4 + Plus Jakarta Sans & Outfit Typography
- **Icons**: Lucide React
- **Celebration Effects**: Canvas Confetti
- **Deployment**: Vercel-ready with `vercel.json` and static SPA rewrites

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start the full-stack development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview the production build
npm run preview
```

---

## 🌐 Vercel Deployment

This project includes a pre-configured `vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "vite build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Vercel will detect `outputDirectory: "dist"` and deploy the application with zero configuration errors.
