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
  getAnalyticsStats,
  AnalyticsSummary,
} from '../utils/analytics';
import {
  Trash2,
  CheckCircle2,
  LogOut,
  Trophy,
  Users,
  Award,
  ShieldAlert,
  AlertCircle,
  BarChart3,
  Cookie,
  Smartphone,
  Monitor,
  Tablet,
  RefreshCw,
  Eye,
  Activity,
  Calendar,
  Globe,
  Sparkles,
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'scores' | 'analytics'>('scores');
  const [teams, setTeams] = useState<Team[]>([]);
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  // Analytics states
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

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

  const loadAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const data = await getAnalyticsStats();
      setAnalytics(data);
    } catch (err) {
      console.error('Fout bij ophalen analytics:', err);
    } finally {
      setIsLoadingAnalytics(false);
    }
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
    loadAnalytics();
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

  // Human readable page names
  const getPageDisplayName = (page: string) => {
    switch (page) {
      case 'home':
        return 'Homepagina';
      case 'info':
        return 'Praktische Info & FAQ';
      case 'schema':
        return 'Dagschema';
      case 'scores':
        return 'Live Leaderboard';
      case 'deelnemers':
        return 'Deelnemerslijst';
      case 'inschrijven':
        return 'Inschrijfpagina';
      case 'login':
        return 'Inlogpagina';
      case 'team-portal':
        return 'Teamportaal';
      case 'scorebeheer':
        return 'Organisatie Scorebeheer';
      case 'privacy':
        return 'Privacyverklaring & Cookies';
      case 'spel-geheim-01':
        return 'Spel #01 Detail';
      case 'spel-geheim-02':
        return 'Spel #02 Detail';
      case 'spel-geheim-03':
        return 'Spel #03 Detail';
      case 'spel-geheim-04':
        return 'Spel #04 Detail';
      case 'spel-geheim-05':
        return 'Spel #05 Detail';
      default:
        return page;
    }
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
            BEVEILIGD ORGANISATIEPANEEL
          </span>
          <h2 className="font-display font-black text-3xl uppercase tracking-tight mb-3">
            ORGANISATIE LOGIN VEREIST
          </h2>
          <p className="text-xs text-slate-600 font-semibold mb-6 leading-relaxed">
            Het scorebeheer en de cookie-statistieken zijn alleen toegankelijk voor de wedstrijdleiding van Scouting Van Brederode. Log in met het organisatie-account.
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

  const totalViews = analytics?.totalPageviews || 0;
  const uniqueVisitors = analytics?.uniqueVisitors || 0;
  const mobileShare =
    totalViews > 0 ? Math.round(((analytics?.mobileCount || 0) / totalViews) * 100) : 0;
  const desktopShare =
    totalViews > 0 ? Math.round(((analytics?.desktopCount || 0) / totalViews) * 100) : 0;

  return (
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header with Tabs and Logout */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-6 border-b-2 border-slate-100">
          <div>
            <span className="text-sky-500 font-display font-black text-xs sm:text-sm tracking-widest uppercase block mb-1">
              ORGANISATIE · {ADMIN_CREDENTIALS.email}
            </span>
            <h1 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight leading-none text-black">
              {activeTab === 'scores' ? 'SCOREBEHEER' : 'STATISTIEKEN & COOKIES'}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Tab switch buttons */}
            <div className="flex items-center border-2 border-black p-1 bg-slate-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <button
                onClick={() => setActiveTab('scores')}
                className={`px-3 py-1.5 font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'scores'
                    ? 'bg-amber-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    : 'text-slate-700 hover:text-black'
                }`}
              >
                <Trophy size={14} /> SCORES
              </button>
              <button
                onClick={() => {
                  setActiveTab('analytics');
                  loadAnalytics();
                }}
                className={`px-3 py-1.5 font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'analytics'
                    ? 'bg-amber-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    : 'text-slate-700 hover:text-black'
                }`}
              >
                <BarChart3 size={14} /> STATISTIEKEN & COOKIES
              </button>
            </div>

            <button
              onClick={() => onNavigate('scores')}
              className="px-3.5 py-2 bg-white border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-slate-50 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              LIVE LEADERBOARD
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-black text-white border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-slate-900 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <LogOut size={14} /> UITLOGGEN
            </button>
          </div>
        </div>

        {/* -------------------- TAB 1: SCOREBEHEER -------------------- */}
        {activeTab === 'scores' && (
          <>
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
          </>
        )}

        {/* -------------------- TAB 2: ANALYTICS & STATISTIEKEN -------------------- */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-amber-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-400 border-2 border-black flex items-center justify-center font-black">
                  <Cookie size={20} className="text-black" />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm uppercase text-black">
                    FIRST-PARTY COOKIE & BEZOEKERSANALYTICS
                  </h3>
                  <p className="text-xs text-slate-700 font-medium">
                    Inzicht in actieve sessies, bezochte pagina’s en apparaten via <code className="bg-white px-1.5 py-0.5 border border-slate-300 font-mono text-[11px]">badeend_uid</code>.
                  </p>
                </div>
              </div>

              <button
                onClick={loadAnalytics}
                disabled={isLoadingAnalytics}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black flex items-center gap-2 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <RefreshCw size={14} className={isLoadingAnalytics ? 'animate-spin' : ''} />
                <span>VERNIEUW STATS</span>
              </button>
            </div>

            {/* 4 Key Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Pageviews */}
              <div className="bg-white border-2 border-black p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="font-display font-black text-xs uppercase tracking-wider text-black">
                    PAGINABEZOEKEN
                  </span>
                  <Eye size={18} className="text-amber-500" />
                </div>
                <div className="font-display font-black text-4xl sm:text-5xl text-black">
                  {totalViews}
                </div>
                <div className="text-xs text-slate-600 font-semibold mt-2 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>{analytics?.todayPageviews || 0} bezoeken vandaag</span>
                </div>
              </div>

              {/* Card 2: Unique Visitors */}
              <div className="bg-white border-2 border-black p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="font-display font-black text-xs uppercase tracking-wider text-black">
                    UNIEKE BEZOEKERS
                  </span>
                  <Cookie size={18} className="text-sky-500" />
                </div>
                <div className="font-display font-black text-4xl sm:text-5xl text-black">
                  {uniqueVisitors}
                </div>
                <div className="text-xs text-slate-600 font-semibold mt-2">
                  Getrackt via <span className="font-mono font-bold text-black">badeend_uid</span> cookie
                </div>
              </div>

              {/* Card 3: Apparaten */}
              <div className="bg-white border-2 border-black p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="font-display font-black text-xs uppercase tracking-wider text-black">
                    APPARATEN
                  </span>
                  <Smartphone size={18} className="text-emerald-500" />
                </div>
                <div className="font-display font-black text-3xl sm:text-4xl text-black">
                  {mobileShare}% <span className="text-sm font-bold text-slate-500">mobiel</span>
                </div>
                <div className="text-xs text-slate-600 font-semibold mt-2 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Smartphone size={12} /> {analytics?.mobileCount || 0} mobiel
                  </span>
                  <span className="flex items-center gap-1">
                    <Monitor size={12} /> {analytics?.desktopCount || 0} desktop
                  </span>
                </div>
              </div>

              {/* Card 4: Inschrijvingen */}
              <div className="bg-white border-2 border-black p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="font-display font-black text-xs uppercase tracking-wider text-black">
                    INGESCHREVEN TEAMS
                  </span>
                  <Users size={18} className="text-purple-500" />
                </div>
                <div className="font-display font-black text-4xl sm:text-5xl text-black">
                  {teams.length}
                </div>
                <div className="text-xs text-slate-600 font-semibold mt-2">
                  {teams.length * 4} deelnemers geregistreerd
                </div>
              </div>
            </div>

            {/* Middle Section: Popular Pages & Realtime Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Populaire Pagina's */}
              <div className="lg:col-span-6 bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black mb-4 flex items-center justify-between">
                  <span>MEEST BEZOCHTE PAGINA’S</span>
                  <Activity size={18} className="text-amber-500" />
                </h3>

                {Object.keys(analytics?.pageViews || {}).length === 0 ? (
                  <div className="text-xs text-slate-500 font-medium py-6 text-center">
                    Nog geen paginabezoeken geregistreerd. Bezoek enkele pagina’s om statistieken te zien.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(analytics?.pageViews || {})
                      .sort((a, b) => Number(b[1]) - Number(a[1]))
                      .map(([pageKey, rawCount]) => {
                        const count = Number(rawCount);
                        const percentage = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
                        return (
                          <div key={pageKey} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-black uppercase">
                                {getPageDisplayName(pageKey)}
                              </span>
                              <span className="text-slate-600 font-mono">
                                {count}x ({percentage}%)
                              </span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 border border-black overflow-hidden">
                              <div
                                className="h-full bg-amber-400 border-r border-black transition-all duration-500"
                                style={{ width: `${Math.max(percentage, 4)}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Right Column: Live Recente Activiteitenlog */}
              <div className="lg:col-span-6 bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black mb-4 flex items-center justify-between">
                  <span>RECENTE BEZOEKERSLOG</span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    LAATSTE {analytics?.recentEvents?.length || 0}
                  </span>
                </h3>

                {(!analytics?.recentEvents || analytics.recentEvents.length === 0) ? (
                  <div className="text-xs text-slate-500 font-medium py-6 text-center">
                    Geen recente bezoeken gevonden.
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                    {analytics.recentEvents.map((ev, idx) => {
                      const timeString = ev.timestamp
                        ? new Date(ev.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })
                        : '-';
                      return (
                        <div
                          key={ev.id || idx}
                          className="border border-black p-2.5 bg-slate-50 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            {ev.device === 'mobile' ? (
                              <Smartphone size={14} className="text-slate-600 shrink-0" />
                            ) : ev.device === 'tablet' ? (
                              <Tablet size={14} className="text-slate-600 shrink-0" />
                            ) : (
                              <Monitor size={14} className="text-slate-600 shrink-0" />
                            )}
                            <div>
                              <div className="font-bold text-black uppercase">
                                {getPageDisplayName(ev.page)}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {ev.browser} · ID: {ev.visitorId?.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                          <div className="font-mono text-[11px] text-slate-600 font-semibold shrink-0">
                            {timeString}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Google Analytics (GA4) / Tag Info Box */}
            <div className="p-6 bg-slate-50 border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-black text-amber-400 border-2 border-black flex items-center justify-center shrink-0">
                  <Globe size={20} />
                </div>
                <div className="space-y-2">
                  <h4 className="font-display font-black text-base uppercase text-black">
                    OPTIONEEL: GOOGLE ANALYTICS (GA4) KOPPELEN
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    Naast de ingebouwde first-party cookie-statistieken kun je een Google Analytics 4 Measurement ID toevoegen (zoals <code className="font-mono bg-white px-1 border border-slate-300">G-XXXXXXXXXX</code> in <code className="font-mono">.env.example</code> als <code className="font-mono">VITE_GA_MEASUREMENT_ID</code>). De app stuurt dan automatisch geanonimiseerde bezoeken door naar jouw Google Analytics dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
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
