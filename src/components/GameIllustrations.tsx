import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

/**
 * 1. BADEEND (Standard Yellow Rubber Duck)
 * Classic cheerful yellow rubber duck with big shiny eye, perky tail, orange bill,
 * bold black sticker outline, matching the user's illustration banner.
 */
export const BadeendIllustration: React.FC<IllustrationProps> = ({ className = 'w-12 h-12', size }) => (
  <svg
    viewBox="0 0 120 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      {/* Body Gradient */}
      <radialGradient id="badeend-body" cx="45%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFF275" />
        <stop offset="55%" stopColor="#FACC15" />
        <stop offset="90%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#CA8A04" />
      </radialGradient>
      {/* Head Gradient */}
      <radialGradient id="badeend-head" cx="40%" cy="30%" r="60%">
        <stop offset="0%" stopColor="#FFF9A6" />
        <stop offset="60%" stopColor="#FACC15" />
        <stop offset="95%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#CA8A04" />
      </radialGradient>
      {/* Beak Gradient */}
      <linearGradient id="badeend-beak" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FB923C" />
        <stop offset="70%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#C2410C" />
      </linearGradient>
      {/* Subtle Shadow */}
      <linearGradient id="badeend-belly-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#EAB308" stopOpacity="0" />
        <stop offset="100%" stopColor="#B45309" stopOpacity="0.4" />
      </linearGradient>
    </defs>

    {/* Tail feathers & Main chubby body */}
    <path
      d="M 14 56 C 8 50 14 36 28 38 C 34 39 42 42 50 46 C 65 42 85 45 96 54 C 108 64 106 82 98 90 C 88 100 60 102 36 98 C 18 94 12 80 14 68 C 15 62 13 58 14 56 Z"
      fill="url(#badeend-body)"
      stroke="#18181B"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />

    {/* Belly bottom shade curve */}
    <path
      d="M 22 82 C 34 94 62 98 88 92 C 96 86 102 76 100 68 C 96 82 76 92 50 92 C 32 92 24 86 22 82 Z"
      fill="url(#badeend-belly-shadow)"
    />

    {/* Wing definition */}
    <path
      d="M 38 60 C 50 54 68 56 74 66 C 78 74 72 82 58 84 C 44 86 34 76 34 68 C 34 64 36 61 38 60 Z"
      fill="#FDE047"
      stroke="#18181B"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 48 64 C 58 64 64 70 66 76"
      stroke="#CA8A04"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Head */}
    <circle
      cx="68"
      cy="34"
      r="25"
      fill="url(#badeend-head)"
      stroke="#18181B"
      strokeWidth="4.5"
    />

    {/* Cheek shine highlight */}
    <ellipse
      cx="56"
      cy="24"
      rx="7"
      ry="4"
      transform="rotate(-25 56 24)"
      fill="#FFFFFF"
      fillOpacity="0.45"
    />

    {/* Orange Duck Bill / Beak */}
    <path
      d="M 76 38 C 86 36 104 38 108 44 C 109 48 104 53 92 53 C 82 53 74 48 76 38 Z"
      fill="url(#badeend-beak)"
      stroke="#18181B"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <path
      d="M 80 44 C 90 44 98 46 104 46"
      stroke="#9A3412"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Big glossy cartoon eye (facing right) */}
    <circle cx="68" cy="28" r="6" fill="#18181B" />
    <circle cx="70" cy="26" r="2.2" fill="#FFFFFF" />
    <circle cx="66.5" cy="30" r="1.1" fill="#FFFFFF" />
    {/* Subtle second eye eyebrow / hint */}
    <path
      d="M 50 26 C 51 23 54 22 56 23"
      stroke="#18181B"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * 2. PILS! (Cold Beer Glass with overflowing foam)
 * Frothy beer glass stein filled with golden amber beer, bubbles,
 * fluffy foam top, and big glass handle on right.
 */
