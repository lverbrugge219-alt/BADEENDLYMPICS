import React, { useState, useEffect } from 'react';
import { PageRoute, Team } from '../types';
import { getStoredTeams } from '../utils/storage';
import { MarqueeTicker } from '../components/MarqueeTicker';
import { JuryAvatar } from '../components/JuryAvatar';
import { Users, Plus } from 'lucide-react';

interface ParticipantsPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const ParticipantsPage: React.FC<ParticipantsPageProps> = ({ onNavigate }) => {
  const [teams, setTeams] = useState<Team[]>([]);

  const loadTeams = () => {
    setTeams(getStoredTeams());
  };

  useEffect(() => {
    loadTeams();
    window.addEventListener('badeendlympics_data_change', loadTeams);
    return () => {
      window.removeEventListener('badeendlympics_data_change', loadTeams);
    };
  }, []);

  return (
    <div className="bg-white text-black min-h-screen">
      {/* 1. HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 sm:pt-16 sm:pb-12">
        <span className="text-sky-500 font-display font-black text-xs sm:text-sm tracking-widest uppercase block mb-2">
          DE STRIJDERS
        </span>
        <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase tracking-tight leading-none mb-3">
          DEEL<span className="text-stroke-black">NEMERS</span>
        </h1>
        <p className="font-display font-black text-xs sm:text-sm tracking-wider uppercase text-slate-500">
          {teams.length} {teams.length === 1 ? 'TEAM INGESCHREVEN' : 'TEAMS INGESCHREVEN'}
        </p>
      </div>

      {/* 2. TEAMS GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        {teams.length === 0 ? (
          <div className="bg-slate-50 border-2 border-black p-12 text-center max-w-lg mx-auto">
            <Users size={36} className="mx-auto text-slate-400 mb-3" />
            <h3 className="font-display font-black text-2xl uppercase mb-2">
              Nog geen teams ingeschreven
            </h3>
            <p className="text-xs text-slate-600 font-medium mb-6">
              Wees de eerste en schrijf jouw team in voor de BADEENDLYMPICS 2027!
            </p>
            <button
              onClick={() => onNavigate('inschrijven')}
              className="px-6 py-3 bg-amber-400 border-2 border-black font-display font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 cursor-pointer"
            >
              MELD TEAM AAN →
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {teams.map((team) => {
              const firstLetter = team.name.trim().charAt(0) || 'D';
              return (
                <div
                  key={team.id}
                  className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  {/* Top Yellow Header */}
                  <div className="bg-amber-400 border-b-2 border-black p-4 flex items-center gap-3">
                    <JuryAvatar
                      avatarType={team.avatarType || 'preset'}
                      avatarPresetId={team.avatarPresetId || 'duck-gold'}
                      photoUrl={team.photoUrl}
                      size="sm"
                      showBadge={false}
                      className="shrink-0 bg-white"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black truncate">
                        {team.name}
                      </h3>
                      <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-black truncate">
                        AANVOERDER: {team.aanvoerder}
                      </div>
                    </div>
                  </div>

                  {/* Bottom White Member List */}
                  <div className="p-4 bg-white">
                    <div className="text-sky-500 font-display font-black text-[11px] uppercase tracking-widest mb-3">
                      TEAMLEDEN ({team.members.length} DEELNEMERS)
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {team.members.map((member, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-white border-2 border-black text-xs font-bold text-black"
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Quick Add Team Card */}
            <button
              onClick={() => onNavigate('inschrijven')}
              className="border-2 border-dashed border-black p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-amber-50/40 transition-colors group cursor-pointer min-h-[180px]"
            >
              <div className="w-10 h-10 rounded-full border-2 border-black bg-white group-hover:bg-amber-400 flex items-center justify-center mb-2 transition-colors">
                <Plus size={20} className="text-black" />
              </div>
              <span className="font-display font-black text-lg uppercase tracking-tight text-black">
                JOUW TEAM HIER?
              </span>
              <span className="text-xs font-semibold text-slate-500 mt-1">
                Schrijf je team gratis in voor 3 april 2027 →
              </span>
            </button>
          </div>
        )}
      </div>

      {/* 3. RUNNING TICKER */}
      <MarqueeTicker
        text="WIJ KWAKKEN NIET • WIJ WINNEN • BADEENDLYMPICS 2027 • "
        variant="cyan"
      />
    </div>
  );
};
