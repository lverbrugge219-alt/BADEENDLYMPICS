import React, { useEffect } from 'react';
import { X, ScrollText } from 'lucide-react';
import { GeneralRulesView } from './GeneralRulesView';

interface GeneralRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeneralRulesModal: React.FC<GeneralRulesModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Close on Escape key press and lock background scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="general-rules-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="general-rules-modal-title"
    >
      <div
        className="bg-white border-2 border-black w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-amber-400 border-b-2 border-black px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-black text-amber-400 border border-black flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              <ScrollText size={18} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-black/70 block leading-tight">
                GELDT VOOR ELK SPEL
              </span>
              <h2
                id="general-rules-modal-title"
                className="font-display font-black text-lg sm:text-2xl uppercase tracking-tight text-black leading-tight"
              >
                Algemeen Reglement — BADEENDLYMPICS
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Sluit reglement"
            className="w-9 h-9 bg-black text-white hover:bg-slate-800 border border-black flex items-center justify-center transition-transform active:scale-95 cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body with full unabridged rules */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50">
          <GeneralRulesView showTitle={false} />
        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t-2 border-black px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 shrink-0">
          <span className="text-[11px] font-bold text-slate-600 hidden sm:inline">
            14 officiële toernooiregels • Scouting Van Brederode
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-black text-white hover:bg-slate-800 border-2 border-black font-display font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
          >
            BEGREPEN & SLUITEN
          </button>
        </div>
      </div>
    </div>
  );
};
