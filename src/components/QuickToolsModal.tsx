import React, { useState } from 'react';
import { X, Globe2, DollarSign, ShieldCheck, Languages, Navigation, ArrowRight, Check, Sparkles } from 'lucide-react';
import { CURRENCY_RATES, VISA_DATABASE } from '../data/mockData';
import { requestTranslation, queryVisaRequirements } from '../services/api';

interface QuickToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCurrency: string;
}

export const QuickToolsModal: React.FC<QuickToolsModalProps> = ({
  isOpen,
  onClose,
  selectedCurrency
}) => {
  const [activeTool, setActiveTool] = useState<'currency' | 'visa' | 'translator' | 'distance'>('currency');

  // Currency Converter State
  const [currencyAmount, setCurrencyAmount] = useState(100);
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('JPY');

  // Visa Checker State
  const [passportOrigin, setPassportOrigin] = useState('US');
  const [visaDestination, setVisaDestination] = useState('Japan');
  const visaResult = queryVisaRequirements(passportOrigin, visaDestination);

  // Translator State
  const [phraseInput, setPhraseInput] = useState('Where is the train station?');
  const [targetLang, setTargetLang] = useState('Japanese');
  const [translationResult, setTranslationResult] = useState<{ translation: string; phonetic: string; tip: string }>({
    translation: 'Eki wa doko desu ka? (駅はどこですか？)',
    phonetic: 'eh-kee wah doh-koh dess kah',
    tip: 'Bow slightly when asking for street directions.'
  });
  const [translating, setTranslating] = useState(false);

  // Distance & Fuel Calculator State
  const [calcDistanceKm, setCalcDistanceKm] = useState(515); // e.g. Tokyo to Kyoto
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState(1.45);
  const [consumptionLPer100Km, setConsumptionLPer100Km] = useState(6.5);

  if (!isOpen) return null;

  // Convert calculation
  const fromRate = CURRENCY_RATES[fromCurr]?.rate || 1;
  const toRate = CURRENCY_RATES[toCurr]?.rate || 1;
  const convertedCurrencyAmount = ((currencyAmount / fromRate) * toRate).toFixed(2);

  // Fuel calculation
  const fuelLitersNeeded = (calcDistanceKm / 100) * consumptionLPer100Km;
  const totalFuelCostUSD = (fuelLitersNeeded * fuelPricePerLiter).toFixed(2);
  const driveHours = (calcDistanceKm / 90).toFixed(1);
  const trainHours = (calcDistanceKm / 240).toFixed(1);

  const handleTranslate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phraseInput.trim()) return;
    setTranslating(true);
    const res = await requestTranslation(phraseInput.trim(), targetLang);
    setTranslationResult(res);
    setTranslating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Voyana Traveler Toolkit</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            Smart Utility Suite
          </h2>
        </div>

        {/* Tool Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {[
            { id: 'currency', label: 'Currency', icon: DollarSign },
            { id: 'visa', label: 'Visa Check', icon: ShieldCheck },
            { id: 'translator', label: 'Phrasebook', icon: Languages },
            { id: 'distance', label: 'Fuel / Distance', icon: Navigation },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTool === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTool(tab.id as any)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TOOL 1: CURRENCY CONVERTER */}
        {activeTool === 'currency' && (
          <div className="space-y-4">
            <h3 className="font-heading text-base font-bold text-slate-900">
              Live Currency Calculator
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Amount</label>
                <input
                  type="number"
                  min={1}
                  value={currencyAmount}
                  onChange={(e) => setCurrencyAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">From Currency</label>
                <select
                  value={fromCurr}
                  onChange={(e) => setFromCurr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  {Object.keys(CURRENCY_RATES).map((c) => (
                    <option key={c} value={c}>
                      {c} ({CURRENCY_RATES[c].name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">To Currency</label>
                <select
                  value={toCurr}
                  onChange={(e) => setToCurr(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  {Object.keys(CURRENCY_RATES).map((c) => (
                    <option key={c} value={c}>
                      {c} ({CURRENCY_RATES[c].name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-5 rounded-xl border border-blue-200/70 text-center">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Converted Value</span>
              <div className="text-3xl font-extrabold text-blue-700 font-heading mt-1">
                {CURRENCY_RATES[toCurr]?.symbol}{Number(convertedCurrencyAmount).toLocaleString()}{' '}
                <span className="text-sm font-normal text-slate-500">{toCurr}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                1 {fromCurr} = {((1 / fromRate) * toRate).toFixed(4)} {toCurr}
              </p>
            </div>
          </div>
        )}

        {/* TOOL 2: VISA INFORMATION */}
        {activeTool === 'visa' && (
          <div className="space-y-4">
            <h3 className="font-heading text-base font-bold text-slate-900">
              Entry & Visa Requirement Checker
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Passport Nationality</label>
                <select
                  value={passportOrigin}
                  onChange={(e) => setPassportOrigin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="US">United States (US)</option>
                  <option value="UK">United Kingdom (UK)</option>
                  <option value="EU">European Union (EU)</option>
                  <option value="AU">Australia (AU)</option>
                  <option value="CA">Canada (CA)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Destination Country</label>
                <select
                  value={visaDestination}
                  onChange={(e) => setVisaDestination(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="Japan">Japan</option>
                  <option value="France">France (Schengen)</option>
                  <option value="Indonesia">Indonesia (Bali)</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-700 bg-teal-100 px-2 py-0.5 rounded">
                  {visaResult.requirement}
                </span>
                <span className="text-xs text-slate-500">· Allowed Stay: {visaResult.duration}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{visaResult.details}</p>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Required Entry Documents
                </span>
                <div className="space-y-1">
                  {visaResult.documentsNeeded.map((doc, idx) => (
                    <div key={idx} className="text-xs text-slate-600 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-teal-600" />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 3: TRANSLATOR & PHRASEBOOK */}
        {activeTool === 'translator' && (
          <div className="space-y-4">
            <h3 className="font-heading text-base font-bold text-slate-900">
              Local Phrasebook & Translator
            </h3>
            <form onSubmit={handleTranslate} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-600 block mb-1">Phrase to Translate</label>
                  <input
                    type="text"
                    required
                    value={phraseInput}
                    onChange={(e) => setPhraseInput(e.target.value)}
                    placeholder="e.g. Delicious meal, Thank you, Where is the taxi?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Target Language</label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="Japanese">Japanese</option>
                    <option value="French">French</option>
                    <option value="Spanish">Spanish</option>
                    <option value="Italian">Italian</option>
                    <option value="Indonesian">Indonesian</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={translating}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                {translating ? 'Translating...' : 'Translate Phrase'}
              </button>
            </form>

            {/* Translation Output Box */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-xs text-slate-500">Translation ({targetLang}):</div>
              <div className="text-lg font-bold text-slate-900 font-heading">
                {translationResult.translation}
              </div>
              <div className="text-xs text-blue-600 font-mono">
                🗣️ Phonetic: {translationResult.phonetic}
              </div>
              <div className="text-xs text-teal-700 bg-teal-50 p-2 rounded border border-teal-100">
                💡 <strong>Etiquette Tip:</strong> {translationResult.tip}
              </div>
            </div>
          </div>
        )}

        {/* TOOL 4: DISTANCE & FUEL CALCULATOR */}
        {activeTool === 'distance' && (
          <div className="space-y-4">
            <h3 className="font-heading text-base font-bold text-slate-900">
              Route Distance & Fuel Consumption Calculator
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Distance (km)</label>
                <input
                  type="number"
                  min={10}
                  value={calcDistanceKm}
                  onChange={(e) => setCalcDistanceKm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Fuel Price ($/L)</label>
                <input
                  type="number"
                  step="0.05"
                  value={fuelPricePerLiter}
                  onChange={(e) => setFuelPricePerLiter(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Liters / 100 km</label>
                <input
                  type="number"
                  step="0.5"
                  value={consumptionLPer100Km}
                  onChange={(e) => setConsumptionLPer100Km(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Fuel Needed</span>
                <div className="text-xl font-bold text-slate-900 font-heading mt-1">
                  {fuelLitersNeeded.toFixed(1)} Liters
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Est. Fuel Cost</span>
                <div className="text-xl font-bold text-teal-600 font-heading mt-1">
                  ${totalFuelCostUSD} USD
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">High-Speed Rail vs Car</span>
                <div className="text-xs font-bold text-blue-600 font-heading mt-1">
                  Bullet Train: {trainHours}h vs Car: {driveHours}h
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
