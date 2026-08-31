import React, { useState } from 'react';
import { PageRoute } from '../types';
import { ADMIN_CREDENTIALS } from '../data/mockData';
import {
  setAdminSession,
  setTeamSession,
  authenticateTeam,
  authenticateAdmin,
} from '../utils/storage';
import {
  ShieldAlert,
  Users,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: PageRoute) => void;
  initialTab?: 'team' | 'organisatie';
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigate,
  initialTab = 'team',
}) => {
  const [activeTab, setActiveTab] = useState<'team' | 'organisatie'>(initialTab);

  // Form states
  const [emailOrTeam, setEmailOrTeam] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const inputIdentifier = emailOrTeam.trim().toLowerCase();
    const inputPassword = password;

    if (!inputIdentifier || !inputPassword) {
      setErrorMessage('Vul zowel je e-mail/teamnaam als wachtwoord in.');
      return;
    }

    // 1. Check if it's the Admin credentials
    const isAdminValid = await authenticateAdmin(inputIdentifier, inputPassword);

    if (isAdminValid) {
      setAdminSession(true);
      showToast('Ingelogd als organisatie');
      setTimeout(() => {
        onNavigate('scorebeheer');
      }, 300);
      return;
    }

    // If tab is organisatie and credentials don't match
    if (activeTab === 'organisatie') {
      setErrorMessage('Onjuist e-mailadres of wachtwoord voor de organisatie.');
      return;
    }

    // 2. Check Team credentials with SHA-256 verification
    const authResult = await authenticateTeam(inputIdentifier, inputPassword);

    if (authResult.success && authResult.team) {
      setTeamSession(authResult.team);
      showToast(`Welkom terug, ${authResult.team.name}!`);
      setTimeout(() => {
        onNavigate('team-portal');
      }, 300);
      return;
    }

    setErrorMessage(
      authResult.message ||
        'Geen team gevonden met deze combinatie van e-mail/teamnaam en wachtwoord. Controleer je gegevens of meld je team aan.'
    );
  };

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Header */}
      <section className="bg-black text-white border-b-2 border-black py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="text-sky-400 font-display font-black text-xs sm:text-sm tracking-widest uppercase block mb-2">
            TOEGANGSPORTAAL
          </span>
          <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl text-amber-400 tracking-tight uppercase leading-none mb-4">
            INLOGGEN
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-semibold max-w-xl">
            Log in als deelnemend team om jullie teamleden en gegevens te beheren, of als wedstrijdleiding voor scorebeheer.
          </p>
        </div>
      </section>

      {/* Main Login Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="max-w-xl mx-auto">
          {/* Tab Selector */}
          <div className="grid grid-cols-2 border-2 border-black mb-6 bg-slate-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('team');
                setErrorMessage(null);
              }}
              className={`py-3.5 px-4 font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all ${
                activeTab === 'team'
                  ? 'bg-amber-400 text-black'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Users size={16} />
              TEAM INLOGGEN
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('organisatie');
                setErrorMessage(null);
                if (emailOrTeam === '') setEmailOrTeam(ADMIN_CREDENTIALS.email);
              }}
              className={`py-3.5 px-4 font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all border-l-2 border-black ${
                activeTab === 'organisatie'
                  ? 'bg-black text-amber-400'
                  : 'bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ShieldAlert size={16} />
              ORGANISATIE
            </button>
          </div>

          {/* Login Card */}
          <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-100">
              <div
                className={`w-10 h-10 border-2 border-black flex items-center justify-center ${
                  activeTab === 'organisatie'
                    ? 'bg-black text-amber-400'
                    : 'bg-amber-400 text-black'
                }`}
              >
                {activeTab === 'organisatie' ? <ShieldAlert size={20} /> : <Users size={20} />}
              </div>
              <div>
                <h2 className="font-display font-black text-xl uppercase tracking-tight text-black">
                  {activeTab === 'organisatie'
                    ? 'ORGANISATIE / SCOREBEHEER'
                    : 'TEAMPORTAAL INLOGGEN'}
                </h2>
                <p className="text-xs font-semibold text-slate-500">
                  {activeTab === 'organisatie'
                    ? 'Toegang tot juryscores en teamverwijdering'
                    : 'Pas je teamnaam, aanvoerder of 4 leden aan'}
                </p>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-500 text-rose-800 text-xs font-bold flex items-start gap-2.5">
                <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                <div>{errorMessage}</div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Identifier */}
              <div>
                <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-2 flex items-center justify-between">
                  <span>
                    {activeTab === 'organisatie'
                      ? 'E-MAILADRES ORGANISATIE *'
                      : 'E-MAILADRES AANVOERDER OF TEAMNAAM *'}
                  </span>
                  <Mail size={14} className="text-slate-400" />
                </label>
                <input
                  type={activeTab === 'organisatie' ? 'email' : 'text'}
                  required
                  placeholder={
                    activeTab === 'organisatie'
                      ? 'l.verbrugge219@gmail.com'
                      : 'bijv. kapitein.kwak@badeendmail.nl of DE KWAKELITEITEN'
                  }
                  value={emailOrTeam}
                  onChange={(e) => setEmailOrTeam(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-black text-sm font-bold text-black focus:outline-none focus:bg-amber-50/50"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-2 flex items-center justify-between">
                  <span>WACHTWOORD *</span>
                  <Lock size={14} className="text-slate-400" />
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={
                      activeTab === 'organisatie'
                        ? 'Wachtwoord organisatie'
                        : 'Wachtwoord van je team'
                    }
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 bg-white border-2 border-black text-sm font-bold text-black focus:outline-none focus:bg-amber-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-4 border-2 border-black font-display font-black text-sm sm:text-base uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  activeTab === 'organisatie'
                    ? 'bg-black text-white hover:bg-slate-900'
                    : 'bg-amber-400 text-black hover:bg-amber-300'
                }`}
              >
                <span>
                  {activeTab === 'organisatie'
                    ? 'INLOGGEN ALS ORGANISATIE'
                    : 'INLOGGEN BIJ TEAM'}
                </span>
                <ArrowRight size={18} />
              </button>
            </form>

            {/* Bottom Links */}
            <div className="mt-8 pt-6 border-t-2 border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-600">
              {activeTab === 'team' ? (
                <>
                  <span>Nog geen team aangemeld?</span>
                  <button
                    onClick={() => onNavigate('inschrijven')}
                    className="text-black font-display font-black uppercase tracking-wider underline hover:text-amber-600 cursor-pointer"
                  >
                    MELD JE TEAM HIER AAN →
                  </button>
                </>
              ) : (
                <div className="w-full text-center text-slate-500 text-[11px]">
                  Scouting Van Brederode Wedstrijdcommissie · Badeendlympics 2027
                </div>
              )}
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
