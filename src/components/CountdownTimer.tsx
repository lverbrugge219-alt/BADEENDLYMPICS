import React, { useEffect, useState } from 'react';
import { Clock, Calendar, Volume2, Sparkles } from 'lucide-react';
import { playDuckQuack, playWhistle } from '../utils/audio';
import { BADEEND_LOGO_SRC } from '../assets/logo';

interface CountdownTimerProps {
  className?: string;
  onExploreClick?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ className = '' }) => {
  // Target: Badeendlympics 2027 (3 April 2027, 13:00:00 CEST)
  const targetDate = new Date('2027-04-03T13:00:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div
      id="badeendlympics-countdown"
      className={`bg-white border-2 border-black p-5 sm:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md ${className}`}
    >
      {/* Header bar with Mascot mini logo & live pulse */}
      <div className="flex items-center justify-between border-b-2 border-black pb-3.5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-amber-400 border-2 border-black flex items-center justify-center p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <img
              src={BADEEND_LOGO_SRC}
              alt="Mascotte Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-sky-600">
              OFFICIËLE AFTELKLOK
            </div>
            <div className="font-display font-black text-sm uppercase tracking-tight text-black leading-none">
              BADEENDLYMPICS 2027
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-400 border border-black text-[10px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <span>LIVE</span>
        </div>
      </div>

      {/* Digits Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4">
        {[
          { label: 'DAGEN', value: timeLeft.days },
          { label: 'UREN', value: timeLeft.hours },
          { label: 'MIN', value: timeLeft.minutes },
          { label: 'SEC', value: timeLeft.seconds },
        ].map((unit, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center border-2 border-black bg-slate-50 p-2.5 sm:p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-100 transition-colors"
          >
            <div className="font-display font-black text-2xl sm:text-3xl md:text-4xl text-black tracking-tight leading-none">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="mt-1 text-[9px] sm:text-[10px] font-black tracking-widest text-slate-600 uppercase">
              {unit.label}
            </div>
          </div>
        ))}
      </div>

      {/* Event Date & Location Info */}
      <div className="bg-slate-100 border border-black p-2.5 flex items-center justify-between gap-2 text-xs font-bold text-slate-800 mb-4">
        <div className="flex items-center gap-1.5 text-[11px] truncate">
          <Calendar size={13} className="text-amber-500 shrink-0" />
          <span className="truncate">Zaterdag 3 april 2027 • 13:00 uur</span>
        </div>
        <span className="text-[10px] font-black text-sky-600 uppercase shrink-0">
          Papendrecht
        </span>
      </div>

      {/* Sound Interaction buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => playDuckQuack(1.0)}
          className="flex-1 py-2 px-3 bg-white hover:bg-amber-50 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 cursor-pointer transition-all"
        >
          <Volume2 size={13} className="text-amber-500" />
          <span>Kwak Cheer! 🦆</span>
        </button>

        <button
          type="button"
          onClick={() => playWhistle()}
          className="flex-1 py-2 px-3 bg-amber-400 hover:bg-amber-300 border-2 border-black font-display font-black text-xs uppercase tracking-wider text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-1.5 cursor-pointer transition-all"
        >
          <span>🏁 Startsignaal</span>
        </button>
      </div>
    </div>
  );
};

