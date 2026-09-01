import React, { useState, useEffect, useRef } from 'react';
import { PageRoute, JuryMember, PresetAvatarId } from '../types';
import {
  getStoredJuryMembers,
  saveJuryMember,
  getJurySession,
} from '../utils/storage';
import { PRESET_AVATARS } from '../data/juryAvatars';
import { compressImageFile, CompressionResult } from '../utils/imageCompressor';
import { JuryAvatar } from '../components/JuryAvatar';
import {
  Shield,
  Award,
  Sparkles,
  UserCheck,
  UserPlus,
  Search,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Quote,
  Eye,
  Lock,
  Mail,
  User,
  HeartHandshake,
  ArrowRight,
  Flame,
  Clock,
  HelpCircle,
  FileCheck,
  Crown,
  Star,
} from 'lucide-react';

interface JuryPageProps {
  onNavigate: (page: PageRoute) => void;
  openSignUpInitially?: boolean;
}

export const JuryPage: React.FC<JuryPageProps> = ({
  onNavigate,
  openSignUpInitially = false,
}) => {
  const [juryMembers, setJuryMembers] = useState<JuryMember[]>([]);
  const [activeJurySession, setActiveJurySession] = useState<JuryMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSignUpModal, setShowSignUpModal] = useState(openSignUpInitially);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [scoutingAffiliation, setScoutingAffiliation] = useState('');
  const [avatarType, setAvatarType] = useState<'preset' | 'custom'>('preset');
  const [avatarPresetId, setAvatarPresetId] = useState<PresetAvatarId>('duck-referee');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [compressionInfo, setCompressionInfo] = useState<CompressionResult | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const refreshData = () => {
    setJuryMembers(getStoredJuryMembers());
    setActiveJurySession(getJurySession());
  };

  useEffect(() => {
    refreshData();

    const handleDataChange = () => refreshData();
    const handleAuthChange = () => refreshData();

    window.addEventListener('badeendlympics_data_change', handleDataChange);
    window.addEventListener('badeendlympics_auth_change', handleAuthChange);

    return () => {
      window.removeEventListener('badeendlympics_data_change', handleDataChange);
      window.removeEventListener('badeendlympics_auth_change', handleAuthChange);
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Selecteer a.u.b. een geldig afbeeldingsbestand (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsCompressing(true);
      setFormError(null);
      const result = await compressImageFile(file, 360, 0.82);
      setCompressionInfo(result);
      setUploadedPhotoUrl(result.dataUrl);
      setAvatarType('custom');
    } catch (err: any) {
      setFormError(err?.message || 'Fout bij het comprimeren van de foto.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Vul je naam in.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Vul een geldig e-mailadres in.');
      return;
    }
    if (!password.trim() || password.length < 4) {
      setFormError('Kies een wachtwoord van minimaal 4 tekens om later in te kunnen loggen.');
      return;
    }

    if (avatarType === 'custom' && !uploadedPhotoUrl) {
      setFormError('Upload a.u.b. een eigen foto of kies een van de badeend-avatars.');
      return;
    }

    try {
      setIsSubmitting(true);
      const savedName = name.trim();
      await saveJuryMember({
        name: savedName,
        email: email.trim().toLowerCase(),
        password: password.trim(),
        isHeadJury: false,
        isOrganizer: false,
        bioQuote: 'Klaar voor de Badeendlympics 2027!',
        scoutingAffiliation: scoutingAffiliation.trim() || 'Scouting',
        avatarType,
        avatarPresetId: avatarType === 'preset' ? avatarPresetId : undefined,
        photoUrl: avatarType === 'custom' && uploadedPhotoUrl ? uploadedPhotoUrl : undefined,
        status: 'active',
        favoriteSpel: 'all',
      });

      // Close modal immediately, reset fields, and show success toast
      setShowSignUpModal(false);
      setName('');
      setEmail('');
      setPassword('');
      setScoutingAffiliation('');
      setUploadedPhotoUrl(null);
      setCompressionInfo(null);
      refreshData();
      showToast(`Aanmelding geslaagd! Welkom bij het juryteam, ${savedName}!`);
    } catch (err: any) {
      console.error('Error during jury registration:', err);
      setFormError(err?.message || 'Er ging iets mis bij het opslaan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredJury = juryMembers.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      (m.scoutingAffiliation && m.scoutingAffiliation.toLowerCase().includes(q)) ||
      (m.isHeadJury && 'hoofd hoofdjury leiding'.includes(q)) ||
      (m.isOrganizer && 'organisator organisatie org'.includes(q))
    );
  });

  return (
    <div className="bg-slate-50 text-black min-h-screen">
      {/* Hero Header */}
      <section className="bg-black text-white border-b-2 border-black py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background accent decorations */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none hidden md:block">
          <Award size={360} className="text-amber-400" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 bg-amber-400 text-black px-3 py-1 text-xs font-display font-black tracking-wider uppercase border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
              <Shield size={14} />
              <span>OFFICIËLE WEDSTRIJDCOMMISSIE</span>
            </div>

            {activeJurySession ? (
              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 px-4 py-2 text-xs">
                <span className="text-slate-300">
                  Ingelogd als: <strong className="text-amber-400">{activeJurySession.name}</strong>
                </span>
                <button
                  onClick={() => onNavigate('jury-portal')}
                  className="bg-amber-400 text-black px-3 py-1 font-display font-black uppercase text-[11px] hover:bg-amber-300 transition-colors cursor-pointer"
                >
                  BEWERK MIJN PROFIEL
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="text-xs text-slate-300 hover:text-amber-400 font-bold underline transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Lock size={13} />
                <span>Al aangemeld als jurylid? Log hier in</span>
              </button>
            )}
          </div>

          <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-amber-400 tracking-tight uppercase leading-none mb-4">
            DE VRIJWILLIGE JURY
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl font-medium leading-relaxed mb-8">
            Geen Badeendlympics 2027 zonder strenge doch rechtvaardige jury! Ontmoet onze officiële Badeendlympics juryleden of meld je zelf aan als vrijwillig jurylid voor 3 april 2027.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setShowSignUpModal(true)}
              className="bg-amber-400 text-black font-display font-black text-xs sm:text-sm uppercase tracking-wider px-6 py-3.5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:bg-amber-300 hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer flex items-center gap-2"
            >
              <UserPlus size={18} />
              <span>AANMELDEN ALS JURYLID</span>
            </button>

            <a
              href="#jury-leden"
              className="bg-zinc-900 text-white hover:bg-zinc-800 font-display font-black text-xs sm:text-sm uppercase tracking-wider px-5 py-3.5 border-2 border-white transition-all cursor-pointer flex items-center gap-2"
            >
              <Eye size={16} />
              <span>BEKIJK ALLE JURYLEDEN ({juryMembers.length})</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Body */}
      <div id="jury-leden" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Zoek op naam, rol of scoutinggroep"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-black text-xs sm:text-sm font-bold text-black focus:outline-none focus:bg-amber-50/50"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs font-black uppercase text-slate-600 px-2">
              <span className="text-amber-500 font-black text-sm">{filteredJury.length}</span>{' '}
              {filteredJury.length === 1 ? 'Jurylid' : 'Juryleden'}
            </div>
            <button
              onClick={() => setShowSignUpModal(true)}
              className="bg-black text-amber-400 hover:text-white px-4 py-2.5 text-xs font-display font-black uppercase tracking-wider flex items-center gap-2 border-2 border-black transition-colors cursor-pointer shrink-0"
            >
              <UserPlus size={14} />
              <span>+ ZELF MEEDOEN</span>
            </button>
          </div>
        </div>

        {/* Jury Members Grid */}
        {filteredJury.length === 0 ? (
          <div className="bg-white border-2 border-black p-12 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="w-16 h-16 bg-amber-100 border-2 border-black mx-auto flex items-center justify-center mb-4">
              <User size={32} className="text-slate-500" />
            </div>
            <h3 className="font-display font-black text-xl uppercase mb-2">
              Geen juryleden gevonden
            </h3>
            <p className="text-xs font-semibold text-slate-500 max-w-md mx-auto mb-6">
              Er zijn geen juryleden die matchen met je zoekopdracht "{searchQuery}". Wees de eerste om je aan te melden!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSignUpModal(true);
              }}
              className="bg-amber-400 text-black px-6 py-3 font-display font-black text-xs uppercase border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <UserPlus size={16} />
              <span>MELD JE AAN ALS JURYLID</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJury.map((member) => {
              const isCurrentLoggedIn = activeJurySession?.id === member.id;

              return (
                <div
                  key={member.id}
                  className="bg-white border-2 border-black p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between relative group hover:-translate-y-1 transition-transform"
                >
                  {/* Top Header Card */}
                  <div>
                    <div className="flex items-start gap-4 mb-5">
                      {/* Avatar */}
                      <div className="shrink-0">
                        <JuryAvatar
                          avatarType={member.avatarType}
                          avatarPresetId={member.avatarPresetId}
                          photoUrl={member.photoUrl}
                          size="lg"
                          showBadge={false}
                        />
                      </div>

                      {/* Name & Badges */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          {member.isHeadJury ? (
                            <span className="inline-flex items-center gap-1 bg-amber-400 text-black font-display font-black text-[10px] px-2 py-0.5 uppercase border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                              <Crown size={11} />
                              HOOFD VAN DE JURY
                            </span>
                          ) : null}

                          {member.isOrganizer ? (
                            <span className="inline-flex items-center gap-1 bg-black text-amber-300 font-display font-black text-[10px] px-2 py-0.5 uppercase border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                              <Star size={10} className="fill-amber-300" />
                              ORGANISATOR
                            </span>
                          ) : null}

                          {!member.isHeadJury && !member.isOrganizer ? (
                            <span className="inline-block bg-slate-100 text-slate-800 font-display font-black text-[10px] px-2 py-0.5 uppercase border border-slate-300">
                              OFFICIEEL JURYLID
                            </span>
                          ) : null}

                          {member.avatarType === 'custom' && (
                            <span className="inline-block bg-slate-100 text-slate-700 font-bold text-[9px] px-1.5 py-0.5 uppercase border border-slate-300">
                              FOTO
                            </span>
                          )}
                        </div>

                        <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black truncate">
                          {member.name}
                        </h3>

                        {member.scoutingAffiliation && (
                          <p className="text-[11px] font-bold text-slate-600 mt-1 flex items-center gap-1">
                            <Shield size={12} className="text-slate-400 shrink-0" />
                            <span className="truncate">{member.scoutingAffiliation}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quote */}
                    {member.bioQuote && (
                      <div className="relative pl-6 pr-2 py-2 mb-4 bg-amber-50/60 border-l-4 border-amber-400 text-xs italic font-semibold text-slate-700">
                        <Quote
                          size={14}
                          className="absolute left-1.5 top-2 text-amber-400 not-italic opacity-80"
                        />
                        "{member.bioQuote}"
                      </div>
                    )}
                  </div>

                  {/* Bottom Footer info & Actions */}
                  <div className="pt-4 border-t-2 border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                    <span>
                      Lid sinds{' '}
                      {new Date(member.registeredAt).toLocaleDateString('nl-NL', {
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>

                    {isCurrentLoggedIn ? (
                      <button
                        onClick={() => onNavigate('jury-portal')}
                        className="bg-black text-amber-400 px-3 py-1 text-[11px] font-display font-black uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        MIJN PROFIEL →
                      </button>
                    ) : (
                      <span className="text-amber-500 font-black">★ JURY</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Volunteer Info / FAQ section */}
        <div className="mt-16 bg-white border-2 border-black p-8 sm:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-black text-amber-400 px-3 py-1 text-xs font-display font-black uppercase tracking-wider mb-3">
              <HelpCircle size={14} />
              <span>WAT DOET EEN BADEENDLYMPICS JURYLID?</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black mb-4">
              WORD OOK DEEL VAN DE LEGENDARISCHE JURY!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">
              Als vrijwillig jurylid zorg je voor een badeendtastische sfeer, houd je de eerlijkheid van de 5 spellen in de gaten, beoordeel je teamoutfits en assisteer je bij het scorebord op 3 april 2027.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-50 border-2 border-black p-4">
                <div className="w-8 h-8 bg-amber-400 border border-black flex items-center justify-center font-display font-black mb-2">
                  1
                </div>
                <h4 className="font-display font-black text-xs uppercase mb-1">EERLIJK & GEZELLIG</h4>
                <p className="text-[11px] font-semibold text-slate-600 leading-snug">
                  Je beoordeelt de prestaties van de teams met een knipoog, enthousiasme en scherp oog.
                </p>
              </div>

              <div className="bg-slate-50 border-2 border-black p-4">
                <div className="w-8 h-8 bg-black text-amber-400 border border-black flex items-center justify-center font-display font-black mb-2">
                  2
                </div>
                <h4 className="font-display font-black text-xs uppercase mb-1">CATERING & DRANKJES</h4>
                <p className="text-[11px] font-semibold text-slate-600 leading-snug">
                  Als jurylid word je uiteraard voorzien van de nodige drankjes, hapjes en de afsluitende borrel.
                </p>
              </div>

              <div className="bg-slate-50 border-2 border-black p-4">
                <div className="w-8 h-8 bg-amber-400 border border-black flex items-center justify-center font-display font-black mb-2">
                  3
                </div>
                <h4 className="font-display font-black text-xs uppercase mb-1">EIGEN JURYPROFIEL</h4>
                <p className="text-[11px] font-semibold text-slate-600 leading-snug">
                  Je krijgt een eigen profiel met unieke badeend-avatar of foto op deze officiële website.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowSignUpModal(true)}
              className="bg-amber-400 text-black px-6 py-3.5 font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <UserPlus size={18} />
              <span>DIRECT AANMELDEN ALS VRIJWILLIGE JURY</span>
            </button>
          </div>
        </div>
      </div>

      {/* REGISTRATION MODAL / OVERLAY */}
      {showSignUpModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white border-2 border-black w-full max-w-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-black text-white p-5 border-b-2 border-black flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-400 text-black border-2 border-white flex items-center justify-center">
                  <Award size={20} />
                </div>
                <div>
                  <h2 className="font-display font-black text-lg sm:text-xl uppercase text-amber-400 tracking-tight leading-tight">
                    AANMELDEN ALS VRIJWILLIGE JURY
                  </h2>
                  <p className="text-xs text-slate-300 font-semibold">
                    Stel jezelf voor aan alle deelnemers en bezoekers van Badeendlympics 2027
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSignUpModal(false)}
                className="text-slate-400 hover:text-white p-2 font-display font-black text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {formSuccess ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 border-2 border-black mx-auto flex items-center justify-center">
                    <CheckCircle2 size={36} className="text-emerald-600" />
                  </div>
                  <h3 className="font-display font-black text-2xl uppercase text-black">
                    WELKOM BIJ DE JURY!
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-slate-600 max-w-md mx-auto">
                    Je jury-aanmelding is succesvol opgeslagen! Je profiel is nu zichtbaar op de website en je kunt inloggen met je gekozen wachtwoord.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-6">
                  {formError && (
                    <div className="p-3.5 bg-rose-50 border-2 border-rose-500 text-rose-800 text-xs font-bold flex items-start gap-2.5">
                      <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                      <div>{formError}</div>
                    </div>
                  )}

                  {/* 1. Persoonlijke Gegevens */}
                  <div className="space-y-4">
                    <h4 className="font-display font-black text-xs uppercase tracking-wider text-black border-b border-slate-200 pb-1 flex items-center gap-1.5">
                      <User size={14} className="text-amber-500" />
                      <span>1. PERSOONLIJKE GEGEVENS</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-display font-black text-[11px] uppercase tracking-wider text-black mb-1">
                          VOOR- & ACHTERNAAM *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="bijv. Jan Jansen"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none focus:bg-amber-50/50"
                        />
                      </div>

                      <div>
                        <label className="block font-display font-black text-[11px] uppercase tracking-wider text-black mb-1">
                          E-MAILADRES * (VOOR INLOGGEN)
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="bijv. jan.jansen@voorbeeld.nl"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none focus:bg-amber-50/50"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-display font-black text-[11px] uppercase tracking-wider text-black mb-1">
                          KIES EEN WACHTWOORD *
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="Kies een wachtwoord"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none focus:bg-amber-50/50"
                        />
                      </div>

                      <div>
                        <label className="block font-display font-black text-[11px] uppercase tracking-wider text-black mb-1">
                          SCOUTINGGROEP
                        </label>
                        <input
                          type="text"
                          placeholder="bijv. Scoutinggroep De Vliegende Hollander"
                          value={scoutingAffiliation}
                          onChange={(e) => setScoutingAffiliation(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none focus:bg-amber-50/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Avatar Keuze (Presets of Gecomprimeerde Upload) */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                      <h4 className="font-display font-black text-xs uppercase tracking-wider text-black flex items-center gap-1.5">
                        <Sparkles size={14} className="text-amber-500" />
                        <span>2. AVATAR OF EIGEN FOTO KIEZEN</span>
                      </h4>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                        (Gecomprimeerd opgeslagen)
                      </span>
                    </div>

                    {/* Mode selector */}
                    <div className="grid grid-cols-2 border-2 border-black bg-slate-100">
                      <button
                        type="button"
                        onClick={() => setAvatarType('preset')}
                        className={`py-2.5 px-3 font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors ${
                          avatarType === 'preset'
                            ? 'bg-amber-400 text-black'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Award size={14} />
                        BADEEND AVATARS (10)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAvatarType('custom')}
                        className={`py-2.5 px-3 font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors border-l-2 border-black ${
                          avatarType === 'custom'
                            ? 'bg-amber-400 text-black'
                            : 'bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <Upload size={14} />
                        EIGEN FOTO UPLOADEN
                      </button>
                    </div>

                    {/* Presets Grid */}
                    {avatarType === 'preset' && (
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 bg-slate-100 border-2 border-black">
                        {PRESET_AVATARS.map((preset) => {
                          const isSelected = avatarPresetId === preset.id;
                          return (
                            <button
                              key={preset.id}
                              type="button"
                              onClick={() => setAvatarPresetId(preset.id)}
                              className={`p-2 border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                                isSelected
                                  ? 'border-black bg-amber-200 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                  : 'border-slate-300 bg-white hover:border-black'
                              }`}
                            >
                              <JuryAvatar
                                avatarType="preset"
                                avatarPresetId={preset.id}
                                size="md"
                              />
                              <span className="font-display font-black text-[10px] uppercase text-black leading-tight">
                                {preset.name}
                              </span>
                              <span className="text-[8px] font-bold text-slate-600 leading-none">
                                {preset.badge}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Custom Upload with Compression Preview */}
                    {avatarType === 'custom' && (
                      <div className="p-4 bg-slate-100 border-2 border-black space-y-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {/* Preview container */}
                          <div className="shrink-0">
                            {uploadedPhotoUrl ? (
                              <div className="relative">
                                <JuryAvatar
                                  avatarType="custom"
                                  photoUrl={uploadedPhotoUrl}
                                  size="lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setUploadedPhotoUrl(null);
                                    setCompressionInfo(null);
                                  }}
                                  className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center border border-black cursor-pointer"
                                  title="Verwijder foto"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <div className="w-24 h-24 bg-slate-200 border-2 border-dashed border-slate-400 flex flex-col items-center justify-center text-slate-500">
                                <ImageIcon size={28} />
                                <span className="text-[9px] font-bold mt-1">GEEN FOTO</span>
                              </div>
                            )}
                          </div>

                          {/* Upload button & Details */}
                          <div className="flex-1 text-center sm:text-left space-y-2">
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                            <button
                              type="button"
                              disabled={isCompressing}
                              onClick={() => fileInputRef.current?.click()}
                              className="bg-black text-amber-400 px-4 py-2.5 text-xs font-display font-black uppercase tracking-wider border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-800 transition-colors cursor-pointer inline-flex items-center gap-2"
                            >
                              <Upload size={14} />
                              <span>{uploadedPhotoUrl ? 'ANDERE FOTO KIEZEN' : 'KIES AFBEELDING'}</span>
                            </button>

                            {isCompressing && (
                              <p className="text-xs font-bold text-amber-600 animate-pulse">
                                Afbeelding comprimeren voor minimale opslag...
                              </p>
                            )}

                            {compressionInfo && (
                              <div className="bg-emerald-50 border border-emerald-400 p-2 text-[11px] font-bold text-emerald-800 flex items-center gap-2">
                                <FileCheck size={16} className="text-emerald-600 shrink-0" />
                                <div>
                                  Gecomprimeerd: <strong>{compressionInfo.originalSizeKb} KB</strong> ➔{' '}
                                  <strong className="text-emerald-700">{compressionInfo.compressedSizeKb} KB</strong>{' '}
                                  ({Math.round((1 - compressionInfo.compressedSizeKb / Math.max(compressionInfo.originalSizeKb, 1)) * 100)}% bespaard!)
                                </div>
                              </div>
                            )}

                            <p className="text-[10px] text-slate-500 font-semibold">
                              De afbeelding wordt in je browser gecomprimeerd en bijgesneden tot een compact vierkant.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t-2 border-black flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowSignUpModal(false)}
                      className="px-4 py-2.5 text-xs font-display font-black uppercase text-slate-600 hover:text-black cursor-pointer"
                    >
                      ANNULEREN
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting || isCompressing}
                      className="bg-amber-400 text-black px-6 py-3 font-display font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      <span>{isSubmitting ? 'OPSLAAN...' : 'AANMELDING VOLTOOIEN'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border-2 border-black px-4 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2.5 text-xs font-black uppercase tracking-wider animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={18} className="text-black fill-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