export const PilsIllustration: React.FC<IllustrationProps> = ({ className = 'w-12 h-12', size }) => (
  <svg
    viewBox="0 0 115 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      {/* Beer Liquid Gradient */}
      <linearGradient id="pils-liquid" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="25%" stopColor="#F59E0B" />
        <stop offset="85%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
      {/* Foam Gradient */}
      <linearGradient id="pils-foam" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#FFFBEB" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
      {/* Glass Highlight */}
      <linearGradient id="pils-highlight" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
      </linearGradient>
    </defs>

    {/* Mug Handle on Right */}
    <path
      d="M 68 46 C 88 46 94 54 94 65 C 94 78 86 86 66 86"
      stroke="#18181B"
      strokeWidth="8"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 68 46 C 88 46 94 54 94 65 C 94 78 86 86 66 86"
      stroke="#F8FAFC"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />

    {/* Glass Mug Body */}
    <rect
      x="24"
      y="38"
      width="48"
      height="58"
      rx="6"
      fill="url(#pils-liquid)"
      stroke="#18181B"
      strokeWidth="4"
    />

    {/* Bottom Glass Base */}
    <path
      d="M 22 94 C 22 92 26 92 30 92 L 66 92 C 70 92 74 92 74 94 C 74 97 68 100 48 100 C 28 100 22 97 22 94 Z"
      fill="#E2E8F0"
      stroke="#18181B"
      strokeWidth="3.5"
    />

    {/* Glass vertical facets / highlights */}
    <rect x="29" y="42" width="6" height="48" rx="2" fill="url(#pils-highlight)" />
    <rect x="42" y="44" width="4" height="46" rx="1.5" fill="#FEF3C7" fillOpacity="0.4" />
    <rect x="56" y="44" width="5" height="46" rx="1.5" fill="#FEF3C7" fillOpacity="0.3" />

    {/* Carbonation bubbles inside beer */}
    <circle cx="34" cy="74" r="1.8" fill="#FFFFFF" fillOpacity="0.8" />
    <circle cx="38" cy="60" r="1.3" fill="#FFFFFF" fillOpacity="0.7" />
    <circle cx="48" cy="80" r="2.2" fill="#FFFFFF" fillOpacity="0.8" />
    <circle cx="52" cy="65" r="1.4" fill="#FFFFFF" fillOpacity="0.7" />
    <circle cx="58" cy="54" r="1.8" fill="#FFFFFF" fillOpacity="0.8" />
    <circle cx="62" cy="78" r="1.5" fill="#FFFFFF" fillOpacity="0.7" />

    {/* Big Fluffy Cloud Foam Head overflowing over the top and left */}
    <path
      d="M 20 40 
         C 14 36 14 26 24 24 
         C 24 16 34 14 40 18 
         C 46 12 58 12 64 18 
         C 72 16 78 24 76 32 
         C 80 36 78 44 72 44 
         L 24 44 
         C 18 44 18 42 20 40 Z"
      fill="url(#pils-foam)"
      stroke="#18181B"
      strokeWidth="4"
      strokeLinejoin="round"
    />

    {/* Foam drip overflowing down on the left */}
    <path
      d="M 22 42 C 20 44 20 54 25 56 C 28 56 29 48 29 44 Z"
      fill="#FFFFFF"
      stroke="#18181B"
      strokeWidth="3"
      strokeLinejoin="round"
    />

    {/* Foam detail lines & puffy highlights */}
    <path
      d="M 28 28 C 32 24 38 24 42 28"
      stroke="#F59E0B"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M 48 24 C 54 20 60 22 64 26"
      stroke="#F59E0B"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="34" cy="22" r="2" fill="#FFFFFF" />
    <circle cx="52" cy="18" r="2.5" fill="#FFFFFF" />
  </svg>
);

/**
 * 3. GOUDEN BADEEND (Shiny Metallic Golden Duck with Cheeky Wink)
 * Metallic gold finish, shiny reflections, winking eye, orange beak.
 */
