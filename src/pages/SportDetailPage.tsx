import React, { useState, useEffect } from 'react';
import { PageRoute, SpelId } from '../types';
import { SPELEN } from '../data/mockData';
import {
  ArrowLeft,
  Sparkles,
  Gamepad2,
  ScrollText,
  Lock,
  Target,
  MapPin,
  Clock,
  Boxes,
  Calendar,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { WhackADuckGame } from '../components/WhackADuckGame';
import { GeneralRulesModal } from '../components/GeneralRulesModal';
import { getAdminSession, verifyAdminSession } from '../utils/storage';

interface GroupedRuleItem {
  main: string;
  subItems: string[];
}

function groupSectionItems(items: string[]): GroupedRuleItem[] {
  const groups: GroupedRuleItem[] = [];
  for (const itm of items) {
    if (itm.startsWith('•') || itm.startsWith('-')) {
      if (groups.length > 0) {
        groups[groups.length - 1].subItems.push(itm);
      } else {
        groups.push({ main: itm, subItems: [] });
      }
    } else {
      groups.push({ main: itm, subItems: [] });
    }
  }
  return groups;
}

interface CountdownTimerProps {
  targetIsoDate: string;
  formattedDisplay: string;
  onPreviewToggle?: () => void;
  onRequireLogin?: () => void;
  isPreviewActive?: boolean;
  hasUnlockedData?: boolean;
  isAdminLoggedIn?: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetIsoDate,
  formattedDisplay,
  onPreviewToggle,
  onRequireLogin,
  isPreviewActive,
  hasUnlockedData,
  isAdminLoggedIn,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isFinished: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: false });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(targetIsoDate).getTime();
      const now = Date.now();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isFinished: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isFinished: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetIsoDate]);

  return (
    <div className="bg-black text-white border-2 border-black p-5 sm:p-7 shadow-[5px_5px_0px_0px_rgba(250,204,21,1)] mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-zinc-800">
        <div className="flex items-center gap-2.5">
          <Clock className="text-amber-400" size={20} />
          <div>
            <span className="font-display font-black text-sm uppercase tracking-wider text-amber-400 block leading-tight">
              OFFICIËLE ONTHULLINGSAFTELKLOK
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">
              Spelbeschrijving en reglement zijn verzegeld tot publicatietijd
            </span>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto bg-zinc-900 border border-zinc-700 px-2.5 py-1 text-[11px] font-mono font-bold text-amber-300">
          <span>WERELDTIJD: CEST (UTC+02:00)</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center my-4">
        <div className="bg-zinc-900 border-2 border-zinc-800 p-3 sm:p-4">
          <div className="font-mono font-black text-3xl sm:text-4xl text-amber-400 leading-none">
            {String(timeLeft.days).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs uppercase font-black tracking-widest text-zinc-400 mt-1.5">
            Dagen
          </div>
        </div>
        <div className="bg-zinc-900 border-2 border-zinc-800 p-3 sm:p-4">
          <div className="font-mono font-black text-3xl sm:text-4xl text-white leading-none">
            {String(timeLeft.hours).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs uppercase font-black tracking-widest text-zinc-400 mt-1.5">
            Uren
          </div>
        </div>
        <div className="bg-zinc-900 border-2 border-zinc-800 p-3 sm:p-4">
          <div className="font-mono font-black text-3xl sm:text-4xl text-white leading-none">
            {String(timeLeft.minutes).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs uppercase font-black tracking-widest text-zinc-400 mt-1.5">
            Minuten
          </div>
        </div>
        <div className="bg-zinc-900 border-2 border-zinc-800 p-3 sm:p-4">
          <div className="font-mono font-black text-3xl sm:text-4xl text-amber-400 leading-none">
            {String(timeLeft.seconds).padStart(2, '0')}
          </div>
          <div className="text-[10px] sm:text-xs uppercase font-black tracking-widest text-zinc-400 mt-1.5">
            Seconden
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-zinc-800/90 text-xs">
        <div className="text-zinc-400">
          Tijdstip van onthulling:{' '}
          <strong className="text-amber-400 font-mono font-semibold">{formattedDisplay}</strong>
        </div>

        {hasUnlockedData && (
          <div>
            {isAdminLoggedIn ? (
              <button
                type="button"
                onClick={onPreviewToggle}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer self-start sm:self-auto py-0.5"
                title="Organisatie-preview in- of uitschakelen"
              >
                {isPreviewActive ? (
                  <>
                    <EyeOff size={12} className="text-zinc-400" />
                    <span className="underline underline-offset-2">Sluit organisatie-preview</span>
                  </>
                ) : (
                  <>
                    <Eye size={12} className="text-zinc-500" />
                    <span className="hover:underline underline-offset-2">Organisatie-preview</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={onRequireLogin}
                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer self-start sm:self-auto py-0.5"
                title="Alleen toegankelijk voor ingelogde organisatieleden"
              >
                <Lock size={11} className="text-zinc-600" />
                <span className="hover:underline underline-offset-2">Organisatie-preview</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

interface SportDetailPageProps {
  spelId: SpelId;
  onNavigate: (page: PageRoute) => void;
  onNavigateLoginWithTab?: (page: PageRoute, tab: 'team' | 'jury' | 'organisatie') => void;
}

export const SportDetailPage: React.FC<SportDetailPageProps> = ({
  spelId,
  onNavigate,
  onNavigateLoginWithTab,
}) => {
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [adminPreview, setAdminPreview] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => getAdminSession());
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = async () => {
      const valid = await verifyAdminSession();
      setIsAdminLoggedIn(valid);
      if (!valid) {
        setAdminPreview(false);
      }
    };
    checkAuth();

    const handleAuthChange = () => {
      const loggedIn = getAdminSession();
      setIsAdminLoggedIn(loggedIn);
      if (!loggedIn) {
        setAdminPreview(false);
      }
    };
    window.addEventListener('badeendlympics_auth_change', handleAuthChange);
    return () => window.removeEventListener('badeendlympics_auth_change', handleAuthChange);
  }, []);

  const baseSpel = SPELEN.find((s) => s.id === spelId) || SPELEN[0];
  const isSpel1 = baseSpel.id === 'geheim-01' || baseSpel.number === '01';

  // Controleer of de onthullingsdatum is bereikt
  const targetTime = baseSpel.revealIsoDate ? new Date(baseSpel.revealIsoDate).getTime() : 0;
  const isTargetDateReached = targetTime > 0 && Date.now() >= targetTime;

  // De organisatie preview mag ALLEEN werken als de organisatie is ingelogd
  const isRevealed = isTargetDateReached || (isAdminLoggedIn && adminPreview) || !baseSpel.isSecret;

  const handlePreviewToggle = () => {
    if (!isAdminLoggedIn) {
      setAdminPreview(false);
      setShowLoginRequiredModal(true);
      return;
    }
    setAdminPreview((prev) => !prev);
  };

  const handleGoToLogin = () => {
    setShowLoginRequiredModal(false);
    if (onNavigateLoginWithTab) {
      onNavigateLoginWithTab('login', 'organisatie');
    } else {
      onNavigate('login');
    }
  };

  // Gebruik de ontgrendelde gegevens indien bereikt of in preview mode (mits ingelogd)
  const spel = (isRevealed && baseSpel.unlockedData)
    ? { ...baseSpel, ...baseSpel.unlockedData, isSecret: false }
    : baseSpel;

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 text-xs font-black font-display uppercase tracking-widest text-slate-500 hover:text-black transition-colors mb-8 cursor-pointer"
        >
          <ArrowLeft size={16} /> ALLE SPELEN
        </button>

        {/* Organisatie Preview Banner */}
        {adminPreview && isAdminLoggedIn && (
          <div className="mb-8 p-4 bg-amber-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={22} className="text-black shrink-0" />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-black text-xs uppercase tracking-wider text-black block">
                    ORGANISATIE-PREVIEW GEACTIVEERD
                  </span>
                  <span className="bg-black text-amber-400 text-[10px] font-mono font-bold px-1.5 py-0.5 border border-black uppercase">
                    Ingelogd als Organisatie
                  </span>
                </div>
                <span className="text-xs text-black/80 font-medium">
                  U bekijkt hoe Spel 01 (Build & Beer) wordt weergegeven na de officiële onthulling op 21 september 2026 om 00:00 CEST (UTC+2).
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAdminPreview(false)}
              className="px-3 py-1.5 bg-black text-amber-400 font-display font-black text-xs uppercase tracking-wider border border-black hover:bg-zinc-800 cursor-pointer shrink-0"
            >
              Sluit Preview
            </button>
          </div>
        )}

        {/* Hero Split for Spel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-12 sm:mb-16">
          {/* Left Column: Number, Title, Tagline, Description */}
          <div className="lg:col-span-6">
            <div className="font-display font-black text-7xl sm:text-8xl md:text-9xl text-amber-400 text-stroke-black leading-none mb-2 select-none">
              {spel.number}
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl uppercase tracking-tight text-black leading-none mb-3">
              {spel.name}
            </h1>

            <div className="text-sky-500 font-display font-black text-xs sm:text-sm tracking-widest uppercase mb-6">
              {spel.tagline}
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium max-w-xl mb-6">
              {spel.description}
            </p>

            {isSpel1 && (
              <a
                href="#teaser-game"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 transition-colors"
              >
                <Gamepad2 size={16} /> SPEEL DE TRAININGS-TEASER ↓
              </a>
            )}
          </div>

          {/* Right Column: Image, Whack-A-Duck Teaser Hook, or Mystery Icon */}
          <div className="lg:col-span-6">
            <div className="bg-slate-100 border-2 border-black overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] aspect-[4/3] flex items-center justify-center relative">
              {spel.imageUrl ? (
                <img
                  src={spel.imageUrl}
                  alt={spel.name}
                  className="w-full h-full object-cover"
                />
              ) : isSpel1 ? (
                <div className="bg-sky-950 w-full h-full flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]" />

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white border-2 border-black p-1.5 mb-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center overflow-hidden">
                      <img
                        src="/hammer-duck.png"
                        alt="Badeendjes Meppen Teaser"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="font-display font-black text-xs sm:text-sm tracking-widest uppercase text-amber-400 mb-1 flex items-center gap-1.5">
                      <Sparkles size={14} /> EXCLUSIEVE DISCIPLINE #01 TEASER
                    </span>
                    <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-white mb-2">
                      BADEENDJES MEPPEN
                    </h3>
                    <p className="text-xs text-sky-200 font-medium max-w-xs mb-4">
                      Test je reflexen en reactievermogen in deze trainingsminigame voor het eerste geheime spel!
                    </p>
                    <a
                      href="#teaser-game"
                      className="px-4 py-2 bg-amber-400 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 transition-all active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
                    >
                      DIRECT SPELEN ↓
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-black w-full h-full flex flex-col items-center justify-center p-8 text-center text-white">
                  <div className="font-display font-black text-8xl text-amber-400 leading-none mb-4">
                    ?
                  </div>
                  <span className="font-display font-black text-lg sm:text-xl tracking-widest uppercase text-slate-300">
                    DISCIPLINE WORDT BINNENKORT BEKENDGEMAAKT
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Countdown Timer for unrevealed games with a reveal date */}
        {baseSpel.revealIsoDate && !isTargetDateReached && (
          <CountdownTimer
            targetIsoDate={baseSpel.revealIsoDate}
            formattedDisplay={baseSpel.revealDate || "21 september 2026 · 00:00 CEST (UTC+2)"}
            onPreviewToggle={handlePreviewToggle}
            onRequireLogin={() => setShowLoginRequiredModal(true)}
            isPreviewActive={adminPreview && isAdminLoggedIn}
            hasUnlockedData={Boolean(baseSpel.unlockedData)}
            isAdminLoggedIn={isAdminLoggedIn}
          />
        )}

        {/* Spelregels Section */}
        <div className="pt-8 border-t-2 border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-sky-500 font-display font-black text-xs uppercase tracking-widest block mb-1">
                DISCIPLINE REGELS
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black">
                SPELSPECIFIEKE REGELS
              </h2>
            </div>

            {/* Knop naar Algemeen Reglement */}
            <button
              type="button"
              onClick={() => setIsRulesModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 transition-all cursor-pointer shrink-0 active:translate-x-0.5 active:translate-y-0.5"
            >
              <ScrollText size={16} />
              ALGEMEEN REGLEMENT BEKIJKEN
            </button>
          </div>

          {/* Banner over algemene regels die voor elk spel gelden */}
          <div className="mb-6 p-4 bg-slate-50 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <p className="font-medium text-slate-700">
                <strong className="text-black">Let op:</strong> De 14 algemene regels (o.a. team van 4, 18+, 4 bier per spel, 0.0-keuze, nacontrole & overtredingen) gelden voor <strong className="text-black">alle</strong> spelonderdelen en worden hieronder niet herhaald.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsRulesModalOpen(true)}
              className="text-[11px] font-black uppercase text-amber-800 hover:text-black underline underline-offset-2 shrink-0 cursor-pointer text-left"
            >
              Bekijk alle 14 regels →
            </button>
          </div>

          {/* Regels Weergave: Stap 1 (Geheim) vs Stap 2 (Onthuld) */}
          {spel.isSecret ? (
            <div className="bg-slate-50 border-2 border-black p-8 sm:p-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center max-w-2xl mx-auto my-6">
              <div className="w-14 h-14 bg-black text-amber-400 border-2 border-black flex items-center justify-center mx-auto mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Lock size={26} />
              </div>
              <span className="text-amber-600 font-display font-black text-xs uppercase tracking-widest block mb-1">
                DISCIPLINE {spel.number}
              </span>
              <h3 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-black mb-3">
                SPELSPECIFIEKE REGELS NOG GEHEIM
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-6 max-w-lg mx-auto">
                {spel.revealDate
                  ? `De officiële spelbeschrijving, materialen en discipline-regels worden op ${spel.revealDate} openbaar gemaakt door de organisatie. Tot die tijd zijn uiteraard alle 14 bepalingen uit het Algemeen Reglement van kracht.`
                  : 'De exacte materialen, startprocedure, uitvoering en puntentelling van deze discipline worden te zijner tijd officieel onthuld door de organisatie. Tot die tijd zijn uiteraard alle 14 bepalingen uit het Algemeen Reglement van kracht.'}
              </p>
              <button
                type="button"
                onClick={() => setIsRulesModalOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-3 bg-amber-400 hover:bg-amber-300 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer active:translate-x-0.5 active:translate-y-0.5 transition-all"
              >
                <ScrollText size={16} />
                BEKIJK HET ALGEMEEN REGLEMENT (14 REGELS) →
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Bekendmaking Banner indien ingesteld */}
              {spel.revealDate && (
                <div className="p-4 sm:p-5 bg-amber-400 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-black text-amber-400 border border-black flex items-center justify-center shrink-0">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-black/80 block">
                        OFFICIËLE RELEASE
                      </span>
                      <p className="font-display font-black text-base sm:text-lg uppercase tracking-tight text-black">
                        Bekendmaking: {spel.revealDate}
                      </p>
                    </div>
                  </div>
                  <span className="inline-block px-3 py-1 bg-black text-white text-xs font-black uppercase tracking-wider border border-black">
                    Discipline 01 Regels
                  </span>
                </div>
              )}

              {/* Doel, Locatie & Resultaat Quick Info Grid */}
              {(spel.goal || spel.location || spel.resultType) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  {spel.goal && (
                    <div className="bg-white border-2 border-black p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-2 text-amber-600 mb-2">
                        <Target size={18} />
                        <span className="text-[11px] font-black uppercase tracking-wider">DOEL VAN HET SPEL</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                        {spel.goal}
                      </p>
                    </div>
                  )}

                  {spel.location && (
                    <div className="bg-white border-2 border-black p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-2 text-sky-600 mb-2">
                        <MapPin size={18} />
                        <span className="text-[11px] font-black uppercase tracking-wider">LOCATIE</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                        {spel.location}
                      </p>
                    </div>
                  )}

                  {spel.resultType && (
                    <div className="bg-white border-2 border-black p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                      <div className="flex items-center gap-2 text-emerald-600 mb-2">
                        <Clock size={18} />
                        <span className="text-[11px] font-black uppercase tracking-wider">RESULTAAT</span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                        {spel.resultType}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Materialenlijst */}
              {spel.materials && spel.materials.length > 0 && (
                <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-2.5 pb-3 mb-4 border-b-2 border-slate-100">
                    <Boxes size={20} className="text-amber-500" />
                    <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black">
                      BENODIGDE MATERIALEN
                    </h3>
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {spel.materials.map((mat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-800">
                        <span className="w-2 h-2 bg-amber-400 border border-black shrink-0 mt-1.5" />
                        <span>{mat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Spelregels per fase (Startopstelling, Startprocedure, Uitvoering, Stopmoment, Nacontrole) */}
              {spel.sections && spel.sections.length > 0 ? (
                <div className="space-y-6">
                  {spel.sections.map((section, sIdx) => (
                    <div
                      key={sIdx}
                      className="bg-white border-2 border-black p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-slate-100">
                        <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black">
                          {section.title}
                        </h3>
                        <span className="px-2 py-0.5 bg-slate-100 border border-black text-[10px] font-black uppercase text-slate-700">
                          Fase 0{sIdx + 1}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {groupSectionItems(section.items).map((group, itmIdx) => {
                          if (group.subItems.length > 0) {
                            return (
                              <div
                                key={itmIdx}
                                className="bg-amber-50/60 border-2 border-black p-4 sm:p-5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                              >
                                <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed mb-3">
                                  {group.main}
                                </p>
                                <div className="space-y-2 pl-0 sm:pl-1">
                                  {group.subItems.map((sub, sIdx) => {
                                    const cleanText = sub.replace(/^[•\-]\s*/, '');
                                    return (
                                      <div
                                        key={sIdx}
                                        className="flex items-start gap-2.5 bg-white border border-black p-2.5 sm:p-3 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                                      >
                                        <div className="w-5 h-5 bg-amber-400 border border-black flex items-center justify-center shrink-0 mt-0.5 text-black">
                                          <Check size={13} strokeWidth={3} />
                                        </div>
                                        <span className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                                          {cleanText}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={itmIdx}
                              className="p-3 bg-slate-50 border border-black/20 text-xs sm:text-sm font-medium text-slate-900 leading-relaxed"
                            >
                              {group.main}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {spel.rules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="bg-white border-2 border-black p-4 sm:p-5 flex items-center gap-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <div className="w-8 h-8 bg-amber-400 border-2 border-black font-display font-black text-sm flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                        {rule}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Puntentelling & Straftijd Kaart */}
              {spel.scoringDetails && (
                <div className="bg-amber-50 border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-2.5 pb-2 mb-2 border-b border-amber-200">
                    <AlertCircle size={20} className="text-amber-700" />
                    <h3 className="font-display font-black text-lg uppercase tracking-tight text-black">
                      PUNTENTELLING & STRAFTIJD
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                    {spel.scoringDetails}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Spel 1 Interactive Whack-a-Duck Teaser Section (Onder het blok met de spelregels) */}
        {isSpel1 && (
          <div id="teaser-game" className="mt-16 pt-8 border-t-2 border-slate-100 scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400 border-2 border-black text-xs font-display font-black uppercase tracking-wider text-black mb-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Gamepad2 size={14} /> INTERACTIEVE TEASER GAME
                </div>
                <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black leading-none">
                  SPEL 1 TRAINING: BADEENDJES TIKKEN
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md">
                Een voorproefje op de snelheid en behendigheid die gevraagd wordt tijdens Spel 1 van de Badeendlympics 2027.
              </p>
            </div>

            <WhackADuckGame />
          </div>
        )}

        {/* Bottom Banner */}
        <div className="mt-16 bg-slate-50 border-2 border-black p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-display font-black text-xl uppercase tracking-tight block">
              DURF JIJ DIT SPEL AAN?
            </span>
            <span className="text-xs text-slate-600 font-medium">
              Schrijf jouw team in voor de BADEENDLYMPICS 2027 in Papendrecht.
            </span>
          </div>
          <button
            onClick={() => onNavigate('inschrijven')}
            className="px-6 py-3 bg-amber-400 border-2 border-black font-display font-black text-sm uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 cursor-pointer"
          >
            TEAM INSCHRIJVEN →
          </button>
        </div>
      </div>

      {/* Algemeen Reglement Modal */}
      <GeneralRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />

      {/* Inloggen Vereist Modal voor de Organisatie-Preview */}
      {showLoginRequiredModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-black border-4 border-black max-w-md w-full p-6 sm:p-7 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-amber-400 border-2 border-black flex items-center justify-center mb-4">
              <Lock size={24} className="text-black" />
            </div>
            <span className="text-[11px] font-display font-black uppercase tracking-widest text-amber-600 block mb-1">
              GEAUTORISEERDE TOEGANG
            </span>
            <h3 className="font-display font-black text-2xl uppercase tracking-tight mb-2">
              Organisatie Inloggen Vereist
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mb-6">
              De preview van de geheime spelregels van 21 september is uitsluitend bestemd voor geautoriseerde leden van de organisatie (Scouting Van Brederode).
              <br /><br />
              Meld u eerst aan met het organisatieaccount om de verzegelde spelregels vóór de officiële bekendmaking in te zien.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleGoToLogin}
                className="flex-1 bg-black text-amber-400 font-display font-black text-xs uppercase tracking-widest py-3 px-4 border-2 border-black hover:bg-zinc-800 cursor-pointer text-center transition-colors"
              >
                Inloggen als Organisatie →
              </button>
              <button
                type="button"
                onClick={() => setShowLoginRequiredModal(false)}
                className="bg-slate-100 text-black font-display font-black text-xs uppercase tracking-widest py-3 px-4 border-2 border-black hover:bg-slate-200 cursor-pointer text-center transition-colors"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

