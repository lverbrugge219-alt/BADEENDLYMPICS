import React, { useState, useEffect } from 'react';
import { PageRoute } from '../types';
import {
  ShieldCheck,
  Cookie,
  Lock,
  FileText,
  UserCheck,
  Trash2,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  Mail,
  MapPin,
  RefreshCw,
  AlertTriangle,
  Server,
} from 'lucide-react';
import {
  getCookie,
  getCookieConsent,
  setCookieConsent,
  deleteCookie,
  initGoogleAnalytics,
  clearAllUserCookiesAndStorage,
} from '../utils/analytics';

interface PrivacyPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onNavigate }) => {
  const [currentConsent, setCurrentConsent] = useState<'accepted' | 'essential' | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const updateCookieStatus = () => {
    setCurrentConsent(getCookieConsent());
    setVisitorId(getCookie('badeend_uid') || localStorage.getItem('badeend_uid'));
    setSessionId(getCookie('badeend_sid'));
  };

  useEffect(() => {
    updateCookieStatus();
    const handleConsentChange = () => updateCookieStatus();
    window.addEventListener('badeend_consent_change', handleConsentChange);
    return () => window.removeEventListener('badeend_consent_change', handleConsentChange);
  }, []);

  const handleSetConsent = (type: 'accepted' | 'essential') => {
    setCookieConsent(type);
    if (type === 'accepted') {
      initGoogleAnalytics();
    }
    updateCookieStatus();
    showFeedback(
      type === 'accepted'
        ? 'Cookie-voorkeur ingesteld: Alle cookies geaccepteerd.'
        : 'Cookie-voorkeur ingesteld: Alleen functionele cookies actief.'
    );
  };

