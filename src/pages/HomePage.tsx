import React from 'react';
import { PageRoute } from '../types';
import { SPELEN } from '../data/mockData';
import { MarqueeTicker } from '../components/MarqueeTicker';
import { BADEEND_LOGO_SRC } from '../assets/logo';
import { ArrowUpRight } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white text-black min-h-screen">
      {/* 1. HERO SECTION (SPLIT LAYOUT) */}
      <section className="border-b-2 border-black">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px]">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
            <div className="text-sky-500 font-display font-black text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4">
              HET SPORTEVENEMENT VAN PAPENDRECHT – 3 APRIL 2027
            </div>

            <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.88] tracking-tighter uppercase mb-6 sm:mb-8">
              <span className="block text-black">BADEEND</span>
              <span className="block text-stroke-black">LYMPICS</span>
              <span className="block text-stroke-yellow text-amber-400 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
                2027
              </span>
            </h1>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 items-center pt-2">
              <button
                onClick={() => onNavigate('inschrijven')}
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-amber-400 border-2 border-black font-display font-black text-base sm:text-lg uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
              >
                SCHRIJF JE TEAM IN →
              </button>
              <button
                onClick={() => onNavigate('info')}
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white border-2 border-black font-display font-black text-base sm:text-lg uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
              >
                PRAKTISCHE INFO
              </button>
            </div>
          </div>

          {/* Right Hero Yellow Block with Duck Mascot Card */}
          <div className="lg:col-span-5 bg-amber-400 border-t-2 lg:border-t-0 lg:border-l-2 border-black p-8 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="relative">
              {/* Photo Frame */}
              <div className="bg-white border-2 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-xs sm:max-w-sm">
                <div className="w-56 h-56 sm:w-64 sm:h-64 bg-white flex items-center justify-center overflow-hidden border border-slate-200 p-2">
                  <img
                    src={BADEEND_LOGO_SRC}
                    alt="Officiële Badeendlympics Mascotte Logo"
                    className="w-full h-full object-contain object-center transition-transform duration-300 hover:scale-105"
                  />
                </div>
                {/* Badge attached to bottom of frame */}
                <div className="mt-3 text-center">
                  <span className="inline-block bg-sky-400 text-black border-2 border-black font-display font-black text-xs sm:text-sm uppercase tracking-wider px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    OFFICIEEL LOGO & MASCOTTE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. RUNNING MARQUEE TICKER */}
      <MarqueeTicker text="BADEENDLYMPICS 2027 • 3 APRIL • PAPENDRECHT • GLORIE WACHT • " variant="yellow" />

      {/* 3. "KIES JE SLAGVELD" (THE 5 SPELEN) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-sky-500 font-display font-black text-xs sm:text-sm tracking-widest uppercase block mb-2">
              DE VIJF SPELEN
            </span>
            <h2 className="font-display font-black text-5xl sm:text-6xl md:text-7xl uppercase leading-none tracking-tight">
              KIES JE <span className="text-stroke-black">SLAGVELD</span>
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-sm font-medium">
            Drie bekende disciplines, twee mysteries. Alle vijf tellen mee voor het eindklassement.
          </p>
        </div>

        {/* 5 Spelen Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Spel 01 - Large Card */}
          <div
            onClick={() => onNavigate('spel-biertafel-opzetten')}
            className="md:col-span-7 bg-white border-2 border-black p-4 sm:p-6 group cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between"
          >
            <div className="w-full h-56 sm:h-72 bg-slate-100 border-2 border-black overflow-hidden mb-5">
              <img
                src={SPELEN[0].imageUrl}
                alt="Biertafel opzetten"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-sky-500 font-display font-black text-xs tracking-widest uppercase block mb-1">
                  SPEL 01
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black">
                  {SPELEN[0].name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                  {SPELEN[0].subtitle}
                </p>
              </div>
              <div className="w-10 h-10 bg-amber-400 border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-amber-300 transition-all">
                <ArrowUpRight size={20} className="text-black" />
              </div>
            </div>
          </div>

          {/* Spel 02 & 03 - Right Column */}
          <div className="md:col-span-5 flex flex-col gap-6">
            {/* Spel 02 */}
            <div
              onClick={() => onNavigate('spel-dienblad-parcours')}
              className="bg-white border-2 border-black p-4 group cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between flex-1"
            >
              <div className="w-full h-36 sm:h-40 bg-slate-100 border-2 border-black overflow-hidden mb-3">
                <img
                  src={SPELEN[1].imageUrl}
                  alt="Dienblad parcours"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-sky-500 font-display font-black text-[11px] tracking-widest uppercase block mb-0.5">
                    SPEL 02
                  </span>
                  <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black">
                    {SPELEN[1].name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">{SPELEN[1].subtitle}</p>
                </div>
                <div className="w-8 h-8 bg-amber-400 border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-amber-300">
                  <ArrowUpRight size={16} className="text-black" />
                </div>
              </div>
            </div>

            {/* Spel 03 */}
            <div
              onClick={() => onNavigate('spel-kratbier-hindernisbaan')}
              className="bg-white border-2 border-black p-4 group cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between flex-1"
            >
              <div className="w-full h-36 sm:h-40 bg-slate-100 border-2 border-black overflow-hidden mb-3">
                <img
                  src={SPELEN[2].imageUrl}
                  alt="Kratbier hindernisbaan"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-sky-500 font-display font-black text-[11px] tracking-widest uppercase block mb-0.5">
                    SPEL 03
                  </span>
                  <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black">
                    {SPELEN[2].name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">{SPELEN[2].subtitle}</p>
                </div>
                <div className="w-8 h-8 bg-amber-400 border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-amber-300">
                  <ArrowUpRight size={16} className="text-black" />
                </div>
              </div>
            </div>
          </div>

          {/* Spel 04 - Mystery Black Card */}
          <div
            onClick={() => onNavigate('spel-geheim-01')}
            className="md:col-span-6 bg-black border-2 border-black text-white p-6 sm:p-8 group cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] transition-all flex flex-col justify-between min-h-[220px]"
          >
            <div className="flex items-start justify-between">
              <span className="text-slate-400 font-display font-black text-xs tracking-widest uppercase">
                SPEL 04
              </span>
              <div className="text-slate-400 group-hover:text-amber-400 transition-colors">
                <ArrowUpRight size={20} />
              </div>
            </div>
            <div className="my-4">
              <div className="font-display font-black text-6xl text-amber-400 leading-none mb-2">
                ?
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
                NOG GEHEIM #01
              </h3>
            </div>
          </div>

          {/* Spel 05 - Mystery Black Card */}
          <div
            onClick={() => onNavigate('spel-geheim-02')}
            className="md:col-span-6 bg-black border-2 border-black text-white p-6 sm:p-8 group cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] transition-all flex flex-col justify-between min-h-[220px]"
          >
            <div className="flex items-start justify-between">
              <span className="text-slate-400 font-display font-black text-xs tracking-widest uppercase">
                SPEL 05
              </span>
              <div className="text-slate-400 group-hover:text-amber-400 transition-colors">
                <ArrowUpRight size={20} />
              </div>
            </div>
            <div className="my-4">
              <div className="font-display font-black text-6xl text-amber-400 leading-none mb-2">
                ?
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white">
                NOG GEHEIM #02
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "JOUW TEAM. ONS PARCOURS." YELLOW BANNER */}
      <section className="bg-amber-400 border-y-2 border-black py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tight leading-[0.88] mb-10">
            <span className="block text-black">JOUW TEAM.</span>
            <span className="block text-stroke-black">ONS PARCOURS.</span>
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('inschrijven')}
              className="px-8 sm:px-10 py-4 bg-black text-white border-2 border-black font-display font-black text-base sm:text-lg uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-900 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
            >
              INSCHRIJVEN VOOR 3 APRIL →
            </button>
            <button
              onClick={() => onNavigate('deelnemers')}
              className="px-8 sm:px-10 py-4 bg-white text-black border-2 border-black font-display font-black text-base sm:text-lg uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
            >
              BEKIJK DEELNEMERS
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
