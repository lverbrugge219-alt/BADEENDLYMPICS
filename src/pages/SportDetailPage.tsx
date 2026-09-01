import React from 'react';
import { PageRoute, SpelId } from '../types';
import { SPELEN } from '../data/mockData';
import { ArrowLeft, Sparkles, Gamepad2 } from 'lucide-react';
import { WhackADuckGame } from '../components/WhackADuckGame';

interface SportDetailPageProps {
  spelId: SpelId;
  onNavigate: (page: PageRoute) => void;
}

export const SportDetailPage: React.FC<SportDetailPageProps> = ({ spelId, onNavigate }) => {
  const spel = SPELEN.find((s) => s.id === spelId) || SPELEN[0];
  const isSpel1 = spel.id === 'geheim-01' || spel.number === '01';

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 sm:mb-16">
          {/* Left Column: Number, Title, Tagline, Description */}
          <div className="lg:col-span-6">
            <div className="font-display font-black text-7xl sm:text-8xl md:text-9xl text-amber-400 text-stroke-black leading-none mb-2 select-none">
              {spel.number}
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-black leading-none mb-3">
              {spel.name}
            </h1>

            <div className="text-sky-500 font-display font-black text-xs sm:text-sm tracking-widest uppercase mb-6 flex items-center gap-2">
              <span>{spel.tagline}</span>
              {isSpel1 && (
                <span className="px-2 py-0.5 bg-amber-400 text-black border border-black text-[10px] font-black uppercase">
                  Teaser Beschikbaar
                </span>
              )}
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium max-w-xl mb-6">
              {spel.description}
            </p>

            {isSpel1 && (
              <a
                href="#teaser-game"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 transition-colors"
              >
                <Gamepad2 size={16} /> SPEEL DE TRAININGS-TEASER HIERONDER ↓
              </a>
            )}
          </div>

          {/* Right Column: Image, Whack-A-Duck Teaser Hook, or Mystery Icon */}
          <div className="lg:col-span-6">
            <div className="bg-slate-100 border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] aspect-[4/3] flex items-center justify-center relative">
              {spel.imageUrl ? (
                <img
                  src={spel.imageUrl}
                  alt={spel.name}
                  className="w-full h-full object-cover"
                />
              ) : isSpel1 ? (
                <div className="bg-sky-950 w-full h-full flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white border-2 border-black p-1.5 mb-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden">
                      <img
                        src="/hammer-duck.png"
                        alt="Badeendjes Meppen Teaser"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="font-display font-black text-xs sm:text-sm tracking-widest uppercase text-amber-400 mb-1 flex items-center gap-1.5">
                      <Sparkles size={14} /> EXCLUSIEVE DISCIPLINE #01 TEASER
                    </span>
                    <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-white mb-2">
                      BADEENDJES MEPPEN
                    </h3>
                    <p className="text-xs text-sky-200 font-medium max-w-xs mb-4">
                      Test je reflexen en reactievermogen in deze trainingsminigame voor het eerste geheime spel!
                    </p>
                    <a
                      href="#teaser-game"
                      className="px-4 py-2 bg-amber-400 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 transition-all active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
                    >
                      DIRECT SPELEN ↓
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-black w-full h-full flex flex-col items-center justify-center p-8 text-center text-white">
                  <div className="font-display font-black text-8xl text-amber-400 leading-none mb-4">
                    ?
                  </div>
                  <span className="font-display font-black text-lg sm:text-xl tracking-widest uppercase text-slate-300">
                    DISCIPLINE WORDT BINNENKORT BEKENDGEMAAKT
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spel 1 Interactive Whack-a-Duck Teaser Section */}
        {isSpel1 && (
          <div id="teaser-game" className="mb-16 pt-4 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400 border-2 border-black text-xs font-display font-black uppercase tracking-wider text-black mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Gamepad2 size={14} /> INTERACTIEVE TEASER GAME
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black leading-none">
                  SPEL 1 TRAINING: BADEENDJES TIKKEN
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md">
                Een voorproefje op de snelheid en behendigheid die gevraagd wordt tijdens Spel 1 van de Badeendlympics 2027.
              </p>
            </div>

            <WhackADuckGame />
          </div>
        )}

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

