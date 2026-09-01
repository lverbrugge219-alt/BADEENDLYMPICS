import React, { useState, useEffect } from 'react';
import { PageRoute, JuryMember } from '../types';
import { SPELEN } from '../data/mockData';
import { MarqueeTicker } from '../components/MarqueeTicker';
import { CountdownTimer } from '../components/CountdownTimer';
import { JuryAvatar } from '../components/JuryAvatar';
import { getStoredJuryMembers } from '../utils/storage';
import { ArrowUpRight, Award, Shield, UserPlus, Eye, Quote } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [juryMembers, setJuryMembers] = useState<JuryMember[]>([]);

  useEffect(() => {
    setJuryMembers(getStoredJuryMembers());
    const handleUpdate = () => setJuryMembers(getStoredJuryMembers());
    window.addEventListener('badeendlympics_data_change', handleUpdate);
    return () => window.removeEventListener('badeendlympics_data_change', handleUpdate);
  }, []);
  return (
    <div className="bg-white text-black min-h-screen">
      {/* 1. HERO SECTION (SPLIT LAYOUT) */}
      <section className="border-b-2 border-black">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px]">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-16 flex flex-col justify-center">
            <div className="text-sky-500 font-display font-black text-xs sm:text-sm tracking-widest uppercase mb-3 sm:mb-4">
              HET GROTE BADEEND BIER EN SPORT SPEKTAKEL – 3 APRIL 2027
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

          {/* Right Hero Yellow Block with Countdown Timer */}
          <div className="lg:col-span-5 bg-amber-400 border-t-2 lg:border-t-0 lg:border-l-2 border-black p-6 sm:p-10 lg:p-12 flex flex-col items-center justify-center relative overflow-hidden">
            <CountdownTimer onExploreClick={() => onNavigate('schema')} />
          </div>
        </div>
      </section>

      {/* 2. RUNNING MARQUEE TICKER */}
      <MarqueeTicker text="BADEENDLYMPICS 2027 • 3 APRIL • PAPENDRECHT • GLORIE WACHT • " variant="yellow" />

      {/* 3. "DE VIJF GEHEIME SPELEN" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-amber-400 border border-black text-[11px] font-black uppercase tracking-widest text-black mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span>OFFICIËLE DISCIPLINES</span>
            </div>
            <h2 className="font-display font-black text-5xl sm:text-6xl md:text-7xl uppercase leading-none tracking-tight text-black">
              5 DISCIPLINES <span className="text-stroke-black">BINNENKORT BEKEND</span>
            </h2>
          </div>
          <p className="text-sm sm:text-base text-slate-700 max-w-md font-medium">
            De disciplines worden de komende tijd bekendgemaakt door de organisatie. Ieder teamlid moet 18+ zijn. Trek jullie meest epische teamkleding aan en bereid je voor op eeuwige roem!
          </p>
        </div>

        {/* 5 Secret Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Spel 01 */}
          <div
            onClick={() => onNavigate('spel-geheim-01')}
            className="bg-black text-white border-2 border-black p-6 sm:p-7 group cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] transition-all flex flex-col justify-between min-h-[260px] relative overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-black px-2 py-0.5 font-display font-black text-xs tracking-widest uppercase border border-black">
                  SPEL 01
                </span>
                <span className="bg-sky-400 text-black px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider border border-black">
                  🎮 TEASER
                </span>
              </div>
              <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center text-slate-400 group-hover:text-black group-hover:bg-amber-400 group-hover:border-black transition-all">
                <ArrowUpRight size={18} />
              </div>
            </div>
            <div className="my-6">
              <div className="font-display font-black text-6xl text-amber-400 leading-none mb-2">
                ?
              </div>
              <h3 className="font-display font-black text-2xl uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors">
                NOG GEHEIM #01
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Eerste discipline • Inclusief interactieve mini-game training!
              </p>
            </div>
            <div className="text-[11px] font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5 font-display">
              <span>SPEEL DE TEASER</span> →
            </div>
          </div>

          {/* Spel 02 */}
          <div
            onClick={() => onNavigate('spel-geheim-02')}
            className="bg-black text-white border-2 border-black p-6 sm:p-7 group cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] transition-all flex flex-col justify-between min-h-[260px]"
          >
            <div className="flex items-start justify-between">
              <span className="bg-amber-400 text-black px-2 py-0.5 font-display font-black text-xs tracking-widest uppercase border border-black">
                SPEL 02
              </span>
              <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center text-slate-400 group-hover:text-black group-hover:bg-amber-400 group-hover:border-black transition-all">
                <ArrowUpRight size={18} />
              </div>
            </div>
            <div className="my-6">
              <div className="font-display font-black text-6xl text-amber-400 leading-none mb-2">
                ?
              </div>
              <h3 className="font-display font-black text-2xl uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors">
                NOG GEHEIM #02
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Tweede discipline • Wordt de komende tijd bekendgemaakt
              </p>
            </div>
            <div className="text-[11px] font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5 font-display">
              <span>BEKIJK DETAILS</span> →
            </div>
          </div>

          {/* Spel 03 */}
          <div
            onClick={() => onNavigate('spel-geheim-03')}
            className="bg-black text-white border-2 border-black p-6 sm:p-7 group cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] transition-all flex flex-col justify-between min-h-[260px] md:col-span-2 lg:col-span-1"
          >
            <div className="flex items-start justify-between">
              <span className="bg-amber-400 text-black px-2 py-0.5 font-display font-black text-xs tracking-widest uppercase border border-black">
                SPEL 03
              </span>
              <div className="w-8 h-8 bg-zinc-800 border border-zinc-700 flex items-center justify-center text-slate-400 group-hover:text-black group-hover:bg-amber-400 group-hover:border-black transition-all">
                <ArrowUpRight size={18} />
              </div>
            </div>
            <div className="my-6">
              <div className="font-display font-black text-6xl text-amber-400 leading-none mb-2">
                ?
              </div>
              <h3 className="font-display font-black text-2xl uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors">
                NOG GEHEIM #03
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">
                Derde discipline • Wordt de komende tijd bekendgemaakt
              </p>
            </div>
            <div className="text-[11px] font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5 font-display">
              <span>BEKIJK DETAILS</span> →
            </div>
          </div>
        </div>

        {/* Row 2: Spel 04 & 05 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Spel 04 */}
          <div
            onClick={() => onNavigate('spel-geheim-04')}
            className="bg-black text-white border-2 border-black p-6 sm:p-8 group cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] transition-all flex flex-col justify-between min-h-[260px]"
          >
            <div className="flex items-start justify-between">
              <span className="bg-amber-400 text-black px-2.5 py-0.5 font-display font-black text-xs tracking-widest uppercase border border-black">
                SPEL 04
              </span>
              <div className="w-9 h-9 bg-zinc-800 border border-zinc-700 flex items-center justify-center text-slate-400 group-hover:text-black group-hover:bg-amber-400 group-hover:border-black transition-all">
                <ArrowUpRight size={20} />
              </div>
            </div>
            <div className="my-6">
              <div className="font-display font-black text-6xl sm:text-7xl text-amber-400 leading-none mb-2">
                ?
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors">
                NOG GEHEIM #04
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                Vierde discipline • Wordt de komende tijd bekendgemaakt
              </p>
            </div>
            <div className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5 font-display">
              <span>BEKIJK DETAILS</span> →
            </div>
          </div>

          {/* Spel 05 */}
          <div
            onClick={() => onNavigate('spel-geheim-05')}
            className="bg-black text-white border-2 border-black p-6 sm:p-8 group cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(250,204,21,1)] transition-all flex flex-col justify-between min-h-[260px]"
          >
            <div className="flex items-start justify-between">
              <span className="bg-amber-400 text-black px-2.5 py-0.5 font-display font-black text-xs tracking-widest uppercase border border-black">
                SPEL 05
              </span>
              <div className="w-9 h-9 bg-zinc-800 border border-zinc-700 flex items-center justify-center text-slate-400 group-hover:text-black group-hover:bg-amber-400 group-hover:border-black transition-all">
                <ArrowUpRight size={20} />
              </div>
            </div>
            <div className="my-6">
              <div className="font-display font-black text-6xl sm:text-7xl text-amber-400 leading-none mb-2">
                ?
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-white group-hover:text-amber-400 transition-colors">
                NOG GEHEIM #05
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
                Vijfde discipline • Wordt de komende tijd bekendgemaakt
              </p>
            </div>
            <div className="text-xs font-black uppercase tracking-wider text-sky-400 flex items-center gap-1.5 font-display">
              <span>BEKIJK DETAILS</span> →
            </div>
          </div>
        </div>

        {/* Teamkleding Motivation Box */}
        <div className="mt-8 bg-slate-50 border-2 border-black p-6 sm:p-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-amber-500 font-display font-black text-xs uppercase tracking-widest block">
              DRESSCODE & TEAMSPIRIT
            </span>
            <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black">
              TEAMKLEDING WORDT AANGEMOEDIGD!
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-2xl leading-relaxed">
              Zorg dat jouw team van 4 opvalt! Matchende shirts, gele outfits, badeend-accessoires of complete themakostuums: hoe origineler, hoe meer respect van de jury en het publiek!
            </p>
          </div>
          <button
            onClick={() => onNavigate('inschrijven')}
            className="px-6 py-3.5 bg-black text-white border-2 border-black font-display font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(250,204,21,1)] hover:bg-slate-900 shrink-0 cursor-pointer"
          >
            SCHRIJF TEAM IN →
          </button>
        </div>
      </section>

      {/* 4. SPOTLIGHT: VRIJWILLIGE JURY */}
      <section className="bg-slate-900 text-white border-t-2 border-black py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 border border-black text-[11px] font-black uppercase tracking-widest text-black mb-3 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                <Award size={14} />
                <span>OFFICIËLE JURYCOMMISSIE</span>
              </div>
              <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-white leading-none">
                ONTMOET ONZE <span className="text-amber-400">VRIJWILLIGE JURY</span>
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('jury')}
                className="bg-amber-400 text-black px-5 py-3 font-display font-black text-xs uppercase tracking-wider border-2 border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:bg-amber-300 transition-all cursor-pointer flex items-center gap-2"
              >
                <UserPlus size={16} />
                <span>MELD JE AAN ALS JURYLID</span>
              </button>
              <button
                onClick={() => onNavigate('jury')}
                className="bg-black text-white px-5 py-3 font-display font-black text-xs uppercase tracking-wider border-2 border-slate-700 hover:border-white transition-all cursor-pointer flex items-center gap-2"
              >
                <Eye size={16} />
                <span>BEKIJK ALLE JURYLEDEN ({juryMembers.length})</span>
              </button>
            </div>
          </div>

          {/* Cards preview reel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {juryMembers.slice(0, 3).map((member) => (
              <div
                key={member.id}
                onClick={() => onNavigate('jury')}
                className="bg-black border-2 border-slate-700 hover:border-amber-400 p-6 shadow-[4px_4px_0px_0px_rgba(250,204,21,1)] transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <JuryAvatar
                      avatarType={member.avatarType}
                      avatarPresetId={member.avatarPresetId}
                      photoUrl={member.photoUrl}
                      size="md"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="inline-block bg-amber-400 text-black font-display font-black text-[9px] px-1.5 py-0.5 uppercase mb-1">
                        JURY
                      </span>
                      <h4 className="font-display font-black text-base sm:text-lg uppercase text-white group-hover:text-amber-400 transition-colors truncate">
                        {member.name}
                      </h4>
                      <p className="text-xs font-bold text-amber-500 uppercase">
                        {member.roleTitle}
                      </p>
                    </div>
                  </div>

                  {member.bioQuote && (
                    <div className="relative pl-5 pr-2 py-2 bg-zinc-900 border-l-2 border-amber-400 text-xs italic text-slate-300">
                      <Quote size={12} className="absolute left-1 top-2 text-amber-400 not-italic opacity-80" />
                      "{member.bioQuote}"
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>{member.scoutingAffiliation || 'Scouting'}</span>
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Profiel bekijken →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. "JOUW TEAM. ONS PARCOURS." YELLOW BANNER */}
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
