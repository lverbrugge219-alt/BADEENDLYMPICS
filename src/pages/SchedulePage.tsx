import React from 'react';
import { PageRoute } from '../types';
import { SCHEDULE_ITEMS } from '../data/mockData';
import { Clock, MapPin, Trophy } from 'lucide-react';

interface SchedulePageProps {
  onNavigate: (page: PageRoute) => void;
}

export const SchedulePage: React.FC<SchedulePageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-white text-black min-h-screen">
      {/* Header */}
      <section className="bg-black text-white border-b-2 border-black py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="text-sky-400 font-display font-black text-xs sm:text-sm tracking-widest uppercase block mb-2">
            DAGSCHEMA
          </span>
          <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-amber-400 tracking-tight uppercase leading-none mb-4">
            ZATERDAG <span className="text-stroke-white">3 APRIL 2027</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xl">
            Locatie: Scouting Van Brederode, Papendrecht. Zorg dat je team minimaal 30 minuten voor aanvang aanwezig is bij de registratiebalie.
          </p>
        </div>
      </section>

      {/* Schedule Items Timeline */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-6">
          {SCHEDULE_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className={`border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${
                item.highlight
                  ? 'bg-amber-400 text-black'
                  : 'bg-white text-black hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 border-2 border-black font-display font-black text-xs flex items-center justify-center ${
                      item.highlight ? 'bg-black text-white' : 'bg-amber-400 text-black'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="font-display font-black text-lg sm:text-xl tracking-tight uppercase">
                    {item.title}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider font-display">
                  <Clock size={14} />
                  <span>{item.time}</span>
                </div>
              </div>

              <p
                className={`text-xs sm:text-sm font-medium leading-relaxed mb-3 ${
                  item.highlight ? 'text-black' : 'text-slate-700'
                }`}
              >
                {item.description}
              </p>

              {item.location && (
                <div
                  className={`flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider ${
                    item.highlight ? 'text-black/80' : 'text-sky-600'
                  }`}
                >
                  <MapPin size={12} />
                  <span>{item.location}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Box */}
        <div className="mt-12 bg-black text-white border-2 border-black p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[6px_6px_0px_0px_rgba(250,204,21,1)]">
          <div>
            <div className="font-display font-black text-2xl uppercase tracking-tight text-amber-400">
              KLAAR VOOR DE STRIJD?
            </div>
            <div className="text-xs text-slate-300 font-medium mt-1">
              Schrijf jouw team van 4 personen gratis in voor de BADEENDLYMPICS 2027.
            </div>
          </div>
          <button
            onClick={() => onNavigate('inschrijven')}
            className="px-6 py-3.5 bg-amber-400 text-black border-2 border-black font-display font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 cursor-pointer shrink-0"
          >
            MELD TEAM AAN →
          </button>
        </div>
      </div>
    </div>
  );
};
