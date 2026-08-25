import React from 'react';
import { Award, Compass, Heart, Mail, MapPin, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { PageRoute, SportId } from '../types';
import { RubberDuckGraphic } from './RubberDuckGraphic';
import { playDuckQuack } from '../utils/audio';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Col 1 & 2: Branding & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-amber-400 text-black">
                <RubberDuckGraphic size={32} color="#F59E0B" accessory="crown" />
              </div>
              <div>
                <span className="text-2xl font-black uppercase italic tracking-tight text-white">
                  BADEEND<span className="text-amber-400">LYMPICS</span>
                </span>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Utrecht 2026 • Official Championship
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm font-normal">
              The prestigious global gathering celebrating speed, hydrodynamics, synchrony, and pure buoyant spirit. Governed under the Koninklijke Rubber Duck Federation (KBF) sporting code.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                Anti-Doping & Motor-Free
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-300">
                <Award className="h-3.5 w-3.5 text-sky-400" />
                100% Recycled Vinyl
              </span>
            </div>
          </div>

          {/* Col 3: 5 Sports Navigation */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4">
              The 5 Disciplines
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              {[
                { route: 'sport-rapids-sprint', label: 'Rapids Sprint 50m' },
                { route: 'sport-quack-diving', label: 'Artistic Quack Diving' },
                { route: 'sport-hydro-tug', label: 'Giant Hydro Tug-of-War' },
                { route: 'sport-pond-water-polo', label: 'Pond Water Polo' },
                { route: 'sport-whirlpool-slalom', label: 'Whirlpool Slalom' }
              ].map((item) => (
                <li key={item.route}>
                  <button
                    onClick={() => {
                      onNavigate(item.route as PageRoute);
                      playDuckQuack(1.05);
                    }}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    • {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Championship Portals */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4">
              Championship Hub
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <button
                  onClick={() => onNavigate('schedule')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  3-Day Race Schedule
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('leaderboard')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Live Medal Leaderboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('profiles')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Ducklete Profiles
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('info')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Rules, Specs & FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('signup')}
                  className="text-amber-400 font-bold hover:text-amber-300 transition-colors"
                >
                  Register Team / Flotilla →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Venue & Spectators */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-amber-400 mb-4">
              Spectator Information
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">AquaPark Olympic Flume, Kromme Rijn Complex, Utrecht, The Netherlands</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">Entry:</span> Free public grandstands
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="font-bold text-sky-400 uppercase text-[10px] tracking-wider">Broadcast:</span> DuckSports24 & Live Jumbotron
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 BADEENDLYMPICS Organizing Committee. All rights reserved. Koninklijke Badeend Federatie.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              Crafted for rubber ducks worldwide <Heart className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
