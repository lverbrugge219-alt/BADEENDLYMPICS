import React from 'react';
import {
  Users,
  Beer,
  FlaskConical,
  AlertTriangle,
  Timer,
  ScrollText,
} from 'lucide-react';
import {
  GENERAL_RULES_PREAMBLE,
  GENERAL_RULES_SECTIONS,
  GeneralRuleSection,
} from '../data/generalRules';

interface GeneralRulesViewProps {
  showTitle?: boolean;
  className?: string;
}

export const GeneralRulesView: React.FC<GeneralRulesViewProps> = ({
  showTitle = true,
  className = '',
}) => {
  const getSectionIcon = (iconName: GeneralRuleSection['iconName']) => {
    switch (iconName) {
      case 'team':
        return <Users size={22} className="text-black" />;
      case 'beer':
        return <Beer size={22} className="text-black" />;
      case 'flask':
        return <FlaskConical size={22} className="text-black" />;
      case 'alert':
        return <AlertTriangle size={22} className="text-black" />;
      case 'timer':
        return <Timer size={22} className="text-black" />;
      default:
        return <ScrollText size={22} className="text-black" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {showTitle && (
        <div className="border-b-2 border-black pb-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <ScrollText size={22} className="text-black" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-600 block">
                OFFICIEEL REGLEMENT
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tight text-black">
                Algemeen Reglement — BADEENDLYMPICS
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* Preamble Notice */}
      <div className="p-4 sm:p-5 bg-amber-100/70 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <p className="text-xs sm:text-sm font-semibold text-amber-950 leading-relaxed">
          {GENERAL_RULES_PREAMBLE}
        </p>
      </div>

      {/* The 5 Thematic Sections */}
      <div className="space-y-6">
        {GENERAL_RULES_SECTIONS.map((section) => (
          <div
            key={section.id}
            id={`reglement-${section.id}`}
            className="bg-white border-2 border-black p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            {/* Section Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b-2 border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-amber-400 border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {getSectionIcon(section.iconName)}
                </div>
                <h3 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-black">
                  {section.title}
                </h3>
              </div>
              <span className="px-2.5 py-1 bg-slate-100 border border-black text-[11px] font-black uppercase tracking-wider text-slate-800">
                {section.badge}
              </span>
            </div>

            {/* Rules List (Numbered 1..14 with unabridged text) */}
            <div className="space-y-3.5">
              {section.rules.map((rule) => (
                <div
                  key={rule.number}
                  className="flex items-start gap-3 sm:gap-4 p-3 bg-slate-50/80 border border-black/20 hover:border-black transition-colors"
                >
                  <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-black text-amber-400 border border-black font-display font-black text-xs sm:text-sm flex items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] mt-0.5">
                    {rule.number}
                  </span>
                  <p className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed pt-0.5">
                    {rule.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
