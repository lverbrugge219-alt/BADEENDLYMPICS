import React from 'react';
import { PresetAvatarId } from '../types';
import { User, Sparkles, Shield, Eye, Compass, Glasses } from 'lucide-react';

interface JuryAvatarProps {
  avatarType: 'preset' | 'custom';
  avatarPresetId?: PresetAvatarId;
  photoUrl?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showBadge?: boolean;
}

export const JuryAvatar: React.FC<JuryAvatarProps> = ({
  avatarType,
  avatarPresetId = 'duck-referee',
  photoUrl,
  className = '',
  size = 'md',
  showBadge = false,
}) => {
  const safePresetId: PresetAvatarId = (avatarPresetId as PresetAvatarId) || 'duck-referee';
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
    '2xl': 'w-40 h-40',
  };

  // If custom photo is provided and valid
  if (avatarType === 'custom' && photoUrl) {
    return (
      <div
        className={`relative border-2 border-black bg-amber-50 overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${sizeClasses[size]} ${className}`}
      >
        <img
          src={photoUrl}
          alt="Jury Avatar"
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {showBadge && (
          <div className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] sm:text-[9px] font-black text-amber-300 text-center py-0.5 uppercase tracking-tighter">
            EIGEN FOTO
          </div>
        )}
      </div>
    );
  }

  // Render Preset Duck Vector Graphics
  return (
    <div
      className={`relative border-2 border-black overflow-hidden flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${sizeClasses[size]} ${className} ${getPresetBg(
        safePresetId
      )}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full p-1" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Base Duck Shape */}
        <g>
          {/* Duck Body */}
          <path
            d="M20 58C20 48 30 42 45 42C62 42 75 48 85 58C92 65 88 82 72 84C55 86 32 86 22 80C18 76 20 65 20 58Z"
            fill={getDuckBodyColor(safePresetId)}
            stroke="#000000"
            strokeWidth="3"
          />
          {/* Wing */}
          <path
            d="M32 58C36 50 48 50 58 56C65 60 62 70 50 72C40 73 30 68 32 58Z"
            fill={getDuckWingColor(safePresetId)}
            stroke="#000000"
            strokeWidth="2.5"
          />
          {/* Duck Head */}
          <circle
            cx="64"
            cy="36"
            r="20"
            fill={getDuckBodyColor(safePresetId)}
            stroke="#000000"
            strokeWidth="3"
          />
          {/* Beak / Snavel */}
          <path
            d="M78 35C86 33 96 36 94 42C90 47 80 44 76 43Z"
            fill="#F97316"
            stroke="#000000"
            strokeWidth="2.5"
          />
          {/* Eye */}
          <circle cx="70" cy="30" r="3.5" fill="#000000" />
          <circle cx="71" cy="29" r="1.2" fill="#FFFFFF" />
        </g>

        {/* Preset Specific Accessories */}
        {renderAccessory(safePresetId)}
      </svg>

      {showBadge && (
        <div className="absolute bottom-0 inset-x-0 bg-black text-[7px] sm:text-[8px] font-black text-amber-300 text-center py-0.5 uppercase tracking-tighter truncate px-0.5">
          {getPresetLabel(safePresetId)}
        </div>
      )}
    </div>
  );
};

function getPresetBg(id: PresetAvatarId | string): string {
  switch (id) {
    case 'duck-referee':
      return 'bg-zinc-100';
    case 'duck-judge-wig':
      return 'bg-amber-100';
    case 'duck-gold':
      return 'bg-gradient-to-b from-amber-200 to-amber-400';
    case 'duck-detective':
      return 'bg-stone-200';
    case 'duck-captain':
      return 'bg-sky-200';
    case 'duck-sunglasses':
      return 'bg-purple-100';
    case 'duck-pirate':
      return 'bg-rose-100';
    case 'duck-whistle':
      return 'bg-emerald-100';
    case 'duck-swimmer':
      return 'bg-cyan-200';
    case 'duck-wizard':
      return 'bg-indigo-100';
    default:
      return 'bg-amber-50';
  }
}

function getDuckBodyColor(id: PresetAvatarId | string): string {
  if (id === 'duck-gold') return '#FBBF24';
  return '#FACC15';
}

function getDuckWingColor(id: PresetAvatarId | string): string {
  if (id === 'duck-gold') return '#F59E0B';
  return '#EAB308';
}

function getPresetLabel(id: PresetAvatarId | string): string {
  switch (id) {
    case 'duck-referee':
      return 'SCHEIDSRECHTER';
    case 'duck-judge-wig':
      return 'EDELACHTBARE';
    case 'duck-gold':
      return 'GOUDEN JURY';
    case 'duck-detective':
      return 'SPEURNEUS';
    case 'duck-captain':
      return 'KAPITEIN';
    case 'duck-sunglasses':
      return 'COOL JURYLID';
    case 'duck-pirate':
      return 'PIRAAT';
    case 'duck-whistle':
      return 'STOPWATCH';
    case 'duck-swimmer':
      return 'DUIKER';
    case 'duck-wizard':
      return 'MAGIËR';
    default:
      return 'JURY';
  }
}

function renderAccessory(id: PresetAvatarId | string) {
  switch (id) {
    case 'duck-referee':
      return (
        <g id="referee-acc">
          {/* Black & White striped referee cap */}
          <path
            d="M52 24C52 14 74 14 78 24Z"
            fill="#FFFFFF"
            stroke="#000000"
            strokeWidth="2"
          />
          <path d="M58 16L58 24M64 14L64 24M70 16L70 24" stroke="#000000" strokeWidth="2" />
          <path d="M72 24C78 24 84 26 84 28" stroke="#000000" strokeWidth="2.5" />
          {/* Whistle hanging around neck */}
          <circle cx="56" cy="50" r="3" fill="#A1A1AA" stroke="#000" strokeWidth="1.5" />
          <path d="M54 50L46 54" stroke="#000" strokeWidth="1.5" />
          <path d="M60 42C58 48 56 50 56 50" stroke="#000" strokeWidth="1" strokeDasharray="2 2" />
        </g>
      );

    case 'duck-judge-wig':
      return (
        <g id="judge-wig-acc">
          {/* Traditional White Powdered Wig */}
          <circle cx="54" cy="22" r="7" fill="#F4F4F5" stroke="#000" strokeWidth="2" />
          <circle cx="64" cy="18" r="8" fill="#F4F4F5" stroke="#000" strokeWidth="2" />
          <circle cx="74" cy="22" r="7" fill="#F4F4F5" stroke="#000" strokeWidth="2" />
          <circle cx="50" cy="32" r="6" fill="#E4E4E7" stroke="#000" strokeWidth="2" />
          <circle cx="48" cy="42" r="6" fill="#E4E4E7" stroke="#000" strokeWidth="2" />
          {/* Judge Wooden Gavel in wing */}
          <rect x="22" y="60" width="14" height="6" fill="#78350F" stroke="#000" strokeWidth="1.5" />
          <line x1="29" y1="66" x2="34" y2="76" stroke="#78350F" strokeWidth="3" />
        </g>
      );

    case 'duck-gold':
      return (
        <g id="gold-crown-acc">
          {/* Shiny Golden Crown with Jewels */}
          <path
            d="M52 20L56 10L64 16L72 10L76 20Z"
            fill="#FBBF24"
            stroke="#000000"
            strokeWidth="2.5"
          />
          <circle cx="56" cy="10" r="2" fill="#EF4444" stroke="#000" strokeWidth="1" />
          <circle cx="64" cy="16" r="2" fill="#3B82F6" stroke="#000" strokeWidth="1" />
          <circle cx="72" cy="10" r="2" fill="#10B981" stroke="#000" strokeWidth="1" />
          {/* Sparkles */}
          <path d="M84 14L86 10L88 14L92 16L88 18L86 22L84 18L80 16Z" fill="#FFFFFF" stroke="#000" strokeWidth="1" />
        </g>
      );

    case 'duck-detective':
      return (
        <g id="detective-acc">
          {/* Deerstalker Hat */}
          <path
            d="M50 24C52 14 74 14 78 24L84 27L46 27Z"
            fill="#78350F"
            stroke="#000000"
            strokeWidth="2"
          />
          <circle cx="64" cy="13" r="2" fill="#B45309" />
          {/* Magnifying Glass */}
          <circle cx="78" cy="40" r="9" fill="#E0F2FE" fillOpacity="0.5" stroke="#000" strokeWidth="2.5" />
          <line x1="72" y1="46" x2="62" y2="56" stroke="#000" strokeWidth="3" strokeLinecap="round" />
        </g>
      );

    case 'duck-captain':
      return (
        <g id="captain-acc">
          {/* Navy Captain Hat */}
          <path
            d="M50 24C52 12 74 12 78 24Z"
            fill="#1E3A8A"
            stroke="#000000"
            strokeWidth="2"
          />
          <rect x="48" y="22" width="34" height="4" fill="#000000" />
          <path d="M76 24C82 24 88 26 86 28" stroke="#000000" strokeWidth="2.5" />
          {/* Gold Anchor Emblem */}
          <circle cx="64" cy="18" r="2.5" fill="#FBBF24" stroke="#000" strokeWidth="1" />
        </g>
      );

    case 'duck-sunglasses':
      return (
        <g id="sunglasses-acc">
          {/* Cool Dark Sunglasses */}
          <path
            d="M62 26C62 33 76 34 76 26Z"
            fill="#000000"
            stroke="#000000"
            strokeWidth="2"
          />
          <path
            d="M52 26C52 33 60 34 60 26Z"
            fill="#000000"
            stroke="#000000"
            strokeWidth="2"
          />
          <line x1="60" y1="28" x2="62" y2="28" stroke="#000000" strokeWidth="2.5" />
          <line x1="76" y1="27" x2="82" y2="25" stroke="#000000" strokeWidth="2" />
          {/* Glare on sunglasses */}
          <line x1="66" y1="28" x2="72" y2="30" stroke="#FFFFFF" strokeWidth="1.5" />
        </g>
      );

    case 'duck-pirate':
      return (
        <g id="pirate-acc">
          {/* Pirate Eye Patch */}
          <circle cx="70" cy="30" r="5" fill="#000000" />
          <line x1="60" y1="24" x2="78" y2="36" stroke="#000000" strokeWidth="1.5" />
          {/* Pirate Tricorne Hat */}
          <path
            d="M44 20L64 8L84 20L78 24L50 24Z"
            fill="#18181B"
            stroke="#000000"
            strokeWidth="2"
          />
          <circle cx="64" cy="16" r="2" fill="#FFFFFF" />
        </g>
      );

    case 'duck-whistle':
      return (
        <g id="whistle-acc">
          {/* Sweatband */}
          <rect x="52" y="20" width="24" height="5" rx="2" fill="#EF4444" stroke="#000" strokeWidth="1.5" />
          {/* Stopwatch in wing */}
          <circle cx="36" cy="62" r="7" fill="#E4E4E7" stroke="#000" strokeWidth="2" />
          <circle cx="36" cy="62" r="5" fill="#FFFFFF" />
          <line x1="36" y1="62" x2="36" y2="59" stroke="#000" strokeWidth="1.5" />
          <line x1="36" y1="62" x2="39" y2="62" stroke="#EF4444" strokeWidth="1.5" />
        </g>
      );

    case 'duck-swimmer':
      return (
        <g id="swimmer-acc">
          {/* Diving Goggles */}
          <ellipse cx="68" cy="30" rx="6" ry="5" fill="#38BDF8" fillOpacity="0.6" stroke="#000" strokeWidth="2" />
          <ellipse cx="56" cy="30" rx="5" ry="5" fill="#38BDF8" fillOpacity="0.6" stroke="#000" strokeWidth="2" />
          <line x1="61" y1="30" x2="62" y2="30" stroke="#000" strokeWidth="2" />
          {/* Snorkel tube */}
          <path d="M76 34C82 34 86 28 86 16L84 14" fill="none" stroke="#F97316" strokeWidth="3" strokeLinecap="round" />
        </g>
      );

    case 'duck-wizard':
      return (
        <g id="wizard-acc">
          {/* Wizard Cone Hat */}
          <path
            d="M48 24L66 4L78 24Z"
            fill="#4338CA"
            stroke="#000000"
            strokeWidth="2"
          />
          <path d="M44 24C56 21 72 21 82 24" stroke="#000000" strokeWidth="2.5" />
          {/* Star on hat */}
          <circle cx="64" cy="14" r="2" fill="#FACC15" />
        </g>
      );
  }
}