  const handleResetCookies = () => {
    clearAllUserCookiesAndStorage();
    updateCookieStatus();
    showFeedback('Alle Badeendlympics cookies, Google Analytics cookies & lokale data zijn succesvol gewist!');
  };

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Top Breadcrumb & Action Bar */}
      <div className="border-b-2 border-slate-100 bg-slate-50/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>TERUG NAAR HOMEPAGINA</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <ShieldCheck size={16} className="text-emerald-600" />
            <span>AVG / GDPR CONFORM</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Header Title */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400 border-2 border-black text-black font-display font-black text-xs uppercase tracking-widest mb-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Lock size={14} />
            <span>PRIVACY & COOKIEBELEID</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tight text-black leading-none mb-4">
            PRIVACYVERKLARING & COOKIES
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-3xl leading-relaxed">
            De <strong>BADEENDLYMPICS 2027</strong> hecht grote waarde aan de bescherming van jouw privacy en persoonsgegevens. In deze verklaring leggen we helder en transparant uit welke gegevens we verzamelen, waarom we dit doen, hoe cookies worden ingezet en wat jouw rechten zijn conform de Algemene Verordening Gegevensbescherming (AVG / GDPR).
          </p>
          <div className="mt-4 text-xs font-bold text-slate-400">
            Laatste update: 31 augustus 2026 · Versie 1.3
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className="mb-8 p-4 bg-amber-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 animate-in fade-in">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span className="text-xs font-black uppercase text-black">{feedbackMessage}</span>
          </div>
        )}

        {/* Interactive Cookie Preference Manager Box */}
        <div className="mb-14 bg-amber-50 border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b-2 border-black mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400 border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Cookie size={22} className="text-black" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black">
                  JOUW COOKIEVOORKEUREN BEHEREN
                </h3>
                <p className="text-xs text-slate-700 font-medium">
                  Beheer direct hoe cookies en gepseudonimiseerde statistieken op jouw apparaat worden bewaard.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-slate-600">Huidige status:</span>
              <span
                className={`px-2.5 py-1 border border-black font-display font-black text-xs uppercase ${
                  currentConsent === 'accepted'
                    ? 'bg-emerald-400 text-black'
                    : currentConsent === 'essential'
                    ? 'bg-sky-200 text-black'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {currentConsent === 'accepted'
                  ? 'Alle cookies geaccepteerd'
                  : currentConsent === 'essential'
                  ? 'Alleen functioneel'
                  : 'Nog geen keuze gemaakt'}
              </span>
            </div>
          </div>

          {/* Current cookie values detail */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border-2 border-black p-3.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Bezoekers-ID (Cookie)
              </span>
              <span className="font-mono text-xs font-bold text-black truncate block mt-0.5">
                {visitorId ? visitorId : 'Niet ingesteld / Gewist'}
              </span>
            </div>
            <div className="bg-white border-2 border-black p-3.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Sessie-ID (Cookie)
              </span>
              <span className="font-mono text-xs font-bold text-black truncate block mt-0.5">
                {sessionId ? sessionId : 'Geen actieve sessiecookie'}
              </span>
            </div>
            <div className="bg-white border-2 border-black p-3.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Toestemming
              </span>
              <span className="font-mono text-xs font-bold text-black truncate block mt-0.5">
                {currentConsent ? currentConsent : 'Geen consent cookie'}
              </span>
            </div>
          </div>

          {/* Interactive buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleSetConsent('accepted')}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 size={15} />
              <span>ACCEPTEER ALLES (FUNCTIONEEL & STATISTIEKEN)</span>
            </button>
            <button
              onClick={() => handleSetConsent('essential')}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>ALLEEN NOODZAKELIJK / FUNCTIONEEL</span>
            </button>
            <button
              onClick={handleResetCookies}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border-2 border-black text-rose-700 font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
            >
              <Trash2 size={15} />
              <span>WIS ALLE COOKIES & DATA</span>
            </button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-12 text-slate-800">
          {/* Section 1: Verantwoordelijke */}
          <section className="border-2 border-black p-6 sm:p-8 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-black text-amber-400 border border-black flex items-center justify-center font-black text-sm">
                1
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black">
                WIE IS DE VERWERKINGSVERANTWOORDELIJKE?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium mb-4">
              De verwerkingsverantwoordelijke voor de gegevensverwerking via deze website en tijdens het evenement is de organisatie van de Badeendlympics in samenwerking met Scouting Van Brederode:
            </p>
            <div className="bg-slate-50 border-2 border-black p-4 space-y-2 text-xs font-bold text-slate-800">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-amber-500 shrink-0" />
                <span>Locatie: Terrein Scouting Van Brederode, Batenstein · Kamerlingh Onneslaan 1, 3356BP Papendrecht</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-amber-500 shrink-0" />
                <span>Contactpersoon: Lotte (Organisatie & Vrijwilligers) · </span>
                <a
                  href="mailto:Lotte@scoutingpapendrecht.nl"
                  className="text-sky-600 underline hover:text-black"
                >
                  Lotte@scoutingpapendrecht.nl
                </a>
              </div>
            </div>
          </section>

          {/* Section 2: Welke gegevens verzamelen we? */}
          <section className="border-2 border-black p-6 sm:p-8 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-black text-amber-400 border border-black flex items-center justify-center font-black text-sm">
                2
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black">
                WELKE PERSOONSGEGEVENS VERWERKEN WIJ?
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium mb-4">
              Wij verwerken uitsluitend gegevens die noodzakelijk zijn voor de organisatie, inschrijving, puntentelling en het technisch functioneren van de app:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border-2 border-black bg-slate-50">
                <h4 className="font-display font-black text-xs uppercase text-black mb-2 flex items-center gap-2">
                  <UserCheck size={16} className="text-emerald-600" />
                  TEAM- & DEELNEMERSGEGEVENS
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 font-medium">
                  <li><strong>Teamnaam</strong> (openbaar getoond op het leaderboard en deelnemerslijst).</li>
                  <li><strong>Naam aanvoerder</strong> (voor communicatie en teamverificatie).</li>
                  <li><strong>E-mailadres aanvoerder</strong> (voor bevestiging en inloggen in het teamportaal).</li>
                  <li><strong>Namen van teamleden (4 personen)</strong> (voor toelating en oorkondes).</li>
                  <li><strong>Team-wachtwoord</strong> (veilig eenrichtings-versleuteld opgeslagen middels cryptografische <strong>SHA-256 hashing</strong>; wachtwoorden zijn voor niemand in platte tekst inzichtelijk).</li>
                </ul>
              </div>

              <div className="p-4 border-2 border-black bg-slate-50">
                <h4 className="font-display font-black text-xs uppercase text-black mb-2 flex items-center gap-2">
                  <Cookie size={16} className="text-sky-600" />
                  WEBSITE- & COOKIEGEGEVENS
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-700 font-medium">
                  <li><strong>Gepseudonimiseerd bezoekers-ID (badeend_uid)</strong> ter berekening van unieke bezoekersaantallen.</li>
                  <li><strong>Sessie-ID (badeend_sid)</strong> om actieve browsersessies te herkennen.</li>
                  <li><strong>Apparaat- & browserkenmerken</strong> (mobiel, tablet of desktop, browsertype en schermresolutie).</li>
                  <li><strong>Paginabezoeken & tijdstempels</strong> (welke pagina’s zoals Dagschema of Leaderboard worden bekeken).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Doeleinden & Grondslagen */}
          <section className="border-2 border-black p-6 sm:p-8 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-black text-amber-400 border border-black flex items-center justify-center font-black text-sm">
                3
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black">
                WAAROM EN OP BASIS VAN WELKE GRONDSLAG VERWERKEN WIJ DEZE GEGEVENS?
              </h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              <div className="p-3 bg-slate-50 border border-black">
                <strong className="text-black block mb-0.5">A. Uitvoering van de overeenkomst (Deelname aan het evenement)</strong>
                Voor het registreren van teams, het indelen van de poules, de officiële puntentelling en communicatie over het toernooi.
              </div>
              <div className="p-3 bg-slate-50 border border-black">
                <strong className="text-black block mb-0.5">B. Gerechtvaardigd belang (Veiligheid & Wedstrijdleiding)</strong>
                Voor het beveiligen van de score-invoer, het voorkomen van ongeoorloofde wijzigingen en het soepel laten verlopen van de live tussenstanden.
              </div>
              <div className="p-3 bg-slate-50 border border-black">
                <strong className="text-black block mb-0.5">C. Toestemming (Cookies & Gebruiksstatistieken)</strong>
                Voor het meten van het websitegebruik om de website te optimaliseren voor mobiele telefoons tijdens de speldag. Je kunt deze toestemming op ieder moment intrekken.
              </div>
            </div>
          </section>

          {/* Section 4: Het Cookie-overzicht */}
          <section className="border-2 border-black p-6 sm:p-8 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-black text-amber-400 border border-black flex items-center justify-center font-black text-sm">
                4
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black">
                VOLLEDIG OVERZICHT VAN GEBRUIKTE COOKIES
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium mb-4">
              Hieronder vind je de exacte specificaties van alle first-party cookies die door de Badeendlympics applicatie kunnen worden geplaatst:
            </p>

            <div className="overflow-x-auto border-2 border-black">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-black text-white font-display uppercase tracking-wider">
                    <th className="p-3 border-r border-slate-700">Cookie Naam</th>
                    <th className="p-3 border-r border-slate-700">Type / Categorie</th>
                    <th className="p-3 border-r border-slate-700">Doel</th>
                    <th className="p-3">Bewaartermijn</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black font-medium">
                  <tr className="bg-white hover:bg-amber-50/50">
                    <td className="p-3 font-mono font-bold text-black border-r border-slate-200">
                      badeend_uid
                    </td>
                    <td className="p-3 text-slate-700 border-r border-slate-200">
                      Statistieken / Analytisch
                    </td>
                    <td className="p-3 text-slate-700 border-r border-slate-200">
                      Bevat een willekeurig gegenereerd ID om unieke bezoekers te onderscheiden zonder persoonsidentificatie.
                    </td>
                    <td className="p-3 font-bold text-black">1 jaar (365 dagen)</td>
                  </tr>
                  <tr className="bg-slate-50 hover:bg-amber-50/50">
                    <td className="p-3 font-mono font-bold text-black border-r border-slate-200">
                      badeend_sid
                    </td>
                    <td className="p-3 text-slate-700 border-r border-slate-200">
                      Sessie / Functioneel
                    </td>
                    <td className="p-3 text-slate-700 border-r border-slate-200">
                      Houdt de actieve browsersessie bij om meerdere paginabezoeken binnen 30 minuten te groeperen.
                    </td>
                    <td className="p-3 font-bold text-black">30 minuten (sliding)</td>
                  </tr>
                  <tr className="bg-white hover:bg-amber-50/50">
                    <td className="p-3 font-mono font-bold text-black border-r border-slate-200">
                      badeend_consent
                    </td>
                    <td className="p-3 text-slate-700 border-r border-slate-200">
                      Voorkeuren / Functioneel
                    </td>
                    <td className="p-3 text-slate-700 border-r border-slate-200">
                      Onthoudt of je alle cookies hebt geaccepteerd of uitsluitend functionele cookies wenst.
                    </td>
                    <td className="p-3 font-bold text-black">1 jaar (365 dagen)</td>
                  </tr>
                  <tr className="bg-slate-50 hover:bg-amber-50/50">
                    <td className="p-3 font-mono font-bold text-black border-r border-slate-200">
                      _ga / _ga_*
                    </td>
                    <td className="p-3 text-slate-700 border-r border-slate-200">
                      Google Analytics (Optioneel)
                    </td>
                    <td className="p-3 text-slate-700 border-r border-slate-200">
                      Uitsluitend actief indien geconfigureerd door de organisatie. IP-adressen worden hierbij gepseudonimiseerd.
                    </td>
                    <td className="p-3 font-bold text-black">2 jaar (standaard GA)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5: Delen met derden & Cloudbeveiliging */}
          <section className="border-2 border-black p-6 sm:p-8 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-black text-amber-400 border border-black flex items-center justify-center font-black text-sm">
                5
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black">
                DELEN MET DERDEN & BEVEILIGING
              </h2>
            </div>
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              <p>
                <strong>Geen commerciële verkoop:</strong> Wij verkopen, verhuren of delen jouw gegevens onder geen beding met commerciële adverteerders, marketingbureaus of derden.
              </p>
              <p>
                <strong>Veilige Cloud Hosting & Wachtwoord-Hashing:</strong> De website, database (Google Firebase / Firestore) en webservices draaien in gecertificeerde Europese datacenters met SSL-encryptie (HTTPS) en strikte toegangscontrole. Alle teamwachtwoorden worden onomkeerbaar beveiligd met <strong>SHA-256 hashing</strong> via de Web Crypto API voordat ze in de database worden opgeslagen.
              </p>
            </div>
          </section>

          {/* Section 6: Bewaartermijn & Jouw Rechten */}
          <section className="border-2 border-black p-6 sm:p-8 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-black text-amber-400 border border-black flex items-center justify-center font-black text-sm">
                6
              </div>
              <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black">
                BEWAARTERMIJNEN EN JOUW RECHTEN (AVG)
              </h2>
            </div>
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              <p>
                Team- en inschrijfgegevens worden bewaard voor de duur en sportieve afronding van de Badeendlympics 2027. Daarna worden e-mailadressen gewist tenzij expliciet toestemming is verleend voor een volgende editie.
              </p>

              <div className="p-4 bg-slate-50 border-2 border-black space-y-2">
                <h4 className="font-display font-black text-xs uppercase text-black">
                  ALS BETROKKENE HEB JE ONDER MEER DE VOLGENDE RECHTEN:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                  <li><strong>Inzage en correctie:</strong> Je mag te allen tijde opvragen welke gegevens over jouw team zijn vastgelegd en deze laten corrigeren.</li>
                  <li><strong>Recht op verwijdering (vergetelheid):</strong> Wil je jouw team uitschrijven en alle gegevens direct laten wissen? Neem contact met ons op of vraag de organisatie dit in het beheersysteem uit te voeren.</li>
                  <li><strong>Intrekken van toestemming:</strong> Je kunt jouw cookiekeuze op elk moment intrekken via de knoppen bovenaan deze pagina of via de link <em>'Cookie-instellingen'</em> in de footer.</li>
                  <li><strong>Klachtrecht:</strong> Je hebt het recht om een klacht in te dienen bij de toezichthouder, de <em>Autoriteit Persoonsgegevens (AP)</em>.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 7: Contact */}
          <section className="border-2 border-black p-6 sm:p-8 bg-amber-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
            <div className="flex items-center gap-3 mb-3">
              <Mail size={22} className="text-black" />
              <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black">
                VRAGEN OVER PRIVACY OF COOKIES?
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed mb-4 text-slate-900">
              Heb je een vraag over ons privacybeleid, wil je gegevens inzien of heb je hulp nodig bij jouw inschrijving? Neem gerust contact op met de organisatie:
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:Lotte@scoutingpapendrecht.nl?subject=Privacyvraag%20Badeendlympics%202027"
                className="px-4 py-2.5 bg-black text-white font-display font-black text-xs uppercase tracking-wider hover:bg-slate-900 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                STUUR EEN E-MAIL NAAR DE ORGANISATIE
              </a>
              <button
                onClick={() => onNavigate('home')}
                className="px-4 py-2.5 bg-white text-black border-2 border-black font-display font-black text-xs uppercase tracking-wider hover:bg-slate-100 transition-colors cursor-pointer"
              >
                TERUG NAAR HOMEPAGINA
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
