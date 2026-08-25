import React, { useState } from 'react';
import { PageRoute } from '../types';
import { saveTeam } from '../utils/storage';
import { CheckCircle2, Users } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SignUpPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const [teamName, setTeamName] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [captainEmail, setCaptainEmail] = useState('');
  const [members, setMembers] = useState<string[]>(['', '', '', '']);

  const [submittedTeam, setSubmittedTeam] = useState<{
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!teamName.trim() || !captainName.trim() || !captainEmail.trim()) {
      alert('Vul a.u.b. alle verplichte velden in.');
      return;
    }

    const filteredMembers = members.map((m) => m.trim()).filter(Boolean);
    if (filteredMembers.length !== 4) {
      alert('Een team moet uit exact 4 deelnemers bestaan. Vul alle 4 de teamleden in.');
      return;
    }

    // Save team to database / localStorage
    saveTeam({
      name: teamName.toUpperCase(),
      aanvoerder: captainName,
      email: captainEmail,
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
      name: teamName.toUpperCase(),
      email: captainEmail,
    });

    showToast('Team ingeschreven!');
  };

  const handleResetForm = () => {
    setTeamName('');
    setCaptainName('');
    setCaptainEmail('');
    setMembers(['', '', '', '']);
    setSubmittedTeam(null);
  };

  return (
    <div className="bg-white text-black min-h-screen">
      {/* 1. YELLOW HEADER SECTION */}
      <section className="bg-amber-400 border-b-2 border-black py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="font-display font-black text-xs sm:text-sm tracking-widest uppercase block text-black mb-2">
            INSCHRIJVEN
          </span>
          <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight uppercase leading-none mb-4 text-black">
            MELD JE <span className="text-stroke-black">TEAM AAN</span>
          </h1>
          <p className="text-xs sm:text-sm text-black font-semibold max-w-2xl">
            Vijf spelen, één Gouden Badeend. Vul het formulier in en je team verschijnt direct op de deelnemerspagina.
          </p>
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

                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-8 max-w-lg">
                  Bevestiging gaat naar <strong className="text-black font-bold">{submittedTeam.email}</strong>. Tot 3 april 2027 – train die armen, poets dat dienblad.
                </p>

                <div className="flex flex-wrap gap-3">
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
                <div>
                  <label className="block font-display font-black text-xs uppercase tracking-wider text-black mb-2">
                    TEAMNAAM *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="bijv. DE TESTEENDEN"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-black text-sm font-bold text-black focus:outline-none uppercase"
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
                      placeholder="bijv. E2E Tester"
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
                      placeholder="e2e@test.nl"
                      value={captainEmail}
                      onChange={(e) => setCaptainEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-black text-sm font-bold text-black focus:outline-none"
                    />
                  </div>
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
          <div className="lg:col-span-5">
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
                    Teams bestaan uit <strong>exact 4 deelnemers</strong>. Teamnaam moet uniek zijn.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-display font-black text-amber-400 text-sm shrink-0">
                    02
                  </span>
                  <p className="leading-relaxed">
                    Inschrijven is gratis en kan tot 1 maart 2027.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-display font-black text-amber-400 text-sm shrink-0">
                    03
                  </span>
                  <p className="leading-relaxed">
                    Je aanvoerder ontvangt alle praktische info per e-mail.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-display font-black text-amber-400 text-sm shrink-0">
                    04
                  </span>
                  <p className="leading-relaxed">
                    Alle 5 de geheime spelen tellen mee – bereid je voor op alles.
                  </p>
                </div>
              </div>
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
