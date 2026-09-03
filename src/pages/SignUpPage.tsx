import React, { useState } from 'react';
import { PageRoute } from '../types';
import { saveTeam, setTeamSession } from '../utils/storage';
import { CheckCircle2, Users, Mail, ShieldAlert, Lock, Eye, EyeOff, AlertCircle, ArrowRight, UserCheck, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SignUpPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const [teamName, setTeamName] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [captainEmail, setCaptainEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [members, setMembers] = useState<string[]>(['', '', '', '']);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [submittedTeam, setSubmittedTeam] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleMemberChange = (index: number, value: string) => {
    const next = [...members];
    next[index] = value;
    setMembers(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!teamName.trim() || !captainName.trim() || !captainEmail.trim()) {
      setErrorMessage('Vul a.u.b. alle verplichte velden in.');
      return;
    }

    if (!password) {
      setErrorMessage('Kies een wachtwoord voor jullie teamaccount.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Het wachtwoord moet minimaal 4 tekens lang zijn.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('De wachtwoorden komen niet overeen.');
      return;
    }

    const filteredMembers = members.map((m) => m.trim()).filter(Boolean);
    if (filteredMembers.length !== 4) {
      setErrorMessage('Een team moet uit exact 4 deelnemers bestaan. Vul alle 4 de teamleden in.');
      return;
    }

    // Save team to database / localStorage (password will be automatically SHA-256 hashed)
    const newTeam = await saveTeam({
      name: teamName.toUpperCase(),
      aanvoerder: captainName,
      email: captainEmail,
      password: password,
      members: filteredMembers,
    });

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FACC15', '#0284C7', '#000000'],
      });
    } catch {
      // ignore
    }

    setSubmittedTeam({
      id: newTeam.id,
      name: newTeam.name,
      email: newTeam.email,
    });

    // Automatically set team session so they can go to team portal directly
    setTeamSession(newTeam);

    showToast('Team ingeschreven!');
  };

  const handleResetForm = () => {
    setTeamName('');
    setCaptainName('');
    setCaptainEmail('');
    setPassword('');
    setConfirmPassword('');
    setMembers(['', '', '', '']);
    setErrorMessage(null);
    setSubmittedTeam(null);
  };

  return (
    <div className="bg-white text-black min-h-screen">
      {/* 1. YELLOW HEADER SECTION */}
      <section className="bg-amber-400 border-b-2 border-black py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="font-display font-black text-xs sm:text-sm tracking-widest uppercase block text-black mb-2">
              INSCHRIJVEN
            </span>
            <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight uppercase leading-none mb-4 text-black">
              MELD JE <span className="text-stroke-black">TEAM AAN</span>
            </h1>
            <p className="text-xs sm:text-sm text-black font-semibold max-w-2xl">
              Vijf spelen, exact 4 strijders (18+), strijden om een welverdiende goudgele rakker en eeuwige roem. Kies direct een teamwachtwoord om later jullie gegevens en leden te kunnen beheren.
            </p>
          </div>

          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black shrink-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Al ingeschreven?
            </span>
            <button
              onClick={() => onNavigate('login')}
              className="inline-flex items-center gap-1.5 font-display font-black text-xs uppercase tracking-wider text-black hover:text-sky-600 cursor-pointer"
            >
              <Lock size={14} /> INLOGGEN BIJ TEAMPORTAAL →
            </button>
          </div>
        </div>
      </section>

      {/* 2. BODY CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Form or Success Card */}
          <div className="lg:col-span-7">
            {submittedTeam ? (
              /* Success Confirmation Card */
              <div className="bg-white border-2 border-black p-6 sm:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-12 h-12 rounded-full border-2 border-black bg-sky-400 flex items-center justify-center mb-6">
                  <CheckCircle2 size={28} className="text-black" />
                </div>

                <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-black mb-4">
                  TEAM {submittedTeam.name} IS ERBIJ!
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6 max-w-lg">
                  Bevestiging gaat naar <strong className="text-black font-bold">{submittedTeam.email}</strong>. Je kunt nu op elk gewenst moment inloggen om jullie teamnaam, contactgegevens of de 4 teamleden aan te passen.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => onNavigate('team-portal')}
                    className="px-6 py-3.5 bg-amber-400 text-black border-2 border-black font-display font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 cursor-pointer flex items-center gap-2"
                  >
                    BEKIJK TEAMPORTAAL <ArrowRight size={16} />
                  </button>
                  <button
                    onClick={() => onNavigate('deelnemers')}
                    className="px-6 py-3.5 bg-black text-white border-2 border-black font-display font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-900 cursor-pointer"
                  >
                    BEKIJK ALLE DEELNEMERS
                  </button>
                  <button
                    onClick={handleResetForm}
                    className="px-6 py-3.5 bg-white text-black border-2 border-black font-display font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 cursor-pointer"
                  >
                    NOG EEN TEAM INSCHRIJVEN
                  </button>
                </div>
              </div>
            ) : (
              /* Registration Form */
              <form
                onSubmit={handleSubmit}
                className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6"
              >
                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-4 bg-rose-50 border-2 border-rose-500 text-rose-800 text-xs font-bold flex items-start gap-2.5">
                    <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                    <div>{errorMessage}</div>
                  </div>
                )}

                <div>
                  <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-2">
                    TEAMNAAM *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="bijv. DE KWAKELITEITEN"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-black text-sm font-bold text-black focus:outline-none uppercase placeholder:normal-case"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-2">
                      AANVOERDER NAAM *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="bijv. Jan Jansen"
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
                      placeholder="bijv. jan.jansen@voorbeeld.nl"
                      value={captainEmail}
                      onChange={(e) => setCaptainEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-black text-sm font-bold text-black focus:outline-none"
                    />
                  </div>
                </div>

                {/* Team Password Setup */}
                <div className="p-4 sm:p-5 bg-slate-50 border-2 border-black space-y-4">
                  <div className="flex items-center gap-2">
                    <Lock size={16} className="text-amber-500" />
                    <span className="font-display font-black text-xs uppercase tracking-wider text-black">
                      TEAM INLOGWACHTWOORD MAKEN *
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    Kies een wachtwoord voor jullie teamaccount. Hiermee kunnen jullie later inloggen om de teamnaam, contactgegevens en 4 teamleden te wijzigen.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1.5">
                        Wachtwoord *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Min. 4 tekens"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-2.5 pr-10 bg-white border-2 border-black text-xs sm:text-sm font-semibold text-black focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black cursor-pointer p-1"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1.5">
                        Herhaal wachtwoord *
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Herhaal wachtwoord"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border-2 border-black text-xs sm:text-sm font-semibold text-black focus:outline-none"
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
                    <Lock size={12} className="text-emerald-600 shrink-0" />
                    <span>Wachtwoorden worden cryptografisch beveiligd (SHA-256 hash) opgeslagen.</span>
                  </p>
                </div>

                {/* Team Members List (Exact 4) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-display font-black text-xs uppercase tracking-wider text-black">
                      TEAMLEDEN (EXACT 4 DEELNEMERS) *
                    </label>
                    <span className="text-[11px] font-black text-amber-600 bg-amber-100 border border-amber-300 px-2 py-0.5 uppercase tracking-wider">
                      4 SPELERS VEREIST
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
                          placeholder={`Volledige naam teamlid ${idx + 1}`}
                          value={member}
                          onChange={(e) => handleMemberChange(idx, e.target.value)}
                          className="flex-1 px-4 py-2.5 bg-white border-2 border-black text-xs sm:text-sm font-semibold text-black focus:outline-none placeholder:text-slate-400"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-amber-400 border-2 border-black font-display font-black text-base uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                >
                  MELD TEAM AAN (4 LEDEN) →
                </button>
              </form>
            )}
          </div>

          {/* Right Column: "GOED OM TE WETEN" Black Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-black text-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400">
                  <Users size={16} />
                </div>
                <h3 className="font-display font-black text-xl uppercase tracking-tight text-white">
                  GOED OM TE WETEN
                </h3>
              </div>

              <div className="space-y-4 text-xs font-semibold text-slate-300">
                <div className="flex items-start gap-3">
                  <span className="font-display font-black text-amber-400 text-sm shrink-0">
                    01
                  </span>
                  <p className="leading-relaxed">
                    Ieder teamlid moet <strong>18+ zijn voor deelname</strong>. Teams bestaan uit exact 4 deelnemers.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-display font-black text-amber-400 text-sm shrink-0">
                    02
                  </span>
                  <p className="leading-relaxed">
                    Inschrijven is gratis. Er is <strong>geen maximum aantal teams</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-display font-black text-amber-400 text-sm shrink-0">
                    03
                  </span>
                  <p className="leading-relaxed">
                    <strong>Teamkleding wordt sterk aangemoedigd!</strong> Trek jullie meest originele en opvallende outfits aan.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-display font-black text-amber-400 text-sm shrink-0">
                    04
                  </span>
                  <p className="leading-relaxed">
                    De disciplines worden de komende tijd bekendgemaakt.
                  </p>
                </div>
              </div>
            </div>

            {/* Jury Sign Up Box */}
            <div className="bg-amber-400 border-2 border-black p-6 sm:p-7 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-black text-amber-400 border border-black flex items-center justify-center font-black">
                  <Award size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/70 block">
                    VRIJWILLIGERS GEZOCHT
                  </span>
                  <h3 className="font-display font-black text-xl uppercase tracking-tight text-black leading-none">
                    JURY WORDEN?
                  </h3>
                </div>
              </div>

              <p className="text-xs font-semibold text-black/90 leading-relaxed mb-4">
                Wil je niet deelnemen met een team, maar wel onderdeel zijn van de legendarische BADEENDLYMPICS 2027? Meld je direct online aan als vrijwillig jurylid!
              </p>

              <div className="bg-white border-2 border-black p-3.5 mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Aanmelden via de website:
                </span>
                <p className="text-xs font-bold text-slate-900 leading-snug">
                  Kies je eigen badeend-avatar, stel je juryprofiel in en jureer mee op 3 april 2027.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('jury-aanmelden')}
                className="w-full py-3.5 bg-black text-white border-2 border-black font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-slate-900 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              >
                <UserCheck size={16} className="text-amber-400" />
                AANMELDEN VIA DE JURYPAGINA →
              </button>
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
