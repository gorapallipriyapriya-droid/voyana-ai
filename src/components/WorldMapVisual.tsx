import React, { useState } from 'react';
import { Plane, MapPin, Sparkles, Compass } from 'lucide-react';

interface CityHub {
  id: string;
  name: string;
  country: string;
  x: number; // SVG coordinate percent
  y: number;
  vibe: string;
  avgBudget: string;
}

const CITY_HUBS: CityHub[] = [
  { id: 'sfo', name: 'San Francisco', country: 'USA', x: 175, y: 175, vibe: 'Golden Gate & Bay Vistas', avgBudget: '$240/day' },
  { id: 'nyc', name: 'New York', country: 'USA', x: 265, y: 170, vibe: 'Skyline Energy & Broadway', avgBudget: '$310/day' },
  { id: 'paris', name: 'Paris', country: 'France', x: 480, y: 155, vibe: 'Art, Cafés & Seine Romance', avgBudget: '$220/day' },
  { id: 'zermatt', name: 'Swiss Alps', country: 'Switzerland', x: 505, y: 165, vibe: 'Matterhorn & Glacier Trains', avgBudget: '$295/day' },
  { id: 'dubai', name: 'Dubai', country: 'UAE', x: 620, y: 220, vibe: 'Futuristic Luxury & Sands', avgBudget: '$240/day' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', x: 830, y: 185, vibe: 'Neon Metropolis & Ancient Shrines', avgBudget: '$165/day' },
  { id: 'bali', name: 'Bali', country: 'Indonesia', x: 790, y: 310, vibe: 'Emerald Terraces & Azure Beaches', avgBudget: '$85/day' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', x: 890, y: 380, vibe: 'Harbour Glitz & Bondi Breakers', avgBudget: '$200/day' },
  { id: 'capetown', name: 'Cape Town', country: 'South Africa', x: 525, y: 370, vibe: 'Table Mountain & Ocean Escapes', avgBudget: '$110/day' },
];

interface WorldMapVisualProps {
  onSelectDestination?: (city: string) => void;
}

export const WorldMapVisual: React.FC<WorldMapVisualProps> = ({ onSelectDestination }) => {
  const [activeCity, setActiveCity] = useState<CityHub | null>(CITY_HUBS[5]); // Default Tokyo

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
      {/* Background Grid & Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar within map */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider">
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>Interactive Flight Route Radar</span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight">
            Global Route Network & Hotspots
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click on any global city to preview itineraries or generate direct travel routes.
          </p>
        </div>

        {activeCity && (
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-3 flex items-center gap-3 backdrop-blur-md">
            <div className="w-9 h-9 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{activeCity.name}</span>
                <span className="text-[10px] text-teal-300 bg-teal-950 border border-teal-800 px-1.5 py-0.5 rounded">
                  {activeCity.avgBudget}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">{activeCity.vibe}</p>
            </div>
            {onSelectDestination && (
              <button
                onClick={() => onSelectDestination(activeCity.name)}
                className="ml-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                Plan Here
              </button>
            )}
          </div>
        )}
      </div>

      {/* World Map SVG Canvas */}
      <div className="relative w-full aspect-[2/1] max-h-[460px] overflow-hidden rounded-xl bg-slate-950/60 border border-slate-800/70">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full object-cover select-none"
        >
          {/* World Continents Rough Geometry */}
          <g fill="#1e293b" fillOpacity="0.8" stroke="#334155" strokeWidth="0.8">
            {/* North America */}
            <path d="M 120,80 Q 200,60 270,90 T 290,160 T 240,210 T 170,230 T 130,170 Z" />
            {/* Central America */}
            <path d="M 200,240 Q 220,270 240,290 T 250,300 Z" />
            {/* South America */}
            <path d="M 270,300 Q 340,320 330,390 T 280,470 T 250,420 T 260,330 Z" />
            {/* Europe */}
            <path d="M 450,110 Q 520,90 540,140 T 490,190 T 440,170 T 430,130 Z" />
            {/* Africa */}
            <path d="M 460,200 Q 540,200 560,270 T 540,380 T 490,400 T 450,310 T 440,230 Z" />
            {/* Asia */}
            <path d="M 550,90 Q 750,70 850,140 T 820,240 T 700,260 T 600,210 T 550,140 Z" />
            {/* Australia */}
            <path d="M 800,340 Q 900,330 920,400 T 840,430 T 780,380 Z" />
          </g>

          {/* Curved Flight Route Lines */}
          <g stroke="rgba(37, 99, 235, 0.45)" strokeWidth="1.5" fill="none" strokeDasharray="4 4">
            {/* SFO to Tokyo */}
            <path d="M 175,175 Q 500,40 830,185" />
            {/* SFO to NYC */}
            <path d="M 175,175 Q 220,150 265,170" />
            {/* NYC to Paris */}
            <path d="M 265,170 Q 370,110 480,155" />
            {/* Paris to Dubai */}
            <path d="M 480,155 Q 550,160 620,220" />
            {/* Dubai to Tokyo */}
            <path d="M 620,220 Q 720,160 830,185" />
            {/* Tokyo to Bali */}
            <path d="M 830,185 Q 830,260 790,310" />
            {/* Bali to Sydney */}
            <path d="M 790,310 Q 840,330 890,380" />
            {/* Paris to Cape Town */}
            <path d="M 480,155 Q 490,280 525,370" />
          </g>

          {/* Animated Flight Pulse on Current Route */}
          <path
            d="M 175,175 Q 500,40 830,185"
            fill="none"
            stroke="#14b8a6"
            strokeWidth="2.5"
            strokeDasharray="12 180"
            className="animate-pulse"
          />

          {/* City Markers & Nodes */}
          {CITY_HUBS.map((city) => {
            const isSelected = activeCity?.id === city.id;
            return (
              <g
                key={city.id}
                onClick={() => setActiveCity(city)}
                className="cursor-pointer group"
              >
                {/* Glow ring on selected or hover */}
                {isSelected && (
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r="14"
                    fill="none"
                    stroke="#14b8a6"
                    strokeWidth="1.5"
                    opacity="0.8"
                    className="animate-ping"
                  />
                )}
                {/* Outer halo */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r={isSelected ? '7' : '5'}
                  fill={isSelected ? '#14b8a6' : '#2563eb'}
                  className="transition-all duration-200 group-hover:scale-125"
                />
                {/* Center dot */}
                <circle
                  cx={city.x}
                  cy={city.y}
                  r="2.5"
                  fill="#ffffff"
                />
                {/* City Name Label */}
                <text
                  x={city.x}
                  y={city.y - 10}
                  textAnchor="middle"
                  fill={isSelected ? '#38bdf8' : '#cbd5e1'}
                  fontSize="9"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                  className="pointer-events-none drop-shadow-md select-none font-sans"
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-3 left-4 flex items-center gap-4 text-[10px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Voyana Hub</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400" />
            <span>Active Flight Arc</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            <span>AI Optimized</span>
          </div>
        </div>
      </div>
    </div>
  );
};
