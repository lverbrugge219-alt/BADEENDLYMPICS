import React from 'react';
import { SessionDetail, SessionVisitStep } from '../utils/analytics';
import {
  X,
  Clock,
  Compass,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  Tag,
  Shield,
  MousePointerClick,
  FileText,
} from 'lucide-react';

interface SessionDetailModalProps {
  session: SessionDetail | null;
  allSessions: SessionDetail[];
  onClose: () => void;
  onSelectSession: (session: SessionDetail) => void;
  getPageDisplayName: (page: string) => string;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({
  session,
  allSessions,
  onClose,
  onSelectSession,
  getPageDisplayName,
}) => {
  if (!session) return null;

  // Format duration in minutes and seconds
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds} sec`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
  };

  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return isoString;
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('nl-NL', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  // Find index in list for prev/next navigation
  const currentIndex = allSessions.findIndex((s) => s.sessionId === session.sessionId);
  const prevSession = currentIndex > 0 ? allSessions[currentIndex - 1] : null;
  const nextSession =
    currentIndex >= 0 && currentIndex < allSessions.length - 1
      ? allSessions[currentIndex + 1]
      : null;

  const getOriginBadge = (origin = session.origin) => {
    switch (origin.category) {
      case 'search':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          label: 'Zoekmachine',
          icon: <Compass size={14} className="text-blue-600 shrink-0" />,
        };
      case 'social':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          label: 'Social & Chat',
          icon: <Globe size={14} className="text-emerald-600 shrink-0" />,
        };
      case 'external':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-300',
          label: 'Verwijzende website',
          icon: <ExternalLink size={14} className="text-purple-600 shrink-0" />,
        };
      case 'campaign':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          label: 'Campagne / UTM',
          icon: <Tag size={14} className="text-amber-600 shrink-0" />,
        };
      case 'direct':
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          label: 'Direct verkeer',
          icon: <Compass size={14} className="text-slate-600 shrink-0" />,
        };
    }
  };

  const originBadge = getOriginBadge();

  const getPageIcon = (page: string) => {
    if (page === 'home') return '🏠';
    if (page === 'schema') return '📅';
    if (page === 'scores') return '🏆';
    if (page === 'deelnemers') return '👥';
    if (page === 'inschrijven') return '📝';
    if (page === 'team-portal') return '🔐';
    if (page === 'scorebeheer') return '⚙️';
    if (page === 'info') return 'ℹ️';
    if (page === 'privacy') return '🛡️';
    if (page.startsWith('spel-')) return '🎯';
    return '📄';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border-3 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-amber-400 border-b-2 border-black p-4 sm:p-5 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="bg-black text-amber-400 font-mono font-black text-[10px] px-2 py-0.5 uppercase tracking-wider">
                SESSIE DETAIL
              </span>
              <span className="font-mono text-xs font-bold text-black bg-white/80 px-2 py-0.5 border border-black">
                ID: {session.sessionId}
              </span>
              <span className="text-xs font-bold text-black/80 flex items-center gap-1">
                <Calendar size={13} />
                {formatDate(session.startTime)}
              </span>
            </div>
            <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black leading-tight">
              SESSIEREIS & BEZOCHTE PAGINA’S
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white hover:bg-black hover:text-white border-2 border-black transition-colors cursor-pointer shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            title="Sluiten"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-black">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                PAGINABEZOEKEN
              </div>
              <div className="font-display font-black text-2xl text-black">
                {session.pageCount}
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                {session.uniquePagesCount} unieke pagina’s
              </div>
            </div>

            <div className="bg-slate-50 border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                SESSIEDUUR
              </div>
              <div className="font-display font-black text-2xl text-black">
                {formatDuration(session.durationSeconds)}
              </div>
              <div className="text-[11px] text-slate-600 font-medium font-mono">
                {formatTime(session.startTime)} - {formatTime(session.endTime)}
              </div>
            </div>

            <div className="bg-slate-50 border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                APPARAAT
              </div>
              <div className="font-display font-black text-base text-black flex items-center gap-1.5 mt-1 capitalize">
                {session.device === 'mobile' ? (
                  <Smartphone size={16} className="text-emerald-600" />
                ) : session.device === 'tablet' ? (
                  <Tablet size={16} className="text-sky-600" />
                ) : (
                  <Monitor size={16} className="text-purple-600" />
                )}
                <span>{session.device}</span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium truncate">
                {session.browser} ({session.screenSize})
              </div>
            </div>

            <div className="bg-slate-50 border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                BEZOEKER COOKIE
              </div>
              <div className="font-mono font-bold text-xs text-black mt-1 truncate" title={session.visitorId}>
                {session.visitorId.substring(0, 12)}...
              </div>
              <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                badeend_uid
              </div>
            </div>
          </div>

          {/* Traffic Origin Box (Waarvandaan bezocht?) */}
          <div className="bg-amber-50/70 border-2 border-black p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-amber-400 border border-black flex items-center justify-center font-bold">
                  <Compass size={16} />
                </div>
                <h3 className="font-display font-black text-sm uppercase tracking-tight text-black">
                  WAARVANDAAN BEZOCHT? (HERKOMST & REFERRER)
                </h3>
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold border ${originBadge.bg}`}
              >
                {originBadge.icon}
                <span>{originBadge.label}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-black p-3.5 text-xs">
              <div>
                <div className="text-[10px] font-black uppercase text-slate-500">
                  HERKOMSTBRON
                </div>
                <div className="font-display font-black text-sm text-black mt-0.5">
                  {session.origin.sourceName}
                </div>
                {session.origin.hostname && (
                  <div className="text-slate-600 font-mono text-[11px] mt-0.5 flex items-center gap-1">
                    <Globe size={11} /> {session.origin.hostname}
                  </div>
                )}
              </div>

              <div>
                <div className="text-[10px] font-black uppercase text-slate-500">
                  EERSTE INSTAPPAGINA
                </div>
                <div className="font-bold text-black mt-0.5 flex items-center gap-1.5">
                  <span>{getPageIcon(session.landingPage)}</span>
                  <span>{getPageDisplayName(session.landingPage)}</span>
                </div>
              </div>

              {session.origin.fullReferrer && (
                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-black uppercase text-slate-500 mb-1">
                    VOLLEDIGE VERWIJZENDE URL (REFERRER)
                  </div>
                  <div className="font-mono text-[11px] text-slate-700 bg-slate-50 p-2 border border-slate-200 break-all select-all">
                    {session.origin.fullReferrer}
                  </div>
                </div>
              )}

              {(session.origin.utmSource || session.origin.utmCampaign) && (
                <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex flex-wrap gap-3">
                  {session.origin.utmSource && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">UTM Source:</span>
                      <span className="font-mono font-bold text-black">{session.origin.utmSource}</span>
                    </div>
                  )}
                  {session.origin.utmMedium && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">UTM Medium:</span>
                      <span className="font-mono font-bold text-black">{session.origin.utmMedium}</span>
                    </div>
                  )}
                  {session.origin.utmCampaign && (
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Campagne:</span>
                      <span className="font-mono font-bold text-black">{session.origin.utmCampaign}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Chronological Step-by-Step Page Timeline */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-black text-base uppercase tracking-tight text-black flex items-center gap-2">
                <Layers size={18} className="text-amber-500" />
                <span>CHRONOLOGISCH PAGINAPAD IN DEZE SESSIE ({session.steps.length} STAPPEN)</span>
              </h3>
              <span className="text-xs font-mono text-slate-500 font-bold">
                Totaal: {formatDuration(session.durationSeconds)}
              </span>
            </div>

            <div className="space-y-3 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-300">
              {session.steps.map((step, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === session.steps.length - 1;
                const pageName = getPageDisplayName(step.page);
                const pageIcon = getPageIcon(step.page);

                return (
                  <div
                    key={idx}
                    className="relative flex items-start gap-3 pl-1"
                  >
                    {/* Number Badge */}
                    <div
                      className={`w-9 h-9 border-2 border-black flex items-center justify-center font-display font-black text-xs shrink-0 z-10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                        isFirst
                          ? 'bg-amber-400 text-black'
                          : isLast
                          ? 'bg-black text-amber-400'
                          : 'bg-white text-black'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    {/* Step Card */}
                    <div className="flex-1 bg-white border-2 border-black p-3.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:border-amber-400 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{pageIcon}</span>
                          <span className="font-display font-black text-sm uppercase text-black">
                            {pageName}
                          </span>

                          {isFirst && (
                            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide">
                              INSTAPPAGINA
                            </span>
                          )}
                          {isLast && session.steps.length > 1 && (
                            <span className="bg-slate-200 text-slate-800 border border-slate-400 font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide">
                              UITSTAPPAGINA
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 font-semibold shrink-0">
                          <Clock size={12} />
                          <span>{formatTime(step.timestamp)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1.5 border-t border-slate-100 text-slate-600">
                        <div className="font-mono text-[11px] text-slate-500">
                          Pagina-id: <code className="bg-slate-100 px-1 py-0.5 border border-slate-200 text-black">{step.page}</code>
                        </div>

                        {step.timeSpentSeconds !== undefined ? (
                          <div className="text-xs font-bold text-black flex items-center gap-1 bg-amber-50 px-2 py-0.5 border border-amber-200">
                            <span>Tijd op pagina:</span>
                            <span className="font-mono text-amber-900 font-black">
                              {formatDuration(step.timeSpentSeconds)}
                            </span>
                          </div>
                        ) : isLast ? (
                          <div className="text-[11px] font-bold text-slate-500 italic">
                            Einde van deze sessie
                          </div>
                        ) : null}
                      </div>

                      {step.action && (
                        <div className="mt-2 text-xs bg-slate-50 border border-slate-200 p-1.5 font-mono text-slate-700 flex items-center gap-1.5">
                          <MousePointerClick size={12} className="text-sky-600" />
                          <span>Interactie: {step.action}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer with Previous / Next session navigation */}
        <div className="bg-slate-50 border-t-2 border-black p-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => prevSession && onSelectSession(prevSession)}
              disabled={!prevSession}
              className={`px-3 py-1.5 border-2 border-black font-display font-black text-xs uppercase flex items-center gap-1 transition-all ${
                prevSession
                  ? 'bg-white hover:bg-slate-100 text-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-60'
              }`}
            >
              <ChevronLeft size={14} />
              <span>VORIGE SESSIE</span>
            </button>

            <button
              onClick={() => nextSession && onSelectSession(nextSession)}
              disabled={!nextSession}
              className={`px-3 py-1.5 border-2 border-black font-display font-black text-xs uppercase flex items-center gap-1 transition-all ${
                nextSession
                  ? 'bg-white hover:bg-slate-100 text-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed opacity-60'
              }`}
            >
              <span>VOLGENDE SESSIE</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-black text-amber-400 hover:bg-slate-900 border-2 border-black font-display font-black text-xs uppercase tracking-wider cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            SLUITEN
          </button>
        </div>
      </div>
    </div>
  );
};
