import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

/**
 * 1. BADEEND (Standard Yellow Rubber Duck - 3/4 Front View)
 * Matches the user's uploaded illustration:
 * - 3/4 front view with head slightly tilted
 * - Cute feather tuft on top of head
 * - Two large glossy black cartoon eyes with white reflection highlights
 * - Vibrant orange bill with nostril markings and friendly open smiling mouth
 * - Chubby rounded body with side wing and perky tail flick
 * - Bold black sticker outline
 */
export const BadeendIllustration: React.FC<IllustrationProps> = ({ className = 'w-12 h-12', size }) => (
  <svg
    viewBox="0 0 100 112"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={size ? { width: size, height: size } : undefined}
  >
    <defs>
      {/* Head & Body Yellow Radial Gradient */}
      <radialGradient id="badeend-front-head" cx="42%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#FFF9A6" />
        <stop offset="45%" stopColor="#FDE047" />
        <stop offset="80%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#EAB308" />
      </radialGradient>
      {/* Body Gradient */}
      <radialGradient id="badeend-front-body" cx="48%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#FFF58C" />
        <stop offset="50%" stopColor="#FACC15" />
        <stop offset="85%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#CA8A04" />
      </radialGradient>
      {/* Upper Beak Gradient */}
      <linearGradient id="badeend-front-beak" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FB923C" />
        <stop offset="40%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
      {/* Mouth Interior */}
      <linearGradient id="badeend-mouth" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#9A3412" />
        <stop offset="100%" stopColor="#C2410C" />
      </linearGradient>
      {/* Soft Neck Shadow */}
      <radialGradient id="badeend-neck-shadow" cx="55%" cy="20%" r="70%">
        <stop offset="0%" stopColor="#D97706" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
      </radialGradient>
      {/* Bottom base shadow */}
      <linearGradient id="badeend-base-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#CA8A04" stopOpacity="0" />
        <stop offset="100%" stopColor="#A16207" stopOpacity="0.5" />
      </linearGradient>
    </defs>

    {/* ================= BODY & TAIL LAYER ================= */}
    {/* Main chubby body including upturned tail on the left and chest on the right */}
    <path
      d="M 36 56 
         C 26 56 16 52 14 55 
         C 12 59 17 68 20 74 
         C 23 81 28 88 38 94 
         C 48 99 68 100 80 94 
         C 90 89 94 80 93 72 
         C 92 63 86 58 78 57 
         C 74 57 70 56 68 56 Z"
      fill="url(#badeend-front-body)"
      stroke="#18181B"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />

    {/* Bottom base shading */}
    <path
      d="M 24 78 C 34 94 66 98 86 92 C 82 95 68 99 50 99 C 34 99 26 90 24 78 Z"
      fill="url(#badeend-base-shadow)"
    />

    {/* Side Wing on Left Body */}
    <path
      d="M 21 64 
         C 32 60 42 62 44 70 
         C 46 76 40 82 28 82 
         C 21 82 18 73 21 64 Z"
      fill="#FDE047"
      stroke="#18181B"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />
    {/* Wing feather contour lines */}
    <path
      d="M 26 69 C 34 68 39 71 39 76"
      stroke="#CA8A04"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <path
      d="M 23 74 C 28 74 34 76 34 79"
      stroke="#CA8A04"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    {/* Neck Shadow beneath the head */}
    <path
      d="M 38 56 C 48 64 68 64 76 58 C 70 66 48 66 38 56 Z"
      fill="url(#badeend-neck-shadow)"
    />

    {/* ================= HEAD & TUFT LAYER ================= */}
    {/* Head with tuft on top, round cheeks */}
    <path
      d="M 52 14 
         C 50 10 54 8 57 12 
         C 59 9 64 10 63 15 
         C 76 17 87 28 88 42 
         C 89 54 81 64 68 67 
         C 58 69 44 68 34 61 
         C 26 53 25 39 33 26 
         C 38 18 45 14 52 14 Z"
      fill="url(#badeend-front-head)"
      stroke="#18181B"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />

    {/* Soft cheek & forehead light sheen */}
    <ellipse
      cx="43"
      cy="24"
      rx="9"
      ry="5"
      transform="rotate(-15 43 24)"
      fill="#FFFFFF"
      fillOpacity="0.45"
    />

    {/* ================= EYES ================= */}
    {/* Left Eye (our left, slightly larger) */}
    <ellipse
      cx="46.5"
      cy="42.5"
      rx="5.2"
      ry="6.8"
      transform="rotate(4 46.5 42.5)"
      fill="#18181B"
    />
    {/* Left eye shiny white catchlight */}
    <ellipse
      cx="44.8"
      cy="39.8"
      rx="2.1"
      ry="2.8"
      transform="rotate(-10 44.8 39.8)"
      fill="#FFFFFF"
    />
    <circle cx="48.5" cy="44.5" r="0.9" fill="#FFFFFF" fillOpacity="0.7" />

    {/* Right Eye (our right, slightly smaller perspective) */}
    <ellipse
      cx="77.5"
      cy="41.5"
      rx="4.8"
      ry="6.4"
      transform="rotate(-4 77.5 41.5)"
      fill="#18181B"
    />
    {/* Right eye shiny white catchlight */}
    <ellipse
      cx="76"
      cy="39"
      rx="1.9"
      ry="2.5"
      transform="rotate(-10 76 39)"
      fill="#FFFFFF"
    />
    <circle cx="79.2" cy="43.5" r="0.8" fill="#FFFFFF" fillOpacity="0.7" />

    {/* ================= BEAK & SMILE ================= */}
    {/* Lower Beak / Open smiling mouth (reddish interior & lower lip) */}
    <path
      d="M 52 53 
         C 52 61 74 61 74 53 
         C 70 58 56 58 52 53 Z"
      fill="url(#badeend-mouth)"
      stroke="#18181B"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Lower bill lip rim */}
    <path
      d="M 54 58 C 60 63 68 63 72 58"
      stroke="#EA580C"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Upper Beak (wide curved smiling duck bill) */}
    <path
      d="M 46 49 
         C 53 45 73 45 80 48 
         C 84 50 82 54 75 55 
         C 69 56 56 56 50 55 
         C 45 54 43 51 46 49 Z"
      fill="url(#badeend-front-beak)"
      stroke="#18181B"
      strokeWidth="3.5"
      strokeLinejoin="round"
    />

    {/* Upper beak highlight curve */}
    <path
      d="M 52 48 C 58 46 68 46 74 48"
      stroke="#FED7AA"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    {/* Nostril indentations on beak */}
    <ellipse cx="60.5" cy="48" rx="0.9" ry="1.2" fill="#9A3412" />
    <ellipse cx="66" cy="48" rx="0.9" ry="1.2" fill="#9A3412" />
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
