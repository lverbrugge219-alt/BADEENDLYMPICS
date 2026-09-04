import React from 'react';
import { PresetAvatarId } from '../types';
import { User, Sparkles, Shield, Eye, Compass, Glasses } from 'lucide-react';

export interface JuryAvatarProps {
  avatarType?: 'preset' | 'custom';
  avatarPresetId?: PresetAvatarId;
  photoUrl?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showBadge?: boolean;
  alt?: string;
}

export const JuryAvatar: React.FC<JuryAvatarProps> = ({
  avatarType = 'preset',
  avatarPresetId = 'duck-referee',
  photoUrl,
  className = '',
  size = 'md',
  showBadge = false,
  alt = 'Avatar',
}) => {
  const safePresetId: PresetAvatarId = (avatarPresetId as PresetAvatarId) || 'duck-referee';
  const sizeClasses = {
    xs: 'w-8 h-8',
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
          alt={alt}
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
    case 'duck-beer':
      return 'bg-amber-100';
    case 'duck-beer-helmet':
      return 'bg-rose-100';
    case 'duck-scout':
      return 'bg-emerald-100';
    case 'duck-campfire':
      return 'bg-orange-100';
    case 'duck-athlete':
      return 'bg-blue-100';
    case 'duck-weightlifter':
      return 'bg-slate-200';
    case 'duck-swimmer':
      return 'bg-cyan-100';
    case 'duck-referee':
      return 'bg-zinc-100';
    case 'duck-gold':
      return 'bg-gradient-to-b from-amber-200 to-amber-400';
    case 'duck-sunglasses':
      return 'bg-purple-100';
    // Fallbacks
    case 'duck-judge-wig':
      return 'bg-amber-100';
    case 'duck-detective':
      return 'bg-stone-200';
    case 'duck-captain':
      return 'bg-sky-200';
    case 'duck-pirate':
      return 'bg-rose-100';
    case 'duck-whistle':
      return 'bg-emerald-100';
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
    case 'duck-beer':
      return 'BIERPUL';
    case 'duck-beer-helmet':
      return 'BIERHELM';
    case 'duck-scout':
      return 'PADVINDER';
    case 'duck-campfire':
      return 'KAMPVUUR';
    case 'duck-athlete':
      return 'ATLEET';
    case 'duck-weightlifter':
      return 'KRACHTPATSER';
    case 'duck-swimmer':
      return 'DUIKER';
    case 'duck-referee':
      return 'SCHEIDS';
    case 'duck-gold':
      return 'KAMPIOEN';
    case 'duck-sunglasses':
      return 'DERDE HELFT';
    // Fallbacks
    case 'duck-judge-wig':
      return 'EDELACHTBARE';
    case 'duck-detective':
      return 'SPEURNEUS';
    case 'duck-captain':
      return 'KAPITEIN';
    case 'duck-pirate':
      return 'PIRAAT';
    case 'duck-whistle':
      return 'STOPWATCH';
    case 'duck-wizard':
      return 'MAGIËR';
    default:
      return 'BADEEND';
  }
}

