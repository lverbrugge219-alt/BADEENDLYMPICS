import React, { useState, useEffect } from 'react';
import { PageRoute, SpelId, Team, ScoreEntry } from '../types';
import { SPELEN } from '../data/mockData';
import {
  getStoredTeams,
  getStoredScores,
  saveOrUpdateScore,
  deleteScore,
  deleteTeam,
  recalculateTeamTotals,
} from '../utils/storage';
import { Trash2, CheckCircle2, LogOut, Trophy, Users, Award } from 'lucide-react';

interface AdminPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  // Form states
  const [selectedTeamName, setSelectedTeamName] = useState('');
  const [selectedSpelId, setSelectedSpelId] = useState<SpelId>('biertafel-opzetten');
  const [pointsInput, setPointsInput] = useState<number | ''>('');

  // Toast message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const refreshData = () => {
    const t = getStoredTeams();
    const s = getStoredScores();
    setTeams(t);
    setScores(s);
    if (!selectedTeamName && t.length > 0) {
      setSelectedTeamName(t[0].name);
    }
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('badeendlympics_data_change', refreshData);
    return () => {
      window.removeEventListener('badeendlympics_data_change', refreshData);
    };
  }, []);

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeamName.trim()) {
      alert('Kies of vul een teamnaam in.');
      return;
    }
    if (pointsInput === '' || isNaN(Number(pointsInput))) {
      alert('Vul een geldig aantal punten in.');
      return;
    }

    saveOrUpdateScore(selectedTeamName.trim(), selectedSpelId, Number(pointsInput));
    setPointsInput('');
    showToast('Score opgeslagen');
  };

  const handleDeleteScore = (scoreId: string) => {
    if (window.confirm('Weet je zeker dat je deze score wilt verwijderen?')) {
      deleteScore(scoreId);
      showToast('Score verwijderd');
    }
  };

  const handleDeleteTeam = (teamId: string, teamName: string) => {
    if (window.confirm(`Weet je zeker dat je team "${teamName}" wilt verwijderen?`)) {
      deleteTeam(teamId);
      showToast('Team verwijderd');
    }
  };

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header with Logout */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b-2 border-slate-100">
          <div>
            <span className="text-sky-500 font-display font-black text-xs sm:text-sm tracking-widest uppercase block mb-1">
              ORGANISATIE
            </span>
            <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl uppercase tracking-tight leading-none text-black">
              SCOREBEHEER
            </h1>
          </div>

          <button
            onClick={() => onNavigate('scores')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-slate-50 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] self-start sm:self-auto"
          >
            <LogOut size={14} /> UITLOGGEN
          </button>
        </div>

        {/* Main Grid: Form Left, Lists Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: SCORE TOEVOEGEN / AANPASSEN Form */}
          <div className="lg:col-span-6">
            <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-2 mb-6">
                <Trophy size={20} className="text-amber-500" />
                <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black">
                  SCORE TOEVOEGEN / AANPASSEN
                </h2>
              </div>

              <form onSubmit={handleSaveScore} className="space-y-6">
                {/* Team Input */}
                <div>
                  <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-2">
                    TEAM
                  </label>
                  <input
                    type="text"
                    list="registered-teams-list"
                    value={selectedTeamName}
                    onChange={(e) => setSelectedTeamName(e.target.value)}
                    placeholder="bijv. DE TESTEENDEN"
                    required
                    className="w-full px-4 py-3 bg-white border-2 border-black text-sm font-bold text-black focus:outline-none focus:bg-amber-50/50"
                  />
                  <datalist id="registered-teams-list">
                    {teams.map((t) => (
                      <option key={t.id} value={t.name} />
                    ))}
                  </datalist>
                </div>

                {/* Spel & Punten row */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                  <div className="sm:col-span-8">
                    <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-2">
                      SPEL
                    </label>
                    <select
                      value={selectedSpelId}
                      onChange={(e) => setSelectedSpelId(e.target.value as SpelId)}
                      className="w-full px-4 py-3 bg-white border-2 border-black text-xs sm:text-sm font-bold text-black focus:outline-none cursor-pointer"
                    >
                      {SPELEN.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-2">
                      PUNTEN
                    </label>
                    <input
                      type="number"
                      value={pointsInput}
                      onChange={(e) => setPointsInput(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="bijv. 42"
                      required
                      min={0}
                      max={999}
                      className="w-full px-4 py-3 bg-white border-2 border-black text-sm font-black text-black focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-amber-400 border-2 border-black font-display font-black text-base uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                >
                  OPSLAAN
                </button>

                <p className="text-xs text-slate-500 font-medium">
                  Een bestaande score voor hetzelfde team + spel wordt overschreven.
                </p>
              </form>
            </div>
          </div>

          {/* Right Column: Ingediende scores & Ingeschreven teams */}
          <div className="lg:col-span-6 space-y-6">
            {/* INGEVOERDE SCORES */}
            <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black mb-4 flex items-center justify-between">
                <span>INGEVOERDE SCORES ({scores.length})</span>
                <Award size={18} className="text-slate-400" />
              </h3>

              {scores.length === 0 ? (
                <p className="text-xs text-slate-500 font-medium py-4">Nog geen scores ingevoerd.</p>
              ) : (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {scores.map((score) => (
                    <div
                      key={score.id}
                      className="border-2 border-black p-3 flex items-center justify-between bg-slate-50 hover:bg-white transition-colors"
                    >
                      <div>
                        <div className="font-display font-black text-sm uppercase text-black">
                          {score.teamName}
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          {score.spelName} · <span className="font-black text-black">{score.points} punten</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteScore(score.id)}
                        className="p-1.5 border border-slate-300 hover:border-black hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Score verwijderen"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* INGESCHREVEN TEAMS */}
            <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black mb-4 flex items-center justify-between">
                <span>INGESCHREVEN TEAMS ({teams.length})</span>
                <Users size={18} className="text-slate-400" />
              </h3>

              {teams.length === 0 ? (
                <p className="text-xs text-slate-500 font-medium py-4">Nog geen teams ingeschreven.</p>
              ) : (
                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {teams.map((team) => (
                    <div
                      key={team.id}
                      className="border-2 border-black p-3 flex items-center justify-between bg-slate-50 hover:bg-white transition-colors"
                    >
                      <div>
                        <div className="font-display font-black text-sm uppercase text-black">
                          {team.name}
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          {team.aanvoerder} · {team.email}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTeam(team.id, team.name)}
                        className="p-1.5 border border-slate-300 hover:border-black hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Team verwijderen"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast at Bottom Right */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border-2 border-black px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2.5 text-xs font-black uppercase tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={18} className="text-black fill-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
