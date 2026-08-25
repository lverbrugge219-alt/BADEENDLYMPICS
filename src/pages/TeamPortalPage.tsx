import React, { useState, useEffect } from 'react';
import { PageRoute, Team, ScoreEntry } from '../types';
import {
  getTeamSession,
  setTeamSession,
  updateTeam,
  getStoredScores,
  recalculateTeamTotals,
  getStoredTeams,
} from '../utils/storage';
import { SPELEN } from '../data/mockData';
import {
  Users,
  LogOut,
  Save,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
} from 'lucide-react';

interface TeamPortalPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const TeamPortalPage: React.FC<TeamPortalPageProps> = ({ onNavigate }) => {
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);

  // Form states
  const [teamName, setTeamName] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [captainEmail, setCaptainEmail] = useState('');
  const [members, setMembers] = useState<string[]>(['', '', '', '']);

  // Password change state
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number | null>>({});
  const [totaal, setTotaal] = useState<number>(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const loadTeamData = () => {
    const sessionTeam = getTeamSession();
    if (!sessionTeam) {
      return;
    }

    const allTeams = getStoredTeams();
    const freshTeam = allTeams.find((t) => t.id === sessionTeam.id) || sessionTeam;
    const allScores: ScoreEntry[] = getStoredScores();
    const calculated = recalculateTeamTotals([freshTeam], allScores);
    const enriched = calculated[0] || freshTeam;

    setCurrentTeam(enriched);
    setTeamName(enriched.name);
    setCaptainName(enriched.aanvoerder);
    setCaptainEmail(enriched.email);
    setMembers(
      enriched.members.length === 4
        ? [...enriched.members]
        : [
            enriched.members[0] || '',
            enriched.members[1] || '',
            enriched.members[2] || '',
            enriched.members[3] || '',
          ]
    );
    setScores(enriched.scores || {});
    setTotaal(enriched.totaal || 0);
  };

  useEffect(() => {
    loadTeamData();
    window.addEventListener('badeendlympics_data_change', loadTeamData);
    window.addEventListener('badeendlympics_auth_change', loadTeamData);
    return () => {
      window.removeEventListener('badeendlympics_data_change', loadTeamData);
      window.removeEventListener('badeendlympics_auth_change', loadTeamData);
    };
  }, []);

  const handleMemberChange = (index: number, val: string) => {
    const next = [...members];
    next[index] = val;
    setMembers(next);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentTeam) return;

    if (!teamName.trim() || !captainName.trim() || !captainEmail.trim()) {
      setErrorMessage('Vul alle verplichte velden in.');
      return;
    }

    const filteredMembers = members.map((m) => m.trim()).filter(Boolean);
    if (filteredMembers.length !== 4) {
      setErrorMessage('Een team moet exact 4 teamleden hebben. Vul alle 4 de namen in.');
      return;
    }

    let updatedPassword = currentTeam.password;
    if (showPasswordChange && newPassword) {
      if (newPassword.length < 4) {
        setErrorMessage('Het nieuwe wachtwoord moet minimaal 4 tekens lang zijn.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMessage('De nieuwe wachtwoorden komen niet overeen.');
        return;
      }
      updatedPassword = newPassword;
    }

    const res = updateTeam(currentTeam.id, {
      name: teamName.toUpperCase(),
      aanvoerder: captainName,
      email: captainEmail,
      members: filteredMembers,
      password: updatedPassword,
    });

    if (res) {
      setCurrentTeam(res);
      setTeamSession(res);
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordChange(false);
      showToast('Teamgegevens succesvol opgeslagen!');
    }
  };

  const handleLogout = () => {
    setTeamSession(null);
    onNavigate('home');
  };

  if (!currentTeam) {
    return (
      <div className="bg-white text-black min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto bg-white border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
          <div className="w-12 h-12 bg-amber-400 border-2 border-black flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-black" />
          </div>
          <h2 className="font-display font-black text-2xl uppercase tracking-tight mb-2">
            NIET INGELOGD
          </h2>
          <p className="text-xs text-slate-600 font-semibold mb-6">
            Log eerst in met je team-account om jullie gegevens te bekijken en wijzigen.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="w-full py-3.5 bg-black text-white border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-slate-800 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            NAAR INLOGGEN →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Header */}
      <section className="bg-amber-400 border-b-2 border-black py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <span className="font-display font-black text-xs tracking-widest uppercase block text-black mb-1">
              TEAM BEHEERPORTAAL
            </span>
            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl uppercase tracking-tight leading-none text-black">
              {currentTeam.name}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-black/80 mt-2">
              Aanvoerder: <strong className="text-black">{currentTeam.aanvoerder}</strong> ({currentTeam.email})
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={() => onNavigate('scores')}
              className="px-4 py-2.5 bg-white text-black border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-slate-50 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              LIVE STAND BEKIJKEN
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-black text-white border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-slate-900 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <LogOut size={14} /> UITLOGGEN
            </button>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-slate-100">
                <div className="flex items-center gap-2.5">
                  <UserCheck size={22} className="text-amber-500" />
                  <h2 className="font-display font-black text-xl uppercase tracking-tight text-black">
                    TEAMGEGEVENS WIJZIGEN
                  </h2>
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider bg-slate-100 border border-slate-300 px-2 py-1 text-slate-700">
                  ID: {currentTeam.id}
                </span>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-500 text-rose-800 text-xs font-bold flex items-start gap-2.5">
                  <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                  <div>{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-6">
                {/* Team Name */}
                <div>
                  <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-2">
                    TEAMNAAM *
                  </label>
                  <input
                    type="text"
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-black text-sm font-bold text-black focus:outline-none uppercase"
                  />
                </div>

                {/* Captain details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-2">
                      AANVOERDER NAAM *
                    </label>
                    <input
                      type="text"
                      required
                      value={captainName}
                      onChange={(e) => setCaptainName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-black text-sm font-bold text-black focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-2">
                      E-MAILADRES AANVOERDER *
                    </label>
                    <input
                      type="email"
                      required
                      value={captainEmail}
                      onChange={(e) => setCaptainEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-black text-sm font-bold text-black focus:outline-none"
                    />
                  </div>
                </div>

                {/* 4 Team Members */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-display font-black text-xs uppercase tracking-wider text-black">
                      4 TEAMLEDEN *
                    </label>
                    <span className="text-[11px] font-black text-amber-600 bg-amber-100 border border-amber-300 px-2 py-0.5 uppercase tracking-wider">
                      EXACT 4 SPELERS
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {members.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-8 h-10 bg-amber-400 border-2 border-black font-display font-black text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <input
                          type="text"
                          required
                          placeholder={`Naam teamlid ${idx + 1}`}
                          value={member}
                          onChange={(e) => handleMemberChange(idx, e.target.value)}
                          className="flex-1 px-4 py-2.5 bg-white border-2 border-black text-xs sm:text-sm font-semibold text-black focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Change Password toggle */}
                <div className="pt-2 border-t-2 border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowPasswordChange(!showPasswordChange)}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 hover:text-black cursor-pointer"
                  >
                    <Lock size={14} className="text-amber-500" />
                    <span>
                      {showPasswordChange
                        ? 'ANNULEER WACHTWOORD WIJZIGEN'
                        : 'WACHTWOORD VOOR TEAM WIJZIGEN'}
                    </span>
                  </button>

                  {showPasswordChange && (
                    <div className="mt-3 p-4 bg-slate-50 border-2 border-black space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                            Nieuw Wachtwoord
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Minimaal 4 tekens"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-semibold text-black focus:outline-none pr-9"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black p-1"
                            >
                              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                            Herhaal Nieuw Wachtwoord
                          </label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Herhaal wachtwoord"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-white border-2 border-black text-xs font-semibold text-black focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-amber-400 border-2 border-black font-display font-black text-base uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  WIJZIGINGEN OPSLAAN
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Live Scores & Team Overview */}
          <div className="lg:col-span-5 space-y-6">
            {/* Scorecard */}
            <div className="bg-black text-white border-2 border-black p-6 sm:p-7 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Trophy size={20} className="text-amber-400" />
                  <h3 className="font-display font-black text-lg uppercase tracking-tight text-white">
                    JULLIE SCORESTATUS
                  </h3>
                </div>
                <div className="font-display font-black text-2xl text-amber-400">
                  {totaal}{' '}
                  <span className="text-xs font-bold font-sans text-slate-400">ptn</span>
                </div>
              </div>

              <div className="space-y-2">
                {SPELEN.map((spel) => {
                  const pts = scores[spel.id];
                  return (
                    <div
                      key={spel.id}
                      className="flex items-center justify-between py-2 border-b border-slate-800 text-xs font-semibold"
                    >
                      <span className="text-slate-300 uppercase">{spel.name}</span>
                      <span className="font-display font-black text-sm text-white">
                        {pts !== null && pts !== undefined ? `${pts} ptn` : '—'}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed font-medium">
                Scores worden tijdens het toernooi op 3 april 2027 live ingevoerd door de jury.
              </div>
            </div>

            {/* Practical Guidelines for the Team */}
            <div className="bg-slate-50 border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-display font-black text-base uppercase tracking-tight text-black mb-3 flex items-center gap-2">
                <Users size={16} /> TEAM INSTRUCTIES
              </h3>
              <ul className="space-y-2 text-xs font-semibold text-slate-700 list-disc list-inside leading-relaxed">
                <li>Zorg dat alle 4 de teamleden aanwezig zijn om 13:00 uur.</li>
                <li>Wijzigingen in je teamleden kunnen tot 1 uur voor aanvang worden doorgevoerd.</li>
                <li>Ieder teamlid ontvangt bij aanmelding een officiële toernooisticker.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border-2 border-black px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2.5 text-xs font-black uppercase tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={18} className="text-black fill-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
