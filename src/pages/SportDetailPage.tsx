import React from 'react';
import { PageRoute, SpelId } from '../types';
import { SPELEN } from '../data/mockData';
import { ArrowLeft, Trophy } from 'lucide-react';

interface SportDetailPageProps {
  spelId: SpelId;
  onNavigate: (page: PageRoute) => void;
}

export const SportDetailPage: React.FC<SportDetailPageProps> = ({ spelId, onNavigate }) => {
  const spel = SPELEN.find((s) => s.id === spelId) || SPELEN[0];

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-black font-display uppercase tracking-widest text-slate-500 hover:text-black transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft size={16} /> ALLE SPELEN
        </button>

        {/* Hero Split for Spel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 sm:mb-20">
          {/* Left Column: Number, Title, Tagline, Description */}
          <div className="lg:col-span-6">
            <div className="font-display font-black text-7xl sm:text-8xl md:text-9xl text-amber-400 text-stroke-black leading-none mb-2 select-none">
              {spel.number}
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-black leading-none mb-3">
              {spel.name}
            </h1>

            <div className="text-sky-500 font-display font-black text-xs sm:text-sm tracking-widest uppercase mb-6">
              {spel.tagline}
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium max-w-xl">
              {spel.description}
            </p>
          </div>

          {/* Right Column: Image or Mystery Icon in Black Border */}
          <div className="lg:col-span-6">
            <div className="bg-slate-100 border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] aspect-[4/3] flex items-center justify-center">
              {spel.imageUrl ? (
                <img
                  src={spel.imageUrl}
                  alt={spel.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="bg-black w-full h-full flex flex-col items-center justify-center p-8 text-center text-white">
                  <div className="font-display font-black text-8xl text-amber-400 leading-none mb-4">
                    ?
                  </div>
                  <span className="font-display font-black text-xl tracking-widest uppercase text-slate-300">
                    STRIKT GEHEIM TOT 3 APRIL 2027
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spelregels Section */}
        <div className="pt-8 border-t-2 border-slate-100">
          <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black mb-8">
            SPELREGELS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {spel.rules.map((rule, idx) => (
              <div
                key={idx}
                className="bg-white border-2 border-black p-4 sm:p-5 flex items-center gap-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="w-8 h-8 bg-amber-400 border-2 border-black font-display font-black text-sm flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                  {rule}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 bg-slate-50 border-2 border-black p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-display font-black text-xl uppercase tracking-tight block">
              DURF JIJ DIT SPEL AAN?
            </span>
            <span className="text-xs text-slate-600 font-medium">
              Schrijf jouw team in voor de BADEENDLYMPICS 2027 in Papendrecht.
            </span>
          </div>
          <button
            onClick={() => onNavigate('inschrijven')}
            className="px-6 py-3 bg-amber-400 border-2 border-black font-display font-black text-sm uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 cursor-pointer"
          >
            TEAM INSCHRIJVEN →
          </button>
        </div>
      </div>
    </div>
  );
};
