import React from 'react';

interface MarqueeTickerProps {
  text?: string;
  variant?: 'yellow' | 'cyan' | 'black';
  outlineText?: boolean;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  text = 'BADEENDLYMPICS 2027 • 3 APRIL • PAPENDRECHT • GLORIE WACHT • ',
  variant = 'yellow',
  outlineText = true,
}) => {
  const bgClass =
    variant === 'yellow'
      ? 'bg-amber-400 border-y-2 border-black text-black'
      : variant === 'cyan'
      ? 'bg-sky-400 border-y-2 border-black text-black'
      : 'bg-black border-y-2 border-black text-white';

  const repeatedText = `${text} `.repeat(8);

  return (
    <div className={`overflow-hidden py-2.5 sm:py-3.5 select-none ${bgClass}`}>
      <div className="flex w-max animate-marquee">
        <span className="font-display font-black text-xl sm:text-2xl lg:text-3xl tracking-wider uppercase whitespace-nowrap px-2">
          {repeatedText}
        </span>
        <span className="font-display font-black text-xl sm:text-2xl lg:text-3xl tracking-wider uppercase whitespace-nowrap px-2" aria-hidden="true">
          {repeatedText}
        </span>
      </div>
    </div>
  );
};
