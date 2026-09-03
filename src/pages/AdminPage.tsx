import React, { useState, useEffect } from 'react';
import { PageRoute, SpelId, Team, ScoreEntry, JuryMember } from '../types';
import { SPELEN, ADMIN_CREDENTIALS } from '../data/mockData';
import {
  getStoredTeams,
  getStoredScores,
  getStoredJuryMembers,
  getStoredFaqs,
  updateJuryMember,
  deleteJuryMember,
  saveOrUpdateScore,
  deleteScore,
  deleteTeam,
  getAdminSession,
  setAdminSession,
} from '../utils/storage';
import {
  getAnalyticsStats,
  AnalyticsSummary,
  SessionDetail,
  clearAllDatabaseAnalytics,
  clearAllUserCookiesAndStorage,
  GA_MEASUREMENT_ID,
} from '../utils/analytics';
import { SessionDetailModal } from '../components/SessionDetailModal';
import { JuryAvatar } from '../components/JuryAvatar';
import { AdminFaqSection } from '../components/AdminFaqSection';
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
  Compass,
  Search,
  ArrowRight,
  Clock,
  Layers,
  Filter,
  ExternalLink,
  Tag,
  ChevronRight,
  ChevronDown,
  UserCheck,
  UserX,
  Crown,
  Star,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface AdminPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'scores' | 'jury' | 'faq' | 'analytics'>('scores');
  const [teams, setTeams] = useState<Team[]>([]);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [juryMembers, setJuryMembers] = useState<JuryMember[]>([]);
  const [faqsCount, setFaqsCount] = useState<number>(() => getStoredFaqs().length);
  const [jurySearchQuery, setJurySearchQuery] = useState('');
  const [juryToDelete, setJuryToDelete] = useState<JuryMember | null>(null);

  // Analytics states
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionDetail | null>(null);
  const [sessionSearchQuery, setSessionSearchQuery] = useState('');
  const [sessionDeviceFilter, setSessionDeviceFilter] = useState<'all' | 'mobile' | 'desktop' | 'tablet'>('all');
  const [sessionOriginFilter, setSessionOriginFilter] = useState<'all' | 'direct' | 'search' | 'social' | 'external' | 'campaign'>('all');

  // Form states
  const [selectedTeamName, setSelectedTeamName] = useState('');
  const [selectedSpelId, setSelectedSpelId] = useState<SpelId>('geheim-01');
  const [pointsInput, setPointsInput] = useState<number | ''>('');

  // Inline delete confirmation states (avoids iframe-blocked window.confirm)
  const [teamToDelete, setTeamToDelete] = useState<{ id: string; name: string } | null>(null);
  const [scoreToDelete, setScoreToDelete] = useState<{ id: string; description: string } | null>(null);
  const [showClearAnalyticsModal, setShowClearAnalyticsModal] = useState<boolean>(false);
  const [isClearingAnalytics, setIsClearingAnalytics] = useState<boolean>(false);

  // Status & toast
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleClearOwnCookies = () => {
    clearAllUserCookiesAndStorage();
    showToast('Eigen cookies en identifiers gewist!');
    loadAnalytics();
  };

  const handleClearAllAnalyticsData = async () => {
    setIsClearingAnalytics(true);
    try {
      const res = await clearAllDatabaseAnalytics();
      setShowClearAnalyticsModal(false);
      showToast(`Alle statistieken gewist (${res.deletedCount} items)!`);
      await loadAnalytics();
    } catch (err) {
      console.error('Fout bij wissen statistieken:', err);
      showToast('Fout bij het wissen van de statistieken.');
    } finally {
      setIsClearingAnalytics(false);
    }
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
    const j = getStoredJuryMembers();
    const f = getStoredFaqs();
    setTeams(t);
    setScores(s);
    setJuryMembers(j);
    setFaqsCount(f.length);
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

  const handleToggleJuryStatus = async (member: JuryMember) => {
    try {
      const newStatus = member.status === 'active' ? 'pending' : 'active';
      setJuryMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, status: newStatus } : m))
      );
      await updateJuryMember(member.id, { status: newStatus });
      showToast(`Status van ${member.name} gewijzigd naar ${newStatus === 'active' ? 'Actief' : 'Gepauzeerd'}`);
      refreshData();
    } catch (err: any) {
      console.error('Fout bij wijzigen jurystatus:', err);
      showToast('Fout bij wijzigen status: ' + (err?.message || 'Onbekende fout'));
    }
  };

  const handleToggleHeadJury = async (member: JuryMember) => {
    try {
      const newHead = !member.isHeadJury;
      setJuryMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, isHeadJury: newHead } : m))
      );
      await updateJuryMember(member.id, { isHeadJury: newHead });
      showToast(
        newHead
          ? `👑 ${member.name} gemarkeerd als Hoofd van de jury`
          : `Rol Hoofd van de jury ingetrokken voor ${member.name}`
      );
      refreshData();
    } catch (err: any) {
      console.error('Fout bij toewijzen hoofdjury:', err);
      showToast('Fout bij toewijzen: ' + (err?.message || 'Onbekende fout'));
    }
  };

  const handleToggleOrganizer = async (member: JuryMember) => {
    try {
      const newOrg = !member.isOrganizer;
      setJuryMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, isOrganizer: newOrg } : m))
      );
      await updateJuryMember(member.id, { isOrganizer: newOrg });
      showToast(
        newOrg
          ? `⭐ ${member.name} gemarkeerd als Organisator`
          : `Rol Organisator ingetrokken voor ${member.name}`
      );
      refreshData();
    } catch (err: any) {
      console.error('Fout bij toewijzen organisator:', err);
      showToast('Fout bij toewijzen: ' + (err?.message || 'Onbekende fout'));
    }
  };

  const handleConfirmDeleteJury = () => {
    if (!juryToDelete) return;
    deleteJuryMember(juryToDelete.id);
    setJuryToDelete(null);
    showToast(`Jurylid ${juryToDelete.name} verwijderd`);
    refreshData();
  };

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
              {activeTab === 'scores'
                ? 'SCOREBEHEER'
                : activeTab === 'jury'
                ? 'JURYBEHEER'
                : activeTab === 'faq'
                ? 'FAQ BEHEER'
                : 'STATISTIEKEN & COOKIES'}
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
                onClick={() => setActiveTab('jury')}
                className={`px-3 py-1.5 font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'jury'
                    ? 'bg-amber-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    : 'text-slate-700 hover:text-black'
                }`}
              >
                <Award size={14} /> JURY ({juryMembers.length})
              </button>

              <button
                onClick={() => setActiveTab('faq')}
                className={`px-3 py-1.5 font-display font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'faq'
                    ? 'bg-amber-400 text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                    : 'text-slate-700 hover:text-black'
                }`}
              >
                <HelpCircle size={14} /> FAQ ({faqsCount})
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
                <BarChart3 size={14} /> STATS
              </button>
            </div>

            <button
              onClick={() => onNavigate('jury')}
              className="px-3.5 py-2 bg-white border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-slate-50 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              JURYPAGINA
            </button>
            <button
              onClick={() => onNavigate('scores')}
              className="px-3.5 py-2 bg-white border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-slate-50 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              LEADERBOARD
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

        {/* -------------------- TAB: JURYBEHEER -------------------- */}
        {activeTab === 'jury' && (
          <div className="space-y-6 animate-in fade-in">
            {/* Delete Jury Member Confirm Banner */}
            {juryToDelete && (
              <div className="p-5 bg-rose-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-500 text-white border-2 border-black flex items-center justify-center shrink-0">
                    <Trash2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-base uppercase text-black">
                      JURYLID VERWIJDEREN: {juryToDelete.name}?
                    </h4>
                    <p className="text-xs text-rose-700 font-semibold">
                      Dit jurylid wordt definitief verwijderd van de website en kan niet meer inloggen.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleConfirmDeleteJury}
                    className="px-4 py-2 bg-rose-600 text-white border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-rose-700 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    JA, VERWIJDER JURYLID
                  </button>
                  <button
                    onClick={() => setJuryToDelete(null)}
                    className="px-4 py-2 bg-white text-black border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-slate-100 cursor-pointer"
                  >
                    ANNULEREN
                  </button>
                </div>
              </div>
            )}

            {/* Jury Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-amber-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-400 border-2 border-black flex items-center justify-center font-black shrink-0">
                  <Award size={20} className="text-black" />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm uppercase text-black">
                    AANGEMELDE JURYLEDEN ({juryMembers.length})
                  </h3>
                  <p className="text-xs text-slate-700 font-medium">
                    Beheer juryleden, wijs de rollen <strong>Hoofd van de jury</strong> en <strong>Organisator</strong> toe, of pauzeer/verwijder profielen.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('jury')}
                  className="px-3.5 py-2 bg-black text-amber-400 hover:text-white border-2 border-black font-display font-black text-xs uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5"
                >
                  <Eye size={14} />
                  <span>VOORSTELPAGINA OPENEN</span>
                </button>
              </div>
            </div>

            {/* Role Assignment Notice */}
            <div className="bg-white border-2 border-black p-3.5 flex items-center gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Shield size={18} className="text-amber-600 shrink-0" />
              <p className="text-xs font-bold text-slate-700">
                Alleen de organisatie kan hieronder per jurylid de status <strong>👑 Hoofd van de jury</strong> en <strong>⭐ Organisator</strong> in- of uitschakelen.
              </p>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Zoek jurylid op naam, scoutinggroep of e-mail..."
                value={jurySearchQuery}
                onChange={(e) => setJurySearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-black text-xs sm:text-sm font-bold text-black focus:outline-none focus:bg-amber-50/50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            {/* Jury Members List */}
            {juryMembers.filter((m) => {
              const q = jurySearchQuery.toLowerCase().trim();
              if (!q) return true;
              return (
                m.name.toLowerCase().includes(q) ||
                m.email.toLowerCase().includes(q) ||
                (m.scoutingAffiliation && m.scoutingAffiliation.toLowerCase().includes(q))
              );
            }).length === 0 ? (
              <div className="p-12 text-center bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-xs font-bold text-slate-500 uppercase">Geen juryleden gevonden</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {juryMembers
                  .filter((m) => {
                    const q = jurySearchQuery.toLowerCase().trim();
                    if (!q) return true;
                    return (
                      m.name.toLowerCase().includes(q) ||
                      m.email.toLowerCase().includes(q) ||
                      (m.scoutingAffiliation && m.scoutingAffiliation.toLowerCase().includes(q))
                    );
                  })
                  .map((member) => (
                    <div
                      key={member.id}
                      className="bg-white border-2 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start gap-3.5 mb-3">
                          <JuryAvatar
                            avatarType={member.avatarType}
                            avatarPresetId={member.avatarPresetId}
                            photoUrl={member.photoUrl}
                            size="md"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-display font-black text-base uppercase text-black truncate">
                                {member.name}
                              </h4>
                              <span
                                className={`text-[9px] font-display font-black uppercase px-2 py-0.5 border ${
                                  member.status === 'active'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : 'bg-amber-100 text-amber-800 border-amber-300'
                                }`}
                              >
                                {member.status === 'active' ? 'ACTIEF' : 'GEPAUZEERD'}
                              </span>
                            </div>

                            <p className="text-[11px] font-semibold text-slate-500">
                              {member.email} · {member.scoutingAffiliation || 'Scouting'}
                            </p>
                          </div>
                        </div>

                        {/* Special Role assignment badges/toggles */}
                        <div className="bg-slate-50 border border-slate-200 p-2.5 mb-3 space-y-2">
                          <span className="text-[9px] font-display font-black uppercase text-slate-500 tracking-wider block">
                            ORGANISATIEROL TOEWIJZEN:
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleHeadJury(member)}
                              className={`px-2.5 py-1 text-xs font-display font-black uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-1.5 ${
                                member.isHeadJury
                                  ? 'bg-amber-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                  : 'bg-white text-slate-600 hover:bg-amber-100 hover:text-black border-dashed'
                              }`}
                              title="Klik om Hoofd van de jury toe te wijzen of in te trekken"
                            >
                              <Crown size={13} className={member.isHeadJury ? 'text-black' : 'text-slate-400'} />
                              <span>{member.isHeadJury ? '👑 HOOFD VAN DE JURY' : '+ MAAK HOOFD JURY'}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleOrganizer(member)}
                              className={`px-2.5 py-1 text-xs font-display font-black uppercase border-2 border-black transition-all cursor-pointer flex items-center gap-1.5 ${
                                member.isOrganizer
                                  ? 'bg-black text-amber-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-black border-dashed'
                              }`}
                              title="Klik om Organisator-status toe te wijzen of in te trekken"
                            >
                              <Star size={12} className={member.isOrganizer ? 'fill-amber-300 text-amber-300' : 'text-slate-400'} />
                              <span>{member.isOrganizer ? '⭐ ORGANISATOR' : '+ MAAK ORGANISATOR'}</span>
                            </button>
                          </div>
                        </div>

                        {member.bioQuote && (
                          <div className="text-xs italic text-slate-600 pl-3 border-l-2 border-amber-400 mb-3">
                            "{member.bioQuote}"
                          </div>
                        )}
                      </div>

                      {/* Admin Card Action Buttons */}
                      <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleToggleJuryStatus(member)}
                          className={`px-3 py-1.5 text-[11px] font-display font-black uppercase border border-black cursor-pointer transition-colors flex items-center gap-1 ${
                            member.status === 'active'
                              ? 'bg-amber-100 hover:bg-amber-200 text-black'
                              : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                          }`}
                        >
                          {member.status === 'active' ? (
                            <>
                              <UserX size={12} />
                              <span>PAUZEER</span>
                            </>
                          ) : (
                            <>
                              <UserCheck size={12} />
                              <span>ACTIVEER</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => setJuryToDelete(member)}
                          className="px-3 py-1.5 text-[11px] font-display font-black uppercase bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          <span>VERWIJDER</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* -------------------- TAB: FAQ BEHEER -------------------- */}
        {activeTab === 'faq' && (
          <AdminFaqSection onNavigate={onNavigate} showToast={showToast} />
        )}

        {/* -------------------- TAB 2: ANALYTICS & STATISTIEKEN -------------------- */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Top Toolbar */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 bg-amber-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-400 border-2 border-black flex items-center justify-center font-black shrink-0">
                  <Cookie size={20} className="text-black" />
                </div>
                <div>
                  <h3 className="font-display font-black text-sm uppercase text-black">
                    FIRST-PARTY COOKIE & BEZOEKERSANALYTICS
                  </h3>
                  <p className="text-xs text-slate-700 font-medium">
                    Inzicht in actieve sessies, bezochte pagina’s en herkomstbronnen via <code className="bg-white px-1.5 py-0.5 border border-slate-300 font-mono text-[11px]">badeend_uid</code>.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                <button
                  onClick={loadAnalytics}
                  disabled={isLoadingAnalytics}
                  className="px-3 py-2 bg-white hover:bg-slate-100 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  title="Herlaad statistieken uit de database"
                >
                  <RefreshCw size={13} className={isLoadingAnalytics ? 'animate-spin' : ''} />
                  <span>VERNIEUW STATS</span>
                </button>

                <button
                  onClick={handleClearOwnCookies}
                  className="px-3 py-2 bg-white hover:bg-amber-100 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  title="Wis cookies en herinitialiseer jouw eigen browsersessie"
                >
                  <Cookie size={13} className="text-amber-600" />
                  <span>EIGEN COOKIES WISSEN</span>
                </button>

                <button
                  onClick={() => setShowClearAnalyticsModal(true)}
                  className="px-3 py-2 bg-rose-50 hover:bg-rose-100 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-rose-700 hover:text-rose-900 flex items-center gap-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  title="Verwijder alle opgeslagen analytics events uit de database"
                >
                  <Trash2 size={13} className="text-rose-600" />
                  <span>WIS ALLE COOKIEDATA</span>
                </button>
              </div>
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

              {/* Card 2: Unique Visitors & Sessions */}
              <div className="bg-white border-2 border-black p-5 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="font-display font-black text-xs uppercase tracking-wider text-black">
                    BEZOEKERS & SESSIES
                  </span>
                  <Cookie size={18} className="text-sky-500" />
                </div>
                <div className="font-display font-black text-4xl sm:text-5xl text-black">
                  {uniqueVisitors}
                </div>
                <div className="text-xs text-slate-600 font-semibold mt-2 flex items-center justify-between">
                  <span>{analytics?.totalSessions || uniqueVisitors} totale sessies</span>
                  <span className="font-mono text-black font-bold">~{analytics?.avgPagesPerSession || 1} pag/sessie</span>
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

            {/* SECTION: WAARVANDAAN BEZOCHT? (VERKEERSBRONNEN & HERKOMST) */}
            <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b-2 border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black text-amber-400 border border-black flex items-center justify-center font-black">
                      <Compass size={18} />
                    </div>
                    <h3 className="font-display font-black text-xl uppercase tracking-tight text-black">
                      WAARVANDAAN BEZOEKEN GEBRUIKERS DE WEBSITE?
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold mt-1">
                    Analyse van verwijzende websites, zoekmachines, sociale media, WhatsApp en directe links.
                  </p>
                </div>

                <span className="text-xs font-mono font-bold bg-amber-100 border border-amber-300 text-amber-900 px-2.5 py-1 uppercase tracking-wider self-start sm:self-auto">
                  {Object.keys(analytics?.trafficSources || {}).length} ACTIEVE BRONNEN
                </span>
              </div>

              {/* 5 Category Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                {/* 1. Direct */}
                <div
                  onClick={() => setSessionOriginFilter(sessionOriginFilter === 'direct' ? 'all' : 'direct')}
                  className={`p-3 border-2 border-black cursor-pointer transition-all ${
                    sessionOriginFilter === 'direct'
                      ? 'bg-amber-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                      : 'bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                    <span className="uppercase">DIRECT</span>
                    <Compass size={14} className="text-slate-800" />
                  </div>
                  <div className="font-display font-black text-2xl text-black mt-1">
                    {analytics?.trafficCategories.direct || 0}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                    URL / Bladwijzers / QR
                  </div>
                </div>

                {/* 2. Zoekmachines */}
                <div
                  onClick={() => setSessionOriginFilter(sessionOriginFilter === 'search' ? 'all' : 'search')}
                  className={`p-3 border-2 border-black cursor-pointer transition-all ${
                    sessionOriginFilter === 'search'
                      ? 'bg-blue-400 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                      : 'bg-blue-50/70 hover:bg-blue-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-blue-900">
                    <span className="uppercase">ZOEKMACHINES</span>
                    <Search size={14} className="text-blue-700" />
                  </div>
                  <div className="font-display font-black text-2xl text-blue-950 mt-1">
                    {analytics?.trafficCategories.search || 0}
                  </div>
                  <div className="text-[10px] text-blue-700 font-medium mt-0.5">
                    Google, Bing, etc.
                  </div>
                </div>

                {/* 3. Social & Chat */}
                <div
                  onClick={() => setSessionOriginFilter(sessionOriginFilter === 'social' ? 'all' : 'social')}
                  className={`p-3 border-2 border-black cursor-pointer transition-all ${
                    sessionOriginFilter === 'social'
                      ? 'bg-emerald-400 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                      : 'bg-emerald-50/70 hover:bg-emerald-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-900">
                    <span className="uppercase">SOCIAL & CHAT</span>
                    <Globe size={14} className="text-emerald-700" />
                  </div>
                  <div className="font-display font-black text-2xl text-emerald-950 mt-1">
                    {analytics?.trafficCategories.social || 0}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                    WhatsApp, Insta, FB
                  </div>
                </div>

                {/* 4. Scouting & Externe links */}
                <div
                  onClick={() => setSessionOriginFilter(sessionOriginFilter === 'external' ? 'all' : 'external')}
                  className={`p-3 border-2 border-black cursor-pointer transition-all ${
                    sessionOriginFilter === 'external'
                      ? 'bg-purple-400 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                      : 'bg-purple-50/70 hover:bg-purple-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-purple-900">
                    <span className="uppercase">VERWIJZERS</span>
                    <ExternalLink size={14} className="text-purple-700" />
                  </div>
                  <div className="font-display font-black text-2xl text-purple-950 mt-1">
                    {analytics?.trafficCategories.external || 0}
                  </div>
                  <div className="text-[10px] text-purple-700 font-medium mt-0.5">
                    Scouting Papendrecht e.a.
                  </div>
                </div>

                {/* 5. Campagnes */}
                <div
                  onClick={() => setSessionOriginFilter(sessionOriginFilter === 'campaign' ? 'all' : 'campaign')}
                  className={`p-3 border-2 border-black cursor-pointer transition-all col-span-2 sm:col-span-1 ${
                    sessionOriginFilter === 'campaign'
                      ? 'bg-amber-400 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                      : 'bg-amber-50/70 hover:bg-amber-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-900">
                    <span className="uppercase">CAMPAGNES</span>
                    <Tag size={14} className="text-amber-700" />
                  </div>
                  <div className="font-display font-black text-2xl text-amber-950 mt-1">
                    {analytics?.trafficCategories.campaign || 0}
                  </div>
                  <div className="text-[10px] text-amber-700 font-medium mt-0.5">
                    UTM & Nieuwsbrieven
                  </div>
                </div>
              </div>

              {/* Specific Source Bars */}
              <div className="space-y-3">
                <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                  OVERZICHT HERKOMSTBRONNEN PER SESSIE:
                </div>

                {Object.keys(analytics?.trafficSources || {}).length === 0 ? (
                  <div className="text-xs text-slate-500 font-medium py-3 text-center bg-slate-50 border border-black">
                    Nog geen herkomstbronnen gelogd.
                  </div>
                ) : (
                  Object.entries(analytics?.trafficSources || {})
                    .sort((a, b) => Number(b[1]) - Number(a[1]))
                    .map(([sourceName, rawCount]) => {
                      const count = Number(rawCount);
                      const totalSess = analytics?.totalSessions || 1;
                      const pct = Math.round((count / totalSess) * 100);
                      return (
                        <div key={sourceName} className="space-y-1">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-black flex items-center gap-1.5">
                              <Compass size={13} className="text-amber-500 shrink-0" />
                              <span>{sourceName}</span>
                            </span>
                            <span className="font-mono text-slate-600">
                              {count} {count === 1 ? 'sessie' : 'sessies'} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-slate-100 border border-black overflow-hidden">
                            <div
                              className="h-full bg-sky-400 border-r border-black transition-all duration-500"
                              style={{ width: `${Math.max(pct, 3)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            {/* SECTION: SESSIE-VERKENNER & DOORKLIKKEN NAAR BEZOCHTE PAGINA'S */}
            <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-400 border border-black flex items-center justify-center font-black">
                      <Layers size={18} className="text-black" />
                    </div>
                    <h3 className="font-display font-black text-xl uppercase tracking-tight text-black">
                      SESSIES & DOORKLIKKEN: BEZOCHTE PAGINA’S PER SESSIE
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 font-semibold mt-1">
                    Klik op een willekeurige sessie om het volledige chronologische paginapad, herkomst en tijdsduur te bekijken.
                  </p>
                </div>

                <div className="text-xs font-mono font-bold text-slate-500 shrink-0">
                  TOTAAL {analytics?.sessions?.length || 0} SESSIES
                </div>
              </div>

              {/* Filters & Search Toolbar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-6">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={sessionSearchQuery}
                    onChange={(e) => setSessionSearchQuery(e.target.value)}
                    placeholder="Zoek op sessie ID, bezoeker ID, paginanaam of herkomst..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border-2 border-black text-xs font-medium focus:bg-white focus:outline-hidden focus:border-amber-500"
                  />
                  {sessionSearchQuery && (
                    <button
                      onClick={() => setSessionSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-black"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Device Filter */}
                <div className="flex items-center gap-1 border-2 border-black p-1 bg-slate-100 shrink-0">
                  {(['all', 'desktop', 'mobile', 'tablet'] as const).map((dev) => (
                    <button
                      key={dev}
                      onClick={() => setSessionDeviceFilter(dev)}
                      className={`px-2.5 py-1 text-[11px] font-display font-black uppercase transition-all cursor-pointer ${
                        sessionDeviceFilter === dev
                          ? 'bg-black text-amber-400 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                          : 'text-slate-600 hover:text-black'
                      }`}
                    >
                      {dev === 'all' ? 'Alle' : dev}
                    </button>
                  ))}
                </div>

                {/* Origin Filter Pill */}
                {sessionOriginFilter !== 'all' && (
                  <button
                    onClick={() => setSessionOriginFilter('all')}
                    className="px-2.5 py-2 bg-amber-400 border-2 border-black font-display font-black text-xs uppercase flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <span>Filter: {sessionOriginFilter}</span>
                    <span className="font-mono">✕</span>
                  </button>
                )}
              </div>

              {/* Filtered Sessions List */}
              {(() => {
                const sessionsList = (analytics?.sessions || []).filter((s) => {
                  // Device filter
                  if (sessionDeviceFilter !== 'all' && s.device !== sessionDeviceFilter) {
                    return false;
                  }
                  // Origin filter
                  if (sessionOriginFilter !== 'all' && s.origin.category !== sessionOriginFilter) {
                    return false;
                  }
                  // Search query filter
                  if (sessionSearchQuery.trim()) {
                    const q = sessionSearchQuery.toLowerCase();
                    const matchId = s.sessionId.toLowerCase().includes(q) || s.visitorId.toLowerCase().includes(q);
                    const matchOrigin = (s.origin.sourceName || '').toLowerCase().includes(q) ||
                      (s.origin.hostname || '').toLowerCase().includes(q);
                    const matchPages = s.steps.some(
                      (st) =>
                        st.page.toLowerCase().includes(q) ||
                        getPageDisplayName(st.page).toLowerCase().includes(q)
                    );
                    return matchId || matchOrigin || matchPages;
                  }
                  return true;
                });

                if (sessionsList.length === 0) {
                  return (
                    <div className="p-8 bg-slate-50 border-2 border-black text-center">
                      <div className="w-10 h-10 bg-white border border-black flex items-center justify-center mx-auto mb-2 font-bold">
                        <Search size={18} className="text-slate-400" />
                      </div>
                      <div className="font-display font-black text-sm uppercase text-black">
                        GEEN SESSIES GEVONDEN
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Er zijn geen sessies die voldoen aan de huidige zoekfilters.
                      </p>
                      {(sessionSearchQuery || sessionDeviceFilter !== 'all' || sessionOriginFilter !== 'all') && (
                        <button
                          onClick={() => {
                            setSessionSearchQuery('');
                            setSessionDeviceFilter('all');
                            setSessionOriginFilter('all');
                          }}
                          className="mt-3 px-3 py-1.5 bg-black text-amber-400 border border-black font-display font-black text-xs uppercase cursor-pointer"
                        >
                          FILTERS WISSEN
                        </button>
                      )}
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>TOONT {sessionsList.length} SESSIE{sessionsList.length === 1 ? '' : 'S'}</span>
                      <span>KLIK OP EEN SESSIE VOOR VOLLEDIG PAGINAPAD</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3.5 max-h-[600px] overflow-y-auto pr-1">
                      {sessionsList.map((sess) => {
                        const startTimeFormatted = sess.startTime
                          ? new Date(sess.startTime).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-';
                        const dateFormatted = sess.startTime
                          ? new Date(sess.startTime).toLocaleDateString('nl-NL', {
                              day: 'numeric',
                              month: 'short',
                            })
                          : '';

                        const durationStr =
                          sess.durationSeconds < 60
                            ? `${sess.durationSeconds}s`
                            : `${Math.floor(sess.durationSeconds / 60)}m ${sess.durationSeconds % 60}s`;

                        return (
                          <div
                            key={sess.sessionId}
                            onClick={() => setSelectedSession(sess)}
                            className="bg-slate-50 hover:bg-amber-50/50 border-2 border-black p-4 transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group"
                          >
                            {/* Card Top Row: Origin, Device, Time */}
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                              <div className="flex items-center gap-2 flex-wrap">
                                {/* Origin Pill */}
                                <span className="inline-flex items-center gap-1 bg-white border border-black px-2 py-0.5 text-xs font-black text-black">
                                  <Compass size={12} className="text-amber-600 shrink-0" />
                                  <span>{sess.origin.sourceName}</span>
                                </span>

                                {/* Device Pill */}
                                <span className="inline-flex items-center gap-1 bg-white border border-slate-300 px-2 py-0.5 text-[11px] font-bold text-slate-700 capitalize">
                                  {sess.device === 'mobile' ? (
                                    <Smartphone size={11} className="text-emerald-600" />
                                  ) : sess.device === 'tablet' ? (
                                    <Tablet size={11} className="text-sky-600" />
                                  ) : (
                                    <Monitor size={11} className="text-purple-600" />
                                  )}
                                  <span>{sess.device}</span>
                                </span>

                                <span className="font-mono text-[11px] text-slate-500">
                                  ID: {sess.sessionId.substring(0, 10)}...
                                </span>
                              </div>

                              <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
                                <span className="font-bold text-black">{dateFormatted} {startTimeFormatted}</span>
                                <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-1.5 py-0.5 text-[11px]">
                                  {durationStr}
                                </span>
                              </div>
                            </div>

                            {/* Card Middle: Interactive Breadcrumb Path Preview */}
                            <div className="mb-3">
                              <div className="text-[10px] font-black uppercase text-slate-400 mb-1">
                                BEZOCHTE PAGINA’S ({sess.pageCount} WEERGAVEN):
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {sess.steps.slice(0, 5).map((st, sIdx) => (
                                  <React.Fragment key={sIdx}>
                                    <span className="inline-flex items-center gap-1 bg-white border border-black px-2 py-1 text-xs font-bold text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                                      <span className="text-slate-400 text-[10px]">{sIdx + 1}.</span>
                                      <span>{getPageDisplayName(st.page)}</span>
                                    </span>
                                    {sIdx < Math.min(sess.steps.length - 1, 4) && (
                                      <ArrowRight size={12} className="text-slate-400 shrink-0" />
                                    )}
                                  </React.Fragment>
                                ))}

                                {sess.steps.length > 5 && (
                                  <span className="bg-black text-amber-400 px-2 py-0.5 text-xs font-black font-mono">
                                    +{sess.steps.length - 5} meer
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Card Bottom Row: Action button */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                              <span className="text-[11px] text-slate-500 font-medium">
                                Instap: <strong className="text-black font-bold">{getPageDisplayName(sess.landingPage)}</strong>
                                {sess.steps.length > 1 && (
                                  <> · Uitstap: <strong className="text-black font-bold">{getPageDisplayName(sess.exitPage)}</strong></>
                                )}
                              </span>

                              <div className="font-display font-black text-xs uppercase text-black group-hover:text-amber-700 flex items-center gap-1">
                                <span>BEKIJK TIJDLIJN & DOORKLIKKEN</span>
                                <ChevronRight size={14} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
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

            {/* Google Analytics (GA4) / Tag Info Box & Measurement ID Guide */}
            <div className="p-6 sm:p-8 bg-slate-50 border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4 pb-4 border-b-2 border-slate-200 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black text-amber-400 border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <Globe size={22} />
                  </div>
                  <div>
                    <h4 className="font-display font-black text-lg uppercase text-black">
                      GOOGLE ANALYTICS 4 (GA4) INTEGRATIE
                    </h4>
                    <p className="text-xs text-slate-600 font-medium">
                      Optioneel koppelen met jouw Google Analytics property via de Measurement ID.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase text-slate-500">Status:</span>
                  {GA_MEASUREMENT_ID ? (
                    <span className="bg-emerald-100 border border-emerald-300 text-emerald-900 font-mono text-xs font-bold px-2.5 py-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>GEKOPPELD ({GA_MEASUREMENT_ID})</span>
                    </span>
                  ) : (
                    <span className="bg-amber-100 border border-amber-300 text-amber-900 font-mono text-xs font-bold px-2.5 py-1">
                      GEEN METINGS-ID INGESTELD
                    </span>
                  )}
                </div>
              </div>

              {/* Step-by-step guide to finding GA4 Measurement ID */}
              <div className="space-y-4">
                <div className="text-xs font-display font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                  <Search size={14} className="text-amber-500" />
                  <span>HOE VIND JE JOUW GOOGLE ANALYTICS 4 MEASUREMENT ID? (STAPPENPLAN)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-6 h-6 bg-amber-400 border border-black font-display font-black text-xs flex items-center justify-center mb-2">
                      1
                    </div>
                    <div className="font-bold text-black uppercase mb-1">Open Google Analytics</div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Ga naar <a href="https://analytics.google.com" target="_blank" rel="noreferrer" className="text-sky-600 underline font-bold">analytics.google.com</a> en log in met het Google-account van Scouting/Badeendlympics.
                    </p>
                  </div>

                  <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-6 h-6 bg-amber-400 border border-black font-display font-black text-xs flex items-center justify-center mb-2">
                      2
                    </div>
                    <div className="font-bold text-black uppercase mb-1">Beheerder (Admin)</div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Klik linksonder op het tandwiel-icoon <strong>Beheerder (Admin)</strong> en kies de juiste Property.
                    </p>
                  </div>

                  <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-6 h-6 bg-amber-400 border border-black font-display font-black text-xs flex items-center justify-center mb-2">
                      3
                    </div>
                    <div className="font-bold text-black uppercase mb-1">Gegevensstreams</div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Klik onder <em>Gegevensverzameling</em> op <strong>Gegevensstreams (Data Streams)</strong> en kies het tabblad <strong>Web</strong>.
                    </p>
                  </div>

                  <div className="p-3 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-6 h-6 bg-black text-amber-400 border border-black font-display font-black text-xs flex items-center justify-center mb-2">
                      4
                    </div>
                    <div className="font-bold text-black uppercase mb-1">Metings-ID (G-...)</div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">
                      Klik op jouw stream. Rechtsboven staat de <strong>Metings-ID</strong> (begint met <code className="bg-slate-100 font-mono font-bold px-1">G-XXXXXXXXXX</code>).
                    </p>
                  </div>
                </div>

                <div className="mt-3 p-3 bg-amber-100/70 border border-black text-xs font-medium text-amber-950 flex items-start gap-2">
                  <Sparkles size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Instellen in de app:</strong> Voeg de omgevingsvariabele <code className="bg-white px-1.5 py-0.5 border border-amber-300 font-mono font-bold">VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX</code> toe in jouw instellingen of <code className="font-mono">.env</code> bestand. Zodra een bezoeker cookies accepteert, wordt GA4 automatisch geactiveerd.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Session Detail Modal */}
      {selectedSession && (
        <SessionDetailModal
          session={selectedSession}
          allSessions={analytics?.sessions || []}
          onClose={() => setSelectedSession(null)}
          onSelectSession={(sess) => setSelectedSession(sess)}
          getPageDisplayName={getPageDisplayName}
        />
      )}

      {/* Confirmation Modal: Clear all analytics data from database */}
      {showClearAnalyticsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border-2 border-black p-6 sm:p-8 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600 mb-4">
              <div className="w-10 h-10 bg-rose-100 border-2 border-black flex items-center justify-center font-black shrink-0">
                <Trash2 size={20} className="text-rose-600" />
              </div>
              <h3 className="font-display font-black text-lg sm:text-xl uppercase text-black">
                ALLE COOKIEDATA & STATISTIEKEN WISSEN?
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-6">
              Weet je zeker dat je alle gelogde cookie-bezoeken, sessiepaden en statistieken wilt verwijderen uit de database?
              <br />
              <br />
              <strong className="text-black">Let op:</strong> Alle tellers (paginaweergaven, unieke bezoekers en sessies) worden hierdoor gereset naar 0.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowClearAnalyticsModal(false)}
                disabled={isClearingAnalytics}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black cursor-pointer transition-all"
              >
                ANNULEREN
              </button>
              <button
                type="button"
                onClick={handleClearAllAnalyticsData}
                disabled={isClearingAnalytics}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 border-2 border-black text-white font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer flex items-center gap-2 transition-all"
              >
                {isClearingAnalytics ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>WISSEN BEZIG...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>JA, WIS ALLE STATISTIEKEN</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
