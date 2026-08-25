import React from 'react';

interface RubberDuckGraphicProps {
  color?: string;
  size?: number | string;
  accessory?: 'goggles' | 'medal' | 'headband' | 'snorkel' | 'cape' | 'crown' | 'none';
  beakColor?: string;
  animated?: boolean;
  className?: string;
  showWaterRipple?: boolean;
}

export const RubberDuckGraphic: React.FC<RubberDuckGraphicProps> = ({
  color = '#F59E0B',
  size = 64,
  accessory = 'none',
  beakColor = '#F97316',
  animated = false,
  className = '',
  showWaterRipple = false
}) => {
  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className} ${
        animated ? 'animate-bounce-subtle' : ''
      }`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 120 110"
        className="w-full h-full drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Duck Shading Gradient */}
          <linearGradient id={`duckBodyGrad-${color.replace('#', '')}`} x1="30%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="40%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.85" />
          </linearGradient>

          {/* Gold Trim Gradient */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#EAB308" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>

          {/* Water Splash Filter */}
          <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#7DD3FC" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Cape Accessory (Behind Body) */}
        {accessory === 'cape' && (
          <path
            d="M 45 48 C 20 52, 5 75, 12 96 C 25 90, 42 85, 55 80 Z"
            fill="#EF4444"
            stroke="#B91C1C"
            strokeWidth="1.5"
            className="drop-shadow-sm"
          />
        )}

        {/* Tail Feather */}
        <path
          d="M 28 58 C 15 50, 10 38, 16 34 C 24 30, 32 42, 38 52 Z"
          fill={`url(#duckBodyGrad-${color.replace('#', '')})`}
          stroke="#18181B"
          strokeWidth="2"
        />

        {/* Duck Main Body */}
        <path
          d="M 32 55 C 32 42, 55 35, 75 42 C 85 46, 102 56, 100 78 C 98 94, 76 102, 48 98 C 28 95, 20 80, 24 66 C 26 60, 28 56, 32 55 Z"
          fill={`url(#duckBodyGrad-${color.replace('#', '')})`}
          stroke="#18181B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Wing Contour */}
        <path
          d="M 38 65 C 44 58, 62 58, 70 68 C 65 78, 48 80, 38 72 Z"
          fill="#FFFFFF"
          fillOpacity="0.22"
          stroke="#18181B"
          strokeWidth="1.8"
        />

        {/* Duck Head */}
        <circle
          cx="76"
          cy="36"
          r="23"
          fill={`url(#duckBodyGrad-${color.replace('#', '')})`}
          stroke="#18181B"
          strokeWidth="2.5"
        />

        {/* Beak / Bill */}
        <path
          d="M 94 36 C 104 34, 116 38, 114 43 C 112 47, 104 49, 94 48 C 92 48, 91 40, 94 36 Z"
          fill={beakColor}
          stroke="#18181B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Beak Nostril */}
        <circle cx="98" cy="40" r="1" fill="#7C2D12" />

        {/* Duck Eye */}
        <circle cx="82" cy="30" r="4.5" fill="#18181B" />
        <circle cx="83.5" cy="28.5" r="1.5" fill="#FFFFFF" />
        {/* Cheek Blush */}
        <ellipse cx="76" cy="42" rx="4" ry="2.5" fill="#F43F5E" fillOpacity="0.4" />

        {/* ACCESSORIES */}
        {accessory === 'crown' && (
          <g transform="translate(62, 2)">
            <path
              d="M 2 15 L 6 3 L 14 10 L 22 2 L 30 10 L 38 3 L 42 15 Z"
              fill="url(#goldGrad)"
              stroke="#854D0E"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="6" cy="3" r="1.5" fill="#EF4444" />
            <circle cx="22" cy="2" r="1.8" fill="#38BDF8" />
            <circle cx="38" cy="3" r="1.5" fill="#10B981" />
          </g>
        )}

        {accessory === 'goggles' && (
          <g>
            {/* Goggle Strap */}
            <path d="M 54 30 Q 76 22 96 32" stroke="#0F172A" strokeWidth="2.5" />
            {/* Goggle Lenses */}
            <ellipse
              cx="83"
              cy="29"
              rx="7"
              ry="6"
              fill="#38BDF8"
              fillOpacity="0.75"
              stroke="#0F172A"
              strokeWidth="2"
            />
            <ellipse cx="85" cy="27" rx="3" ry="1.5" fill="#FFFFFF" fillOpacity="0.8" />
          </g>
        )}

        {accessory === 'headband' && (
          <g>
            <path
              d="M 54 28 C 65 22, 85 22, 97 32"
              stroke="#EF4444"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Headband knot */}
            <path d="M 53 28 L 44 24 M 53 30 L 46 35" stroke="#DC2626" strokeWidth="3" />
          </g>
        )}

        {accessory === 'snorkel' && (
          <g>
            {/* Snorkel tube */}
            <path
              d="M 94 44 C 98 48, 102 48, 104 36 L 106 10 C 106 7, 109 5, 112 7"
              fill="none"
              stroke="#0284C7"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <rect x="108" y="4" width="7" height="4" rx="2" fill="#F97316" />
          </g>
        )}

        {accessory === 'medal' && (
          <g>
            {/* Ribbon */}
            <path d="M 68 55 L 75 74 L 84 57" stroke="#3B82F6" strokeWidth="3" fill="none" />
            {/* Gold Medal */}
            <circle cx="75" cy="76" r="7" fill="url(#goldGrad)" stroke="#78350F" strokeWidth="1.2" />
            <text
              x="75"
              y="79"
              fontSize="6"
              fontWeight="900"
              fill="#78350F"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              1
            </text>
          </g>
        )}

        {/* Water Ripple Base */}
        {showWaterRipple && (
          <g className="opacity-90">
            <path
              d="M 10 98 Q 35 93, 60 98 T 110 98"
              stroke="url(#waterGrad)"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 22 104 Q 45 101, 70 104 T 100 104"
              stroke="#38BDF8"
              strokeWidth="2"
              strokeOpacity="0.6"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