export const GoudenBadeendIllustration: React.FC<IllustrationProps> = ({ className = 'w-12 h-12', size }) => (
  <svg
    viewBox="0 0 120 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      {/* Metallic Gold Body Gradient */}
      <linearGradient id="gold-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="25%" stopColor="#FACC15" />
        <stop offset="60%" stopColor="#CA8A04" />
        <stop offset="85%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#854D0E" />
      </linearGradient>
      {/* Metallic Gold Head Gradient */}
      <radialGradient id="gold-head" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#FEF9C3" />
        <stop offset="40%" stopColor="#FDE047" />
        <stop offset="75%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#713F12" />
      </radialGradient>
      {/* Beak */}
      <linearGradient id="gold-beak" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FB923C" />
        <stop offset="60%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#9A3412" />
      </linearGradient>
    </defs>

    {/* Tail feathers & Main body (Facing left in uploaded banner!) */}
    <path
      d="M 104 56 C 110 50 104 36 90 38 C 84 39 76 42 68 46 C 53 42 33 45 22 54 C 10 64 12 82 20 90 C 30 100 58 102 82 98 C 100 94 106 80 104 68 C 103 62 105 58 104 56 Z"
      fill="url(#gold-body)"
      stroke="#18181B"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />

    {/* Body gold reflection highlight stripe */}
    <path
      d="M 32 60 C 44 54 64 56 70 66 C 74 74 68 82 54 84"
      stroke="#FEF9C3"
      strokeWidth="3.5"
      strokeLinecap="round"
    />

    {/* Wing definition */}
    <path
      d="M 80 60 C 68 54 50 56 44 66 C 40 74 46 82 60 84 C 74 86 84 76 84 68 C 84 64 82 61 80 60 Z"
      fill="#EAB308"
      stroke="#18181B"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M 70 64 C 60 64 54 70 52 76"
      stroke="#FEF08A"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Head */}
    <circle
      cx="50"
      cy="34"
      r="25"
      fill="url(#gold-head)"
      stroke="#18181B"
      strokeWidth="4.5"
    />

    {/* Crown gold sheen reflection */}
    <ellipse
      cx="42"
      cy="20"
      rx="10"
      ry="5"
      transform="rotate(-15 42 20)"
      fill="#FFFFFF"
      fillOpacity="0.6"
    />

    {/* Orange Beak (facing left) */}
    <path
      d="M 42 38 C 32 36 14 38 10 44 C 9 48 14 53 26 53 C 36 53 44 48 42 38 Z"
      fill="url(#gold-beak)"
      stroke="#18181B"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    <path
      d="M 38 44 C 28 44 20 46 14 46"
      stroke="#7C2D12"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* CHEEKY WINKING EYE! (Left eye winks: arc ^ like in user image!) */}
    <path
      d="M 46 29 C 48 24 56 24 58 29"
      stroke="#18181B"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    {/* Eyelash wink flick */}
    <path
      d="M 58 28 L 61 26"
      stroke="#18181B"
      strokeWidth="3"
      strokeLinecap="round"
    />

    {/* Little Star Sparkle ✨ */}
    <path
      d="M 28 14 Q 28 20 32 20 Q 28 20 28 26 Q 28 20 24 20 Q 28 20 28 14 Z"
      fill="#FEF08A"
      stroke="#CA8A04"
      strokeWidth="0.8"
    />
  </svg>
);

/**
 * 4. PIRAAT (Pirate Rubber Duck)
 * Yellow rubber duck wearing pirate hat with skull & crossbones,
 * black eye-patch over eye, bold black sticker outline.
 */
export const PiraatIllustration: React.FC<IllustrationProps> = ({ className = 'w-12 h-12', size }) => (
  <svg
    viewBox="0 0 120 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      <radialGradient id="piraat-body" cx="45%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFF275" />
        <stop offset="60%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#EAB308" />
      </radialGradient>
      <linearGradient id="piraat-beak" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FB923C" />
        <stop offset="70%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#9A3412" />
      </linearGradient>
    </defs>

    {/* Body (facing left/front) */}
    <path
      d="M 104 56 C 110 50 104 36 90 38 C 84 39 76 42 68 46 C 53 42 33 45 22 54 C 10 64 12 82 20 90 C 30 100 58 102 82 98 C 100 94 106 80 104 68 C 103 62 105 58 104 56 Z"
      fill="url(#piraat-body)"
      stroke="#18181B"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />

    {/* Wing */}
    <path
      d="M 80 60 C 68 54 50 56 44 66 C 40 74 46 82 60 84 C 74 86 84 76 84 68 C 84 64 82 61 80 60 Z"
      fill="#FDE047"
      stroke="#18181B"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Head */}
    <circle
      cx="52"
      cy="42"
      r="23"
      fill="url(#piraat-body)"
      stroke="#18181B"
      strokeWidth="4.5"
    />

    {/* Orange Beak */}
    <path
      d="M 42 46 C 32 44 14 46 10 52 C 9 56 14 60 26 60 C 36 60 44 56 42 46 Z"
      fill="url(#piraat-beak)"
      stroke="#18181B"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />

    {/* Eyepatch Strap (red/black cord diagonal across face) */}
    <path
      d="M 28 32 L 74 46"
      stroke="#DC2626"
      strokeWidth="3"
      strokeLinecap="round"
    />

    {/* Black Pirate Eyepatch over right eye */}
    <ellipse
      cx="38"
      cy="39"
      rx="7"
      ry="8"
      transform="rotate(12 38 39)"
      fill="#18181B"
      stroke="#000000"
      strokeWidth="1.5"
    />

    {/* Left eye visible (glossy cartoon eye) */}
    <circle cx="58" cy="40" r="5.5" fill="#18181B" />
    <circle cx="60" cy="38.5" r="2" fill="#FFFFFF" />

    {/* PIRATE BICORNE / CAPTAIN HAT ON TOP! */}
    {/* Hat back shadow/rim */}
    <path
      d="M 18 34 C 16 16 36 6 52 14 C 68 6 88 16 86 34 C 78 30 65 28 52 28 C 39 28 26 30 18 34 Z"
      fill="#18181B"
      stroke="#000000"
      strokeWidth="4"
      strokeLinejoin="round"
    />

    {/* Red hat ribbon/trim along base */}
    <path
      d="M 22 33 C 32 30 42 29 52 29 C 62 29 72 30 82 33"
      stroke="#EF4444"
      strokeWidth="3.5"
      strokeLinecap="round"
    />

    {/* Gold hat trim / edge highlight */}
    <path
      d="M 22 30 C 26 18 38 12 52 18 C 66 12 78 18 82 30"
      stroke="#FACC15"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />

    {/* Skull and Crossbones on pirate hat (White) */}
    {/* Crossbones */}
    <path
      d="M 44 18 L 60 26 M 60 18 L 44 26"
      stroke="#FFFFFF"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Skull */}
    <circle cx="52" cy="20" r="3.2" fill="#FFFFFF" />
    <rect x="50.8" y="22" width="2.4" height="2" rx="0.5" fill="#FFFFFF" />
    {/* Skull eyes */}
    <circle cx="51.2" cy="20" r="0.7" fill="#18181B" />
    <circle cx="52.8" cy="20" r="0.7" fill="#18181B" />
  </svg>
);

