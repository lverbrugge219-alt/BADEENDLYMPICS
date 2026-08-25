import React, { useState, useEffect } from 'react';
import { PageRoute, Team, ScoreEntry } from '../types';
import { getStoredTeams, getStoredScores, recalculateTeamTotals } from '../utils/storage';
import { Trophy, ShieldCheck, ArrowRight } from 'lucide-react';

interface LeaderboardPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ onNavigate }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  const loadData = () => {
    const loadedTeams = getStoredTeams();
    const loadedScores = getStoredScores();
    const updated = recalculateTeamTotals(loadedTeams, loadedScores);
    // Sort descending by total score
    updated.sort((a, b) => (b.totaal || 0) - (a.totaal || 0));
    setTeams(updated);
    setScores(loadedScores);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('badeendlympics_data_change', loadData);
    return () => {
      window.removeEventListener('badeendlympics_data_change', loadData);
    };
  }, []);

  const topTeam = teams.length > 0 ? teams[0] : null;

  return (
    <div className="bg-white text-black min-h-screen">
      {/* 1. DARK LEADERBOARD HEADER */}
      <section className="bg-black text-white border-b-2 border-black py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="text-sky-400 font-display font-black text-xs sm:text-sm tracking-widest uppercase block mb-2">
            LIVE STAND
          </span>
          <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-amber-400 tracking-tight uppercase leading-none mb-4">
            LEADERBOARD
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xl">
            Alle punten van alle spelen, bijgehouden door de organisatie. De cijfers liegen nooit.
          </p>
        </div>
      </section>

      {/* 2. LEADERBOARD CONTENT & TABLE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Top Leader Highlight Card */}
        {topTeam && (
          <div className="mb-10 max-w-xs sm:max-w-sm bg-amber-400 border-2 border-black p-5 sm:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-start justify-between">
              <span className="font-display font-black text-5xl sm:text-6xl text-black leading-none">
                1
              </span>
              <Trophy size={32} className="text-black" />
            </div>
            <div className="mt-4">
              <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black">
                {topTeam.name}
              </h3>
              <div className="font-display font-black text-3xl sm:text-4xl text-black mt-1">
                {topTeam.totaal || 0}{' '}
                <span className="text-sm font-bold tracking-normal font-sans">ptn</span>
              </div>
            </div>
          </div>
        )}

        {/* Scores Table */}
        <div className="border-2 border-black overflow-x-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-black text-white text-[11px] sm:text-xs font-display font-black uppercase tracking-wider border-b-2 border-black">
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4">TEAM</th>
                <th className="py-3.5 px-4 text-center">GEHEIM SPEL 1</th>
                <th className="py-3.5 px-4 text-center">GEHEIM SPEL 2</th>
                <th className="py-3.5 px-4 text-center">GEHEIM SPEL 3</th>
                <th className="py-3.5 px-4 text-center">GEHEIM SPEL 4</th>
                <th className="py-3.5 px-4 text-center">GEHEIM SPEL 5</th>
                <th className="py-3.5 px-4 text-center font-black">TOTAAL</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-black text-xs sm:text-sm font-bold">
              {teams.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    Nog geen teams of scores ingevoerd.
                  </td>
                </tr>
              ) : (
                teams.map((team, index) => (
                  <tr key={team.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 text-center font-display font-black text-base">
                      {index + 1}
                    </td>
                    <td className="py-4 px-4 font-display font-black text-base uppercase text-black">
                      {team.name}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-slate-700">
                      {team.scores?.['geheim-01'] ?? '—'}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-slate-700">
                      {team.scores?.['geheim-02'] ?? '—'}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-slate-700">
                      {team.scores?.['geheim-03'] ?? '—'}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-slate-700">
                      {team.scores?.['geheim-04'] ?? '—'}
                    </td>
                    <td className="py-4 px-4 text-center font-semibold text-slate-700">
                      {team.scores?.['geheim-05'] ?? '—'}
                    </td>
                    <td className="py-4 px-4 text-center font-display font-black text-lg text-amber-500">
                      {team.totaal || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Organisatie Action Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border-2 border-black">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <ShieldCheck size={16} className="text-amber-500" />
            Scores worden realtime bijgewerkt door de jury van Scouting Van Brederode.
          </div>
          <button
            onClick={() => onNavigate('scorebeheer')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-black text-white font-display font-black text-xs uppercase tracking-wider hover:bg-slate-800 cursor-pointer"
          >
            SCOREBEHEER (ORGANISATIE) <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
