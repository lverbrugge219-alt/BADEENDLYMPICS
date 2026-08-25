import React, { useState } from 'react';
import {
  Award,
  ChevronDown,
  Filter,
  Medal,
  Play,
  RotateCcw,
  Sparkles,
  Trophy,
  Users,
  Zap
} from 'lucide-react';
import { PageRoute, SportId, Team } from '../types';
import { SPORTS_DATA } from '../data/mockData';
import { RubberDuckGraphic } from '../components/RubberDuckGraphic';
import { playDuckQuack, playVictoryChime } from '../utils/audio';

interface LeaderboardPageProps {
  teams: Team[];
  onNavigate: (route: PageRoute) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ teams, onNavigate }) => {
  const [selectedSportFilter, setSelectedSportFilter] = useState<SportId | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Pro Float' | 'Open Classic' | 'Heavyweight Buoy' | 'Junior Quackers'>('All');

  // Interactive Live Scoring Simulator
  const [bonusPointsAdded, setBonusPointsAdded] = useState<Record<string, number>>({});

  const handleSimulateAwardBonus = (teamId: string) => {
    const currentBonus = bonusPointsAdded[teamId] || 0;
    setBonusPointsAdded({
      ...bonusPointsAdded,
      [teamId]: currentBonus + 5
    });
    playVictoryChime();
  };

  // Filter and sort teams
  const sortedTeams = [...teams]
    .filter((t) => {
      if (categoryFilter !== 'All' && t.category !== categoryFilter) return false;
      if (selectedSportFilter !== 'all' && !t.registeredSports.includes(selectedSportFilter)) return false;
      return true;
    })
    .map((t) => ({
      ...t,
      computedPoints: t.totalPoints + (bonusPointsAdded[t.id] || 0)
    }))
    .sort((a, b) => b.computedPoints - a.computedPoints);

  const topThree = sortedTeams.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* HEADER BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-black text-xs font-black uppercase tracking-widest">
              <Trophy className="h-3.5 w-3.5" />
              Official Championship Standings
            </div>
            <h1 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tight text-slate-950">
              Leaderboard & Live Scores
            </h1>
            <p className="text-slate-500 text-sm sm:text-base max-w-2xl font-medium">
              Real-time medal tallies, qualification point rankings, and fair-play honors for all registered rubber duck flotillas.
            </p>
          </div>

          <button
            onClick={() => {
              onNavigate('signup');
              playDuckQuack(1.1);
            }}
            className="bg-black text-white hover:bg-slate-800 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-black/10 active:scale-95 transition-all"
          >
            Register Team
          </button>
        </div>
      </section>

      {/* TOP 3 PODIUM HERO */}
      {topThree.length >= 3 && (
        <section className="rounded-3xl border border-slate-800 bg-slate-900 text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />

          <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              The Olympic Podium
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-white">
              Leading Flotillas
            </h2>
          </div>

          {/* Podium 3-Column Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            {/* Rank 2 (Silver) */}
            <div className="order-2 md:order-1 rounded-3xl border border-slate-800 bg-white/5 p-6 text-center flex flex-col items-center shadow-md hover:bg-white/10 transition-colors">
              <div className="px-3 py-1 rounded-full bg-slate-700 text-slate-200 font-black text-[10px] uppercase tracking-widest mb-4">
                🥈 2nd Place Silver
              </div>
              <RubberDuckGraphic size={56} color={topThree[1].duckColor} accessory={topThree[1].accessory} />
              <h3 className="text-lg font-black uppercase italic tracking-tight text-white mt-4">{topThree[1].name}</h3>
              <p className="text-xs text-slate-400">{topThree[1].country} • {topThree[1].captain}</p>
              <div className="mt-4 font-mono text-2xl font-black text-amber-400">{topThree[1].computedPoints} PTS</div>
              <div className="flex gap-3 text-xs text-slate-300 mt-3 bg-black/40 px-3 py-1.5 rounded-xl">
                <span>🥇 {topThree[1].gold}</span>
                <span>🥈 {topThree[1].silver}</span>
                <span>🥉 {topThree[1].bronze}</span>
              </div>
            </div>

            {/* Rank 1 (Gold - Taller Card) */}
            <div className="order-1 md:order-2 rounded-3xl border-2 border-amber-400 bg-gradient-to-b from-amber-500/20 to-slate-950 p-8 text-center flex flex-col items-center shadow-2xl relative">
              <div className="absolute -top-3 px-4 py-1 rounded-full bg-amber-400 text-black font-black text-[10px] uppercase tracking-widest shadow-md">
                👑 1ST PLACE GOLD LEADER
              </div>
              <div className="my-2">
                <RubberDuckGraphic size={72} color={topThree[0].duckColor} accessory="crown" animated showWaterRipple />
              </div>
              <h3 className="text-xl font-black uppercase italic tracking-tight text-white mt-2">{topThree[0].name}</h3>
              <p className="text-xs text-amber-300 font-semibold">{topThree[0].country} • Captain {topThree[0].captain}</p>
              <div className="mt-4 font-mono text-4xl font-black text-amber-400">{topThree[0].computedPoints} PTS</div>
              <div className="flex gap-3 text-xs font-bold text-slate-200 mt-3 bg-slate-950/80 px-4 py-1.5 rounded-xl border border-white/5">
                <span className="text-amber-400">🥇 {topThree[0].gold} Gold</span>
                <span className="text-slate-300">🥈 {topThree[0].silver} Silver</span>
                <span className="text-amber-600">🥉 {topThree[0].bronze} Bronze</span>
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="order-3 rounded-3xl border border-slate-800 bg-white/5 p-6 text-center flex flex-col items-center shadow-md hover:bg-white/10 transition-colors">
              <div className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 font-black text-[10px] uppercase tracking-widest mb-4">
                🥉 3rd Place Bronze
              </div>
              <RubberDuckGraphic size={56} color={topThree[2].duckColor} accessory={topThree[2].accessory} />
              <h3 className="text-lg font-black uppercase italic tracking-tight text-white mt-4">{topThree[2].name}</h3>
              <p className="text-xs text-slate-400">{topThree[2].country} • {topThree[2].captain}</p>
              <div className="mt-4 font-mono text-2xl font-black text-amber-400">{topThree[2].computedPoints} PTS</div>
              <div className="flex gap-3 text-xs text-slate-300 mt-3 bg-black/40 px-3 py-1.5 rounded-xl">
                <span>🥇 {topThree[2].gold}</span>
                <span>🥈 {topThree[2].silver}</span>
                <span>🥉 {topThree[2].bronze}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FILTER & SPORT SELECTOR BAR */}
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Discipline Filters */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setSelectedSportFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                selectedSportFilter === 'all'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Overall Table
            </button>
            {SPORTS_DATA.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedSportFilter(s.id);
                  playDuckQuack(1.05);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  selectedSportFilter === s.id
                    ? 'bg-amber-400 text-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {s.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Division Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Division:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as typeof categoryFilter)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white text-slate-800 focus:outline-none"
            >
              <option value="All">All Divisions</option>
              <option value="Pro Float">Pro Float</option>
              <option value="Open Classic">Open Classic</option>
              <option value="Heavyweight Buoy">Heavyweight Buoy</option>
              <option value="Junior Quackers">Junior Quackers</option>
            </select>
          </div>
        </div>
      </div>

      {/* FULL LEADERBOARD TABLE */}
      <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-black tracking-widest">
              <tr>
                <th className="py-4 px-4 sm:px-6">Rank</th>
                <th className="py-4 px-4 sm:px-6">Flotilla / Team</th>
                <th className="py-4 px-4 text-center">Division</th>
                <th className="py-4 px-3 text-center">🥇 Gold</th>
                <th className="py-4 px-3 text-center">🥈 Silver</th>
                <th className="py-4 px-3 text-center">🥉 Bronze</th>
                <th className="py-4 px-4 text-right">Total Points</th>
                <th className="py-4 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {sortedTeams.map((team, idx) => {
                const rank = idx + 1;
                return (
                  <tr
                    key={team.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      team.isUserRegistered ? 'bg-amber-50/70 font-semibold' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-4 px-4 sm:px-6">
                      <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl font-mono font-black text-xs ${
                        rank === 1
                          ? 'bg-amber-400 text-black font-black'
                          : rank === 2
                          ? 'bg-slate-200 text-slate-800'
                          : rank === 3
                          ? 'bg-amber-100 text-amber-900'
                          : 'text-slate-500'
                      }`}>
                        {rank}
                      </span>
                    </td>

                    {/* Team Details */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3.5">
                        <RubberDuckGraphic size={36} color={team.duckColor} accessory={team.accessory} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black uppercase tracking-tight text-slate-950">{team.name}</span>
                            {team.isUserRegistered && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-black rounded-full uppercase tracking-wider">
                                Your Team
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">
                            {team.country} • Captain {team.captain}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Division */}
                    <td className="py-4 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-black uppercase tracking-wider">
                        {team.category}
                      </span>
                    </td>

                    {/* Medals */}
                    <td className="py-4 px-3 text-center font-bold text-amber-500 font-mono text-sm">
                      {team.gold}
                    </td>
                    <td className="py-4 px-3 text-center font-bold text-slate-400 font-mono text-sm">
                      {team.silver}
                    </td>
                    <td className="py-4 px-3 text-center font-bold text-amber-700 font-mono text-sm">
                      {team.bronze}
                    </td>

                    {/* Total Points */}
                    <td className="py-4 px-4 text-right font-mono font-black text-base text-slate-950">
                      {team.computedPoints} PTS
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleSimulateAwardBonus(team.id)}
                          className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-black uppercase tracking-wider transition-all active:scale-95"
                          title="Simulate Fair Play Bonus Point"
                        >
                          +5 Fair Play
                        </button>
                        <button
                          onClick={() => onNavigate('profiles')}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold uppercase tracking-wider"
                        >
                          Profile
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
