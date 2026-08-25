import React, { useState } from 'react';
import {
  Award,
  ChevronRight,
  Filter,
  Medal,
  Quote,
  Search,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Zap
} from 'lucide-react';
import { DuckleteProfile, PageRoute, SportId, Team } from '../types';
import { SPORTS_DATA } from '../data/mockData';
import { RubberDuckGraphic } from '../components/RubberDuckGraphic';
import { playDuckQuack } from '../utils/audio';

interface ProfilesPageProps {
  teams: Team[];
  duckletes: DuckleteProfile[];
  onNavigate: (route: PageRoute) => void;
}

export const ProfilesPage: React.FC<ProfilesPageProps> = ({
  teams,
  duckletes,
  onNavigate
}) => {
  const [viewMode, setViewMode] = useState<'duckletes' | 'teams'>('duckletes');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<SportId | 'all'>('all');
  const [activeProfileModal, setActiveProfileModal] = useState<DuckleteProfile | null>(null);
  const [activeTeamModal, setActiveTeamModal] = useState<Team | null>(null);

  const filteredDuckletes = duckletes.filter((d) => {
    if (selectedSport !== 'all' && d.specialty !== selectedSport) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = d.name.toLowerCase().includes(q);
      const matchNick = d.nickname.toLowerCase().includes(q);
      const matchTeam = d.teamName.toLowerCase().includes(q);
      const matchCountry = d.country.toLowerCase().includes(q);
      if (!matchName && !matchNick && !matchTeam && !matchCountry) return false;
    }
    return true;
  });

  const filteredTeams = teams.filter((t) => {
    if (selectedSport !== 'all' && !t.registeredSports.includes(selectedSport)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchCap = t.captain.toLowerCase().includes(q);
      const matchMascot = t.mascotName.toLowerCase().includes(q);
      const matchCountry = t.country.toLowerCase().includes(q);
      if (!matchName && !matchCap && !matchMascot && !matchCountry) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* HEADER BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-black uppercase tracking-widest">
              <Users className="h-3.5 w-3.5" />
              Competitors & Flotillas Roster
            </div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tight text-slate-950">
              Participant Profiles
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-2xl font-medium">
              Discover the legendary rubber ducks, world-record holding athletes, and competing national teams of BADEENDLYMPICS 2026.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setViewMode('duckletes')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                viewMode === 'duckletes'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Star Duckletes ({duckletes.length})
            </button>
            <button
              onClick={() => setViewMode('teams')}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                viewMode === 'teams'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Flotillas ({teams.length})
            </button>
          </div>
        </div>
      </section>

      {/* SEARCH & FILTER BAR */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ducklete, mascot, or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">Specialty:</span>
          <button
            onClick={() => setSelectedSport('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              selectedSport === 'all'
                ? 'bg-black text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {SPORTS_DATA.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedSport(s.id);
                playDuckQuack(1.05);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                selectedSport === s.id
                  ? 'bg-amber-400 text-black font-black'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {s.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* DUCKLETE PROFILES VIEW */}
      {viewMode === 'duckletes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDuckletes.map((ducklete) => (
            <div
              key={ducklete.id}
              onClick={() => {
                setActiveProfileModal(ducklete);
                playDuckQuack(1.1);
              }}
              className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-xl hover:border-amber-400 transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                {/* Header with duck avatar */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200 group-hover:scale-105 transition-transform">
                      <RubberDuckGraphic
                        size={56}
                        color={ducklete.avatarColor}
                        accessory={ducklete.avatarAccessory}
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">
                        {ducklete.nickname}
                      </span>
                      <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-950 group-hover:text-amber-600 transition-colors">
                        {ducklete.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-semibold">{ducklete.teamName} ({ducklete.country})</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-100 font-black text-[10px] uppercase tracking-wider">
                    {ducklete.specialty.split('-')[0]}
                  </span>
                </div>

                {/* Quote snippet */}
                <p className="italic text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100 my-3.5 leading-relaxed font-normal">
                  "{ducklete.quote}"
                </p>

                {/* Stats meters */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Speed Index</span>
                    <span className="font-mono font-black text-slate-900">{ducklete.stats.speed}/100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${ducklete.stats.speed}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">Buoyancy & Stability</span>
                    <span className="font-mono font-black text-slate-900">{ducklete.stats.buoyancy}/100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-400 rounded-full" style={{ width: `${ducklete.stats.buoyancy}%` }} />
                  </div>
                </div>
              </div>

              {/* Signature move link */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium truncate">
                  ⚡ {ducklete.signatureMove}
                </span>
                <span className="font-black uppercase tracking-wider text-black group-hover:text-amber-600 flex items-center gap-0.5 shrink-0">
                  Full Bio <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TEAMS PROFILES VIEW */}
      {viewMode === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              onClick={() => {
                setActiveTeamModal(team);
                playDuckQuack(1.1);
              }}
              className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-xl hover:border-amber-400 transition-all space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-200">
                      <RubberDuckGraphic
                        size={56}
                        color={team.duckColor}
                        accessory={team.accessory}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-950 group-hover:text-amber-600 transition-colors">
                          {team.name}
                        </h3>
                        {team.isUserRegistered && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded-full uppercase tracking-wider">
                            Registered
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-semibold">{team.country} • Mascot {team.mascotName}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-black text-[10px] uppercase tracking-wider">
                    {team.category}
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3.5 leading-relaxed line-clamp-2 font-normal">
                  {team.bio}
                </p>

                <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-3 rounded-2xl my-3.5 text-xs border border-slate-100">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Gold</span>
                    <span className="font-black text-amber-500 font-mono text-sm">🥇 {team.gold}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Silver</span>
                    <span className="font-black text-slate-400 font-mono text-sm">🥈 {team.silver}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Points</span>
                    <span className="font-black text-slate-900 font-mono text-sm">{team.totalPoints}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  {team.members.length} Registered Crew Members
                </span>
                <span className="font-black uppercase tracking-wider text-black group-hover:text-amber-600 flex items-center gap-0.5">
                  Roster <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DUCKLETE BIO MODAL */}
      {activeProfileModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setActiveProfileModal(null)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                  <RubberDuckGraphic
                    size={72}
                    color={activeProfileModal.avatarColor}
                    accessory={activeProfileModal.avatarAccessory}
                    animated
                  />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-amber-700">
                    {activeProfileModal.nickname}
                  </span>
                  <h3 className="text-2xl font-black uppercase italic tracking-tight text-slate-950">
                    {activeProfileModal.name}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold">
                    {activeProfileModal.teamName} • {activeProfileModal.country}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveProfileModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Quote */}
            <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl text-xs sm:text-sm text-slate-700 italic flex gap-2.5 items-start">
              <Quote className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{activeProfileModal.quote}</span>
            </div>

            {/* Spec grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">Duck Weight</span>
                <span className="font-black text-slate-900">{activeProfileModal.weightGrams}g</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">Water Service</span>
                <span className="font-black text-slate-900">{activeProfileModal.ageInFloatingDays} days</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 sm:col-span-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 block">Hull Model</span>
                <span className="font-black text-slate-900 truncate block">{activeProfileModal.duckModel}</span>
              </div>
            </div>

            {/* Career Achievements */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-900 block flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                Career Achievements & Medals
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {activeProfileModal.achievements.map((ach, i) => (
                  <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-amber-500 font-bold">★</span>
                    <span className="font-medium">{ach}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Specialty: {activeProfileModal.specialty}
              </span>
              <button
                onClick={() => setActiveProfileModal(null)}
                className="px-5 py-2.5 rounded-xl bg-black text-white font-bold uppercase tracking-wider text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEAM ROSTER MODAL */}
      {activeTeamModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setActiveTeamModal(null)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                  <RubberDuckGraphic
                    size={64}
                    color={activeTeamModal.duckColor}
                    accessory={activeTeamModal.accessory}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black uppercase italic tracking-tight text-slate-950">
                      {activeTeamModal.name}
                    </h3>
                    <span className="text-xs font-black uppercase tracking-wider bg-amber-400 text-black px-2.5 py-0.5 rounded-full">
                      {activeTeamModal.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold">
                    {activeTeamModal.country} • Mascot: {activeTeamModal.mascotName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTeamModal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-normal">
              {activeTeamModal.bio}
            </p>

            {/* Crew members list */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-slate-900 block flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-sky-600" />
                Registered Duckletes & Crew ({activeTeamModal.members.length})
              </span>
              <div className="space-y-1.5">
                {activeTeamModal.members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-white text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-lg">
                        #{m.duckNumber}
                      </span>
                      <span className="font-bold text-slate-900">{m.name}</span>
                    </div>
                    <span className="text-slate-400 font-medium">{m.role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                onClick={() => setActiveTeamModal(null)}
                className="px-5 py-2.5 rounded-xl bg-black text-white font-bold uppercase tracking-wider text-xs"
              >
                Close Roster
              </button>
              <button
                onClick={() => {
                  setActiveTeamModal(null);
                  onNavigate('leaderboard');
                }}
                className="text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-amber-600"
              >
                View Standings →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
