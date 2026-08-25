import React, { useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Compass,
  FileText,
  HelpCircle,
  MapPin,
  Scale,
  ShieldCheck,
  Sparkles,
  Zap
} from 'lucide-react';
import { FAQItem, PageRoute } from '../types';
import { FAQ_DATA } from '../data/mockData';
import { RubberDuckGraphic } from '../components/RubberDuckGraphic';
import { playDuckQuack } from '../utils/audio';

interface InfoPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const InfoPage: React.FC<InfoPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Rules' | 'Venue' | 'Registration' | 'Spectators'>('All');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');

  const filteredFaqs = selectedCategory === 'All'
    ? FAQ_DATA
    : FAQ_DATA.filter((f) => f.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* HEADER BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-black uppercase tracking-widest">
              <BookOpen className="h-3.5 w-3.5" />
              Championship Guide & Handbook
            </div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tight text-slate-950">
              About the BADEENDLYMPICS
            </h1>
            <p className="text-slate-500 text-base max-w-2xl font-medium">
              Everything you need to know about the official rules, duck weight regulations, venue layout, and spectator amenities for the 2026 World Games.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => {
                onNavigate('signup');
                playDuckQuack(1.1);
              }}
              className="bg-black text-white hover:bg-slate-800 px-6 py-3.5 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-black/10 active:scale-95 transition-all"
            >
              Register Your Flotilla
            </button>
            <button
              onClick={() => onNavigate('schedule')}
              className="px-6 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold uppercase tracking-wider text-xs hover:bg-slate-50 transition-colors"
            >
              View Full Schedule
            </button>
          </div>
        </div>
      </section>

      {/* ORIGIN STORY & CHARTER */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-sky-800 bg-sky-50 border border-sky-100 px-3 py-1 rounded-full">
            <Sparkles className="h-3.5 w-3.5 text-sky-600" />
            The Yellow Fleet Legacy
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-slate-950">
            From Bath Time Pastime to High-Octane Sport
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            In 1992, during a turbulent canal regatta in Utrecht, a single escaped rubber duck out-floated three Olympic rowing sculls down the Kromme Rijn. That legendary moment ignited a revolution.
          </p>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
            Today, the <strong>BADEENDLYMPICS</strong> represents the pinnacle of hydrodynamic hobbyist engineering. Teams from over 24 nations fine-tune keel center-of-gravity, beak wave-breakers, and vinyl elasticity under strict fair-play charters.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl border border-slate-200 bg-white">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Certified Clean</span>
              <span className="text-slate-950 font-black uppercase italic text-sm">No Lithium Motors</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 bg-white">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Acoustic Standards</span>
              <span className="text-slate-950 font-black uppercase italic text-sm">75–92 dB Squeak</span>
            </div>
            <div className="p-4 rounded-2xl border border-slate-200 bg-white col-span-2 sm:col-span-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Recycled Vinyl</span>
              <span className="text-slate-950 font-black uppercase italic text-sm">100% Eco Fleet</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-50 rounded-3xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center shadow-xs relative overflow-hidden">
          <RubberDuckGraphic size={120} color="#F59E0B" accessory="crown" showWaterRipple animated />
          <div className="mt-4 bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs font-black text-slate-950 uppercase tracking-wider">
              Official Mascot: Willem de Eend
            </span>
            <p className="text-[11px] text-slate-400 font-semibold">Keeper of the Eternal Olympic Flame</p>
          </div>
        </div>
      </section>

      {/* OFFICIAL TECHNICAL REGULATIONS & RULES */}
      <section className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-2">
            <Scale className="h-3.5 w-3.5 text-amber-600" />
            Official Technical Regulations (KBF 2026 Code)
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-slate-950">
            Duck Specifications & Scrutineering
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            All competing ducks must undergo Laser Bounding Inspection and Keel Weigh-in 60 minutes prior to race heats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Spec Card 1 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                <Scale className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="font-black uppercase italic tracking-tight text-slate-950 text-lg">Weight Classes</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed"><strong>Sprint / Polo Class:</strong> 80g to 100g max weight.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed"><strong>Slalom Pro Class:</strong> 85g ± 3g fin-balanced keel.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed"><strong>Heavyweight Tug Class:</strong> 120g to 140g maximum ballast.</span>
              </li>
            </ul>
          </div>

          {/* Spec Card 2 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-800 border border-sky-100 font-bold">
                <FileText className="h-5 w-5 text-sky-600" />
              </div>
              <h3 className="font-black uppercase italic tracking-tight text-slate-950 text-lg">Dimension Bounding</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed"><strong>Hull Length:</strong> Maximum 95mm from beak to tail.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed"><strong>Beam Width:</strong> Maximum 85mm wing to wing.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed"><strong>Draft Height:</strong> Maximum 90mm from base keel to crown.</span>
              </li>
            </ul>
          </div>

          {/* Spec Card 3 */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-100 font-bold">
                <AlertCircle className="h-5 w-5 text-rose-600" />
              </div>
              <h3 className="font-black uppercase italic tracking-tight text-slate-950 text-lg">Prohibited Mods</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-black">✕</span>
                <span className="leading-relaxed">Concealed motorized propellers or battery packs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-black">✕</span>
                <span className="leading-relaxed">Chemical effervescent thrust tabs (e.g. Alka-Seltzer).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-600 font-black">✕</span>
                <span className="leading-relaxed">Electromagnetic guidance tracking wires.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* INTERACTIVE VENUE MAP */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-sky-800 bg-sky-50 border border-sky-100 px-3 py-1 rounded-full mb-2">
              <MapPin className="h-3.5 w-3.5 text-sky-600" />
              Venue Arena Map
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-slate-950">
              AquaPark Olympic Basin, Utrecht
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              State-of-the-art multi-zone aquatic arena engineered with variable hydraulic pumps and precision laser timing gates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Free Shuttles from Utrecht Centraal</span>
          </div>
        </div>

        {/* Visual Map Grid Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 space-y-3 hover:border-amber-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-black bg-amber-400 px-2.5 py-0.5 rounded-full">ZONE A</span>
              <span className="text-lg">⚡</span>
            </div>
            <h4 className="font-black uppercase italic tracking-tight text-slate-950 text-base">Rapids Flume Stadium</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">50m downhill flume with 4.2 m/s hydraulic current and photo-finish lasers.</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 space-y-3 hover:border-sky-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-sky-900 bg-sky-200 px-2.5 py-0.5 rounded-full">ZONE B</span>
              <span className="text-lg">🌊</span>
            </div>
            <h4 className="font-black uppercase italic tracking-tight text-slate-950 text-base">Royal Dive Pavilion</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">5m & 10m platform towers with acoustic squeak decibel sensors and zero-splash cameras.</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 space-y-3 hover:border-cyan-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-cyan-900 bg-cyan-200 px-2.5 py-0.5 rounded-full">ZONE C</span>
              <span className="text-lg">🌀</span>
            </div>
            <h4 className="font-black uppercase italic tracking-tight text-slate-950 text-base">Whirlpool Slalom Basin</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">4 cyclonic vortex generators with 12 optical buoy gates and spray curtains.</p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 space-y-3 hover:border-amber-400 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full">ZONE D</span>
              <span className="text-lg">⚓</span>
            </div>
            <h4 className="font-black uppercase italic tracking-tight text-slate-950 text-base">Hydro-Power Coliseum</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">Dual opposing variable water jets (600 L/min) for 4-duck heavyweight tether battles.</p>
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-2">
              <HelpCircle className="h-3.5 w-3.5 text-amber-600" />
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-slate-950">
              Got Questions? We’ve Got Answers.
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
            {(['All', 'Rules', 'Venue', 'Registration', 'Spectators'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-black text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = expandedFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => {
                    setExpandedFaq(isOpen ? null : faq.id);
                    playDuckQuack(1.1);
                  }}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left font-black uppercase italic tracking-tight text-slate-900 hover:text-amber-600 transition-colors"
                >
                  <span className="text-base sm:text-lg flex items-center gap-3">
                    <span className="text-amber-600 font-mono text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-amber-50 rounded-lg border border-amber-200 not-italic">
                      {faq.category}
                    </span>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-amber-600' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4 font-normal">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
