import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Check, Info, FileText } from 'lucide-react';
import { PageRoute } from '../types';
import { getCookieConsent, setCookieConsent, initGoogleAnalytics } from '../utils/analytics';

interface CookieBannerProps {
  onNavigate?: (page: PageRoute) => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onNavigate }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      // Small delay for smooth entrance
      const timer = setTimeout(() => setShowBanner(true), 800);
      return () => clearTimeout(timer);
    } else if (consent === 'accepted') {
      initGoogleAnalytics();
    }
  }, []);

  const handleAcceptAll = () => {
    setCookieConsent('accepted');
    initGoogleAnalytics();
    setShowBanner(false);
  };

  const handleEssentialOnly = () => {
    setCookieConsent('essential');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      id="cookie-consent-banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="bg-white border-2 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-9 h-9 bg-amber-400 border-2 border-black flex items-center justify-center shrink-0">
            <Cookie size={20} className="text-black" />
          </div>
          <div>
            <h3 className="font-display font-black text-sm uppercase tracking-tight text-black">
              KOEKJES & STATISTIEKEN
            </h3>
            <p className="text-xs text-slate-700 font-medium leading-relaxed mt-1">
              Wij gebruiken first-party cookies om het gebruik van de Badeendlympics app te meten en te verbeteren. Lees meer in onze{' '}
              {onNavigate ? (
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('privacy');
                    setShowBanner(false);
                  }}
                  className="font-bold text-black underline hover:text-amber-600 cursor-pointer inline"
                >
                  privacyverklaring
                </button>
              ) : (
                <span className="font-bold text-black underline">privacyverklaring</span>
              )}
              .
            </p>
          </div>
        </div>

        {/* Details Toggle */}
        {showDetails && (
          <div className="my-3 p-3 bg-slate-50 border border-black text-[11px] space-y-2 text-slate-800">
            <div className="font-bold flex items-center gap-1.5 text-black">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>Welke cookies plaatsen we?</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>
                <strong className="text-black">badeend_uid</strong>: Uniek anoniem bezoekers-ID voor statistieken (1 jaar).
              </li>
              <li>
                <strong className="text-black">badeend_sid</strong>: Sessie-ID voor actieve bezoeken (30 min).
              </li>
              <li>
                <strong className="text-black">badeend_consent</strong>: Onthoudt jouw cookie-keuze.
              </li>
            </ul>
            <div className="flex items-center justify-between pt-1 border-t border-slate-200">
              <span className="text-[10px] text-slate-500">
                Geen commerciële advertentietracking.
              </span>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('privacy');
                    setShowBanner(false);
                  }}
                  className="text-[10px] font-bold text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <FileText size={10} />
                  <span>Volledige privacyverklaring</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={handleAcceptAll}
              className="flex-1 py-2 px-3 bg-amber-400 hover:bg-amber-300 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Check size={14} />
              <span>ACCEPTEER ALLES</span>
            </button>
            <button
              onClick={handleEssentialOnly}
              className="py-2 px-3 bg-white hover:bg-slate-100 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black cursor-pointer transition-all"
            >
              FUNCTIONEEL
            </button>
          </div>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-[11px] font-bold text-slate-600 hover:text-black text-center flex items-center justify-center gap-1 cursor-pointer pt-1"
          >
            <Info size={12} />
            <span>{showDetails ? 'Verberg details' : 'Bekijk details & cookies'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