function renderAccessory(id: PresetAvatarId | string) {
  switch (id) {
    case 'duck-beer':
      return (
        <g id="beer-acc">
          {/* Glass beer mug in wing area */}
          {/* Handle */}
          <path d="M46 60C49 60 52 64 52 68C52 72 49 76 46 76" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
          {/* Glass body with amber beer */}
          <rect x="34" y="58" width="14" height="20" rx="1.5" fill="#F59E0B" stroke="#000000" strokeWidth="2" />
          {/* Beer glass vertical facets */}
          <line x1="38" y1="62" x2="38" y2="76" stroke="#D97706" strokeWidth="1.5" />
          <line x1="43" y1="62" x2="43" y2="76" stroke="#FEF08A" strokeWidth="1.5" />
          {/* Fluffy white beer foam head */}
          <circle cx="34" cy="58" r="3.5" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
          <circle cx="39" cy="56" r="4.5" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
          <circle cx="45" cy="57" r="3.5" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
          <circle cx="48" cy="60" r="2.5" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
          {/* Little beer bubbles */}
          <circle cx="37" cy="70" r="0.8" fill="#FFFFFF" />
          <circle cx="41" cy="66" r="1" fill="#FFFFFF" />
          <circle cx="44" cy="72" r="0.8" fill="#FFFFFF" />
        </g>
      );

    case 'duck-beer-helmet':
      return (
        <g id="beer-helmet-acc">
          {/* Red drinking helmet */}
          <path d="M50 24C50 12 76 12 78 24Z" fill="#DC2626" stroke="#000000" strokeWidth="2.5" />
          <path d="M46 24L82 24" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
          {/* Left can bracket & beer can */}
          <rect x="42" y="10" width="8" height="13" rx="1" fill="#2563EB" stroke="#000000" strokeWidth="1.5" />
          <rect x="43" y="13" width="6" height="4" fill="#FFFFFF" />
          <line x1="42" y1="19" x2="50" y2="19" stroke="#000000" strokeWidth="1" />
          {/* Right can bracket & beer can */}
          <rect x="76" y="10" width="8" height="13" rx="1" fill="#2563EB" stroke="#000000" strokeWidth="1.5" />
          <rect x="77" y="13" width="6" height="4" fill="#FFFFFF" />
          <line x1="76" y1="19" x2="84" y2="19" stroke="#000000" strokeWidth="1" />
          {/* Straws looping down to beak */}
          <path d="M46 10C46 5 56 6 60 14" fill="none" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
          <path d="M80 10C80 5 70 6 64 14" fill="none" stroke="#FDE047" strokeWidth="2" strokeLinecap="round" />
          <path d="M62 14L78 37" fill="none" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );

    case 'duck-scout':
      return (
        <g id="scout-acc">
          {/* Baden-Powell 4-dent scout hat */}
          <ellipse cx="64" cy="24" rx="19" ry="5" fill="#78350F" stroke="#000000" strokeWidth="2" />
          <path d="M52 23C52 13 56 12 60 14C62 12 66 12 68 14C72 12 76 13 76 23Z" fill="#92400E" stroke="#000000" strokeWidth="2" />
          <rect x="52" y="21" width="24" height="2.5" fill="#1E3A8A" />
          {/* Scoutingdas (neckerchief) around neck: half red, half navy */}
          <path d="M52 46C55 52 64 56 64 56L58 48Z" fill="#DC2626" stroke="#000000" strokeWidth="1.5" />
          <path d="M64 56C64 56 73 52 76 46L70 48Z" fill="#1E3A8A" stroke="#000000" strokeWidth="1.5" />
          {/* Leather woggle / dasring */}
          <ellipse cx="64" cy="54" rx="2.5" ry="3.5" fill="#D97706" stroke="#000000" strokeWidth="1.5" />
          {/* Scarf tails */}
          <path d="M62 56L61 66L64 64L66 67L65 56" fill="#DC2626" stroke="#000000" strokeWidth="1.5" />
        </g>
      );

    case 'duck-campfire':
      return (
        <g id="campfire-acc">
          {/* Scout neckerchief */}
          <path d="M54 46C58 52 64 54 64 54C64 54 70 52 74 46" fill="#15803D" stroke="#000000" strokeWidth="2" />
          <circle cx="64" cy="53" r="2" fill="#B45309" stroke="#000000" strokeWidth="1" />
          {/* Campfire stick in wing with roasted marshmallow */}
          <line x1="26" y1="76" x2="52" y2="44" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          {/* Marshmallow */}
          <rect x="48" y="42" width="7" height="9" rx="2" fill="#F8FAFC" stroke="#000000" strokeWidth="1.5" transform="rotate(-35 48 42)" />
          <path d="M49 41L54 44" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
          {/* Little fire embers */}
          <circle cx="28" cy="54" r="1.5" fill="#EF4444" />
          <circle cx="32" cy="48" r="1" fill="#F59E0B" />
        </g>
      );

    case 'duck-athlete':
      return (
        <g id="athlete-acc">
          {/* 80s Retro Striped Athletic Headband */}
          <rect x="48" y="24" width="30" height="7" rx="2" fill="#FFFFFF" stroke="#000000" strokeWidth="2" />
          <rect x="48" y="25.5" width="30" height="2" fill="#EF4444" />
          <rect x="48" y="28" width="30" height="1.5" fill="#2563EB" />
          {/* Badeendlympics Ribbon around neck */}
          <path d="M54 44L64 56L74 44" fill="none" stroke="#2563EB" strokeWidth="2.5" />
          {/* Gold Medal */}
          <circle cx="64" cy="60" r="5" fill="#FBBF24" stroke="#000000" strokeWidth="1.5" />
          <circle cx="64" cy="60" r="3" fill="#F59E0B" />
          <path d="M64 58L64.5 59.5L66 59.5L64.8 60.5L65.2 62L64 61L62.8 62L63.2 60.5L62 59.5L63.5 59.5Z" fill="#FFFFFF" />
        </g>
      );

    case 'duck-weightlifter':
      return (
        <g id="weightlifter-acc">
          {/* Red athletic wristband */}
          <rect x="34" y="56" width="6" height="5" rx="1" fill="#DC2626" stroke="#000000" strokeWidth="1.5" />
          {/* Heavy Cast Iron Dumbbell */}
          {/* Bar */}
          <line x1="24" y1="68" x2="48" y2="52" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
          {/* Left Weight Plates */}
          <rect x="20" y="64" width="5" height="15" rx="1.5" fill="#18181B" stroke="#000000" strokeWidth="2" transform="rotate(-33 22 71)" />
          <rect x="23" y="66" width="3" height="11" rx="1" fill="#3F3F46" stroke="#000000" strokeWidth="1.5" transform="rotate(-33 24 71)" />
          {/* Right Weight Plates */}
          <rect x="44" y="47" width="5" height="15" rx="1.5" fill="#18181B" stroke="#000000" strokeWidth="2" transform="rotate(-33 46 54)" />
          <rect x="42" y="49" width="3" height="11" rx="1" fill="#3F3F46" stroke="#000000" strokeWidth="1.5" transform="rotate(-33 44 54)" />
          {/* Determined intense eyebrow */}
          <line x1="66" y1="26" x2="74" y2="28" stroke="#000000" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );

    case 'duck-sunglasses':
      return (
        <g id="sunglasses-acc">
          {/* Festival Bucket Hat (Vissershoedje) */}
          <path d="M48 23L52 14C56 12 72 12 76 14L80 23Z" fill="#10B981" stroke="#000000" strokeWidth="2" />
          <path d="M44 23C56 21 72 21 84 23L88 27L40 27Z" fill="#059669" stroke="#000000" strokeWidth="2" />
          {/* Snelle Planga (Fast Festival Sunglasses) */}
          <path d="M54 28L80 27L82 33L74 37L62 36L56 34Z" fill="#0F172A" stroke="#000000" strokeWidth="2" />
          {/* Iridescent / neon lens reflection */}
          <line x1="58" y1="31" x2="72" y2="30" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="62" y1="33" x2="76" y2="32" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      );

    case 'duck-gold':
      return (
        <g id="gold-crown-acc">
          {/* Shiny Golden Crown & Laurel with Jewels */}
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
          {/* Golden Trophy Cup in wing */}
          <path d="M30 62L34 74H40L44 62Z" fill="#FBBF24" stroke="#000000" strokeWidth="2" />
          <path d="M28 64C26 64 26 68 29 70" fill="none" stroke="#000000" strokeWidth="1.5" />
          <path d="M46 64C48 64 48 68 45 70" fill="none" stroke="#000000" strokeWidth="1.5" />
          <rect x="33" y="74" width="8" height="3" fill="#78350F" stroke="#000000" strokeWidth="1.5" />
        </g>
      );

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
    default:
      return null;
  }
}

export const TeamAvatar = JuryAvatar;
export const DuckAvatar = JuryAvatar;