/**
 * 5. TROFEE (Golden Championship Trophy Cup)
 * Two-handled gold cup with pedestal, gleaming reflections,
 * bold black sticker outline.
 */
export const TrofeeIllustration: React.FC<IllustrationProps> = ({ className = 'w-12 h-12', size }) => (
  <svg
    viewBox="0 0 110 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      {/* Trophy Gold Gradient */}
      <linearGradient id="trophy-gold" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#EAB308" />
        <stop offset="25%" stopColor="#FEF08A" />
        <stop offset="60%" stopColor="#FACC15" />
        <stop offset="85%" stopColor="#CA8A04" />
        <stop offset="100%" stopColor="#A16207" />
      </linearGradient>
      {/* Trophy Base Gradient */}
      <linearGradient id="trophy-base" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#854D0E" />
      </linearGradient>
    </defs>

    {/* Left Cup Handle */}
    <path
      d="M 36 28 C 18 28 14 42 22 54 C 28 62 36 62 42 62"
      stroke="#18181B"
      strokeWidth="7"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 36 28 C 18 28 14 42 22 54 C 28 62 36 62 42 62"
      stroke="#FACC15"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />

    {/* Right Cup Handle */}
    <path
      d="M 74 28 C 92 28 96 42 88 54 C 82 62 74 62 68 62"
      stroke="#18181B"
      strokeWidth="7"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M 74 28 C 92 28 96 42 88 54 C 82 62 74 62 68 62"
      stroke="#CA8A04"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />

    {/* Main Cup Chalice */}
    <path
      d="M 30 20 L 80 20 C 80 40 76 64 55 68 C 34 64 30 40 30 20 Z"
      fill="url(#trophy-gold)"
      stroke="#18181B"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />

    {/* Top Rim Oval */}
    <ellipse
      cx="55"
      cy="20"
      rx="25"
      ry="5.5"
      fill="#FEF9C3"
      stroke="#18181B"
      strokeWidth="4"
    />

    {/* Shiny Reflection Streak down cup */}
    <path
      d="M 40 26 C 42 38 43 54 50 62"
      stroke="#FFFFFF"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M 48 26 C 49 34 50 48 54 56"
      stroke="#FEF08A"
      strokeWidth="2"
      strokeLinecap="round"
    />

    {/* Stem / Neck */}
    <path
      d="M 50 68 L 60 68 L 58 80 L 52 80 Z"
      fill="#EAB308"
      stroke="#18181B"
      strokeWidth="4"
      strokeLinejoin="round"
    />

    {/* Center node ring on stem */}
    <ellipse
      cx="55"
      cy="76"
      rx="7"
      ry="3"
      fill="#FEF08A"
      stroke="#18181B"
      strokeWidth="3"
    />

    {/* Base Stepped Pedestal */}
    {/* Upper step */}
    <path
      d="M 44 80 L 66 80 L 70 88 L 40 88 Z"
      fill="url(#trophy-base)"
      stroke="#18181B"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />

    {/* Bottom Base Plinth */}
    <rect
      x="32"
      y="88"
      width="46"
      height="12"
      rx="3"
      fill="#CA8A04"
      stroke="#18181B"
      strokeWidth="4"
    />
    <rect
      x="36"
      y="91"
      width="38"
      height="3"
      rx="1"
      fill="#FEF08A"
    />

    {/* Sparkle ⭐ */}
    <path
      d="M 72 26 Q 72 32 76 32 Q 72 32 72 38 Q 72 32 68 32 Q 72 32 72 26 Z"
      fill="#FFFFFF"
      stroke="#CA8A04"
      strokeWidth="0.8"
    />
  </svg>
);
