import React, { useState } from 'react';
import { Mail, PhoneCall, MapPin, MessageSquare, ChevronDown, Check, Send, Sparkles } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Travel Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && message.trim()) {
      setSubmitted(true);
    }
  };

  const faqs = [
    {
      q: 'How does Voyana AI synthesize daily itineraries so quickly?',
      a: 'Voyana AI operates on Google Gemini 3.8 Flash, paired with real-time transit schedule telemetry, live hotel inventories, and localized weather APIs to calculate optimal routes, realistic walking buffers, and precise budget estimates in seconds.'
    },
    {
      q: 'Can I export or print my trip itinerary?',
      a: 'Yes! Every generated trip plan features a 1-click Print and PDF export action formatted cleanly for mobile offline reading or physical luggage carry.'
    },
    {
      q: 'Are hotel and transit prices locked in?',
      a: 'Prices reflect real-time market baseline averages. When you simulate booking or proceed to partner providers, rates remain protected within estimated seasonal bands.'
    },
    {
      q: 'Does Voyana AI support multi-city and group trip planning?',
      a: 'Absolutely. You can plan journeys across multiple regional waypoints (e.g. Tokyo + Kyoto + Osaka or Paris + Amalfi Coast) and configure group sizes from solo explorers to 6+ family groups.'
    },
    {
      q: 'What if I need emergency assistance while traveling?',
      a: 'Our dedicated 24/7 global travel concierge hotline is available worldwide at +1 (800) 869-2621 with instant rebooking and multilingual support.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-3">
          <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
          <span>24/7 Global Concierge</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          We're Here for Every Mile of Your Journey
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Have a question about an itinerary, custom group route, or partnership? Connect with our global support team anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">
            Send Us a Message
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            Our concierge agents typically respond in under 15 minutes.
          </p>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-heading text-lg font-bold text-slate-900">
                Message Dispatched Successfully!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you, <strong>{name}</strong>. A Voyana travel concierge has received your request and will reach out to <strong>{email}</strong> promptly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Hayes"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jordan@example.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Topic of Inquiry
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                >
                  <option>General Travel Inquiry</option>
                  <option>Itinerary Customization Help</option>
                  <option>Corporate / Group Booking (10+ people)</option>
                  <option>API & Partnership Integration</option>
                  <option>Emergency Travel Assistance</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can Voyana AI assist with your travel plans?"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message to Concierge</span>
              </button>
            </form>
          )}
        </div>

        {/* Global Hubs & Hotline */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-2xl p-6 text-white shadow-md">
            <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-2">
              <PhoneCall className="w-4 h-4" />
              <span>24/7 Global Travel Hotline</span>
            </div>
            <div className="text-2xl font-extrabold font-heading mt-1">
              +1 (800) 869-2621
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Available around the clock worldwide. Immediate assistance for route delays, transit rebooking, and language translation.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-heading text-sm font-bold text-slate-900 uppercase tracking-wider">
              Voyana Global Hubs
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900">San Francisco, USA (Headquarters)</div>
                <div className="text-slate-500 text-[11px]">500 Howard Street, Suite 400 · CA 94105</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900">London, United Kingdom</div>
                <div className="text-slate-500 text-[11px]">100 Bishopsgate, City of London · EC2N 4AG</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900">Tokyo, Japan</div>
                <div className="text-slate-500 text-[11px]">Roppongi Hills Mori Tower, Minato-ku · 106-6108</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Common questions regarding itinerary creation, data privacy, and route customization.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-heading text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
