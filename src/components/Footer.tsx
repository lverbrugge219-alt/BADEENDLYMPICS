import React from 'react';
import { PageRoute } from '../types';
import { BADEEND_LOGO_SRC } from '../assets/logo';

interface FooterProps {
  onNavigate: (page: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-black text-slate-400 border-t-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Branding & Summary */}
          <div className="md:col-span-6 space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="text-left cursor-pointer group focus:outline-none flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-white border-2 border-white flex items-center justify-center p-0.5 shadow-[2px_2px_0px_0px_rgba(250,204,21,1)] overflow-hidden">
                <img
                  src={BADEEND_LOGO_SRC}
                  alt="Badeendlympics Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-display font-black text-2xl sm:text-3xl tracking-tight text-white uppercase">
                BADEEND<span className="text-amber-400">LYMPICS</span> 2027
              </span>
            </button>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed font-medium">
              3 april 2027 · Scouting Van Brederode, Papendrecht. Vijf spelen. Eén winnaar. Eeuwige roem.
            </p>
          </div>

          {/* Col 2: Spelen */}
          <div className="md:col-span-3">
            <h4 className="font-display text-xs font-black uppercase tracking-widest text-slate-300 mb-4">
              SPELEN
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <button
                  onClick={() => onNavigate('spel-biertafel-opzetten')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Biertafel Opzetten
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('spel-dienblad-parcours')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Dienblad Parcours
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('spel-kratbier-hindernisbaan')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Kratbier Hindernisbaan
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('spel-geheim-01')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Nog Geheim #01
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('spel-geheim-02')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Nog Geheim #02
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Event */}
          <div className="md:col-span-3">
            <h4 className="font-display text-xs font-black uppercase tracking-widest text-slate-300 mb-4">
              EVENT
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <button
                  onClick={() => onNavigate('info')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Praktische info
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('schema')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Dagschema
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('scores')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Leaderboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('deelnemers')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-left"
                >
                  Deelnemers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('scorebeheer')}
                  className="text-slate-500 hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Organisatie-login
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          <div>© 2027 BADEENDLYMPICS</div>
          <div className="text-slate-400 font-black">QUACK HARD. WIN HARDER.</div>
        </div>
      </div>
    </footer>
  );
};
