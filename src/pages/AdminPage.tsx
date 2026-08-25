import React, { useState, useEffect } from 'react';
import { PageRoute, SpelId, Team, ScoreEntry } from '../types';
import { SPELEN, ADMIN_CREDENTIALS } from '../data/mockData';
import {
  getStoredTeams,
  getStoredScores,
  saveOrUpdateScore,
  deleteScore,
  deleteTeam,
  getAdminSession,
  setAdminSession,
} from '../utils/storage';
import {
  Trash2,
  CheckCircle2,
  LogOut,
  Trophy,
  Users,
  Award,
  ShieldAlert,
  AlertCircle,
  X,
  Lock,
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  // Form states
  const [selectedTeamName, setSelectedTeamName] = useState('');
  const [selectedSpelId, setSelectedSpelId] = useState<SpelId>('geheim-01');
  const [pointsInput, setPointsInput] = useState<number | ''>('');

  // Inline delete confirmation states (avoids iframe-blocked window.confirm)
  const [teamToDelete, setTeamToDelete] = useState<{ id: string; name: string } | null>(null);
  const [scoreToDelete, setScoreToDelete] = useState<{ id: string; description: string } | null>(null);

  // Status & toast
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const refreshData = () => {
    const authStatus = getAdminSession();
    setIsAdmin(authStatus);
    const t = getStoredTeams();
    const s = getStoredScores();
    setTeams(t);
    setScores(s);
    if (t.length > 0 && !selectedTeamName) {
      setSelectedTeamName(t[0].name);
    }
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('badeendlympics_data_change', refreshData);
    window.addEventListener('badeendlympics_auth_change', refreshData);
    return () => {
      window.removeEventListener('badeendlympics_data_change', refreshData);
      window.removeEventListener('badeendlympics_auth_change', refreshData);
    };
  }, []);

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedTeamName.trim()) {
      setErrorMessage('Kies of vul een teamnaam in.');
      return;
    }
    if (pointsInput === '' || isNaN(Number(pointsInput))) {
      setErrorMessage('Vul een geldig aantal punten in.');
      return;
    }

    saveOrUpdateScore(selectedTeamName.trim(), selectedSpelId, Number(pointsInput));
    setPointsInput('');
    showToast('Score succesvol opgeslagen');
  };

  const handleConfirmDeleteScore = () => {
    if (!scoreToDelete) return;
    deleteScore(scoreToDelete.id);
    setScoreToDelete(null);
    showToast('Score verwijderd');
  };

  const handleConfirmDeleteTeam = () => {
    if (!teamToDelete) return;
    deleteTeam(teamToDelete.id);
    if (selectedTeamName.trim().toLowerCase() === teamToDelete.name.trim().toLowerCase()) {
      setSelectedTeamName('');
    }
    setTeamToDelete(null);
    showToast(`Team ${teamToDelete.name} verwijderd`);
  };

  const handleLogout = () => {
    setAdminSession(false);
    onNavigate('scores');
  };

  // If not logged in as Admin, show login barrier
  if (!isAdmin) {
    return (
      <div className="bg-white text-black min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
          <div className="w-12 h-12 bg-black text-amber-400 border-2 border-black flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={24} />
          </div>
          <span className="text-sky-500 font-display font-black text-xs tracking-widest uppercase block mb-1">
            BEVEILIGD SCOREBEHEER
          </span>
          <h2 className="font-display font-black text-3xl uppercase tracking-tight mb-3">
            ORGANISATIE LOGIN VEREIST
          </h2>
          <p className="text-xs text-slate-600 font-semibold mb-6 leading-relaxed">
            Het scorebeheer is alleen toegankelijk voor de wedstrijdleiding van Scouting Van Brederode. Log in met het organisatie-account.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="w-full py-4 bg-black text-amber-400 border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-slate-900 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            NAAR ORGANISATIE INLOGGEN →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header with Logout */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b-2 border-slate-100">
          <div>
            <span className="text-sky-500 font-display font-black text-xs sm:text-sm tracking-widest uppercase block mb-1">
              ORGANISATIE · {ADMIN_CREDENTIALS.email}
            </span>
            <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl uppercase tracking-tight leading-none text-black">
              SCOREBEHEER
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('scores')}
              className="px-4 py-2.5 bg-white border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-slate-50 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              LIVE LEADERBOARD
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-slate-900 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <LogOut size={14} /> UITLOGGEN
            </button>
          </div>
        </div>

        {/* Delete Team Modal/Banner */}
        {teamToDelete && (
          <div className="mb-8 p-5 bg-rose-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-500 text-white border-2 border-black flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h4 className="font-display font-black text-base uppercase text-black">
                  TEAM VERWIJDEREN: {teamToDelete.name}?
                </h4>
                <p className="text-xs text-rose-700 font-semibold">
                  Alle bijbehorende scores en de teaminschrijving worden direct definitief gewist.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={handleConfirmDeleteTeam}
                className="px-4 py-2 bg-rose-600 text-white border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-rose-700 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                JA, VERWIJDER TEAM
              </button>
              <button
                onClick={() => setTeamToDelete(null)}
                className="px-4 py-2 bg-white text-black border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-slate-100 cursor-pointer"
              >
                ANNULEREN
              </button>
            </div>
          </div>
        )}

        {/* Delete Score Modal/Banner */}
        {scoreToDelete && (
          <div className="mb-8 p-5 bg-rose-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-500 text-white border-2 border-black flex items-center justify-center shrink-0">
                <Trash2 size={20} />
              </div>
              <div>
                <h4 className="font-display font-black text-base uppercase text-black">
                  SCORE VERWIJDEREN?
                </h4>
                <p className="text-xs text-rose-700 font-semibold">
                  {scoreToDelete.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={handleConfirmDeleteScore}
                className="px-4 py-2 bg-rose-600 text-white border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-rose-700 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                JA, VERWIJDER SCORE
              </button>
              <button
                onClick={() => setScoreToDelete(null)}
                className="px-4 py-2 bg-white text-black border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-slate-100 cursor-pointer"
              >
                ANNULEREN
              </button>
            </div>
          </div>
        )}

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

              {errorMessage && (
                <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-500 text-rose-800 text-xs font-bold flex items-start gap-2.5">
                  <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>{errorMessage}</div>
                </div>
              )}

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
                    className="w-full px-4 py-3 bg-white border-2 border-black text-sm font-bold text-black focus:outline-none focus:bg-amber-50/50 uppercase"
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
                      onChange={(e) =>
                        setPointsInput(e.target.value === '' ? '' : Number(e.target.value))
                      }
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
                        onClick={() =>
                          setScoreToDelete({
                            id: score.id,
                            description: `${score.teamName} · ${score.spelName} (${score.points} ptn)`,
                          })
                        }
                        className="p-2 border border-slate-300 hover:border-black hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Score verwijderen"
                      >
                        <Trash2 size={15} />
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
                        <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                          Leden ({team.members.length}): {team.members.join(', ')}
                        </div>
                      </div>
                      <button
                        onClick={() => setTeamToDelete({ id: team.id, name: team.name })}
                        className="p-2 border border-slate-300 hover:border-black hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer shrink-0 ml-2"
                        title="Team definitief verwijderen"
                      >
                        <Trash2 size={15} />
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
