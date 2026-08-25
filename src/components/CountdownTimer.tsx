import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Sparkles, Volume2 } from 'lucide-react';
import { playDuckQuack, playWhistle } from '../utils/audio';

interface CountdownTimerProps {
  onExploreClick?: () => void;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ onExploreClick, className = '' }) => {
  // Target: Badeendlympics 2026 Opening Ceremony (Aug 28, 2026, 10:00:00 CEST)
  const targetDate = new Date('2026-08-28T10:00:00');

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  const [selectedMilestone, setSelectedMilestone] = useState<'opening' | 'sprint' | 'final'>('opening');

  useEffect(() => {
    const calculateTime = () => {
      let target = new Date('2026-08-28T10:00:00').getTime();
      if (selectedMilestone === 'sprint') {
        target = new Date('2026-08-28T12:30:00').getTime();
      } else if (selectedMilestone === 'final') {
        target = new Date('2026-08-30T16:00:00').getTime();
      }

      const now = new Date().getTime();
      const diff = target - now;

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
  }, [selectedMilestone]);

  const milestones = [
    { id: 'opening', label: 'Grand Opening', date: 'Aug 28, 10:00' },
    { id: 'sprint', label: 'First Sprint Heat', date: 'Aug 28, 12:30' },
    { id: 'final', label: 'Grand Finals', date: 'Aug 30, 16:00' }
  ];

  return (
    <div
      id="badeendlympics-countdown"
      className={`relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm ${className}`}
    >
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute top-0 right-0 p-8">
        <div className="w-48 h-48 bg-amber-100 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Header bar */}
      <div className="relative flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400 text-black shadow-xs font-bold">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-black bg-amber-400 px-2.5 py-0.5 rounded-full">
                OFFICIAL COUNTDOWN
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-sky-700 font-bold uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black italic uppercase tracking-tight text-slate-950 mt-1">
              BADEENDLY<span className="text-amber-500">MPICS</span> 2026
            </h3>
          </div>
        </div>

        {/* Milestone Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold uppercase tracking-wider">
          {milestones.map((m) => (
            <button
              key={m.id}
              id={`milestone-btn-${m.id}`}
              onClick={() => {
                setSelectedMilestone(m.id as 'opening' | 'sprint' | 'final');
                playDuckQuack(1.1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedMilestone === m.id
                  ? 'bg-black text-white font-black shadow-xs'
                  : 'text-slate-500 hover:text-slate-950'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Digits Grid */}
      <div className="relative my-6 grid grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'DAYS', value: timeLeft.days },
          { label: 'HRS', value: timeLeft.hours },
          { label: 'MIN', value: timeLeft.minutes },
          { label: 'SEC', value: timeLeft.seconds }
        ].map((unit, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5 text-center transition-all hover:border-amber-400 hover:bg-white hover:shadow-md"
          >
            <div className="relative font-mono text-3xl sm:text-4xl md:text-5xl font-black italic text-slate-950 tracking-tight leading-none">
              {String(unit.value).padStart(2, '0')}
            </div>
            <div className="mt-2 text-[10px] sm:text-xs font-black tracking-widest text-slate-400 uppercase">
              {unit.label}
            </div>
          </div>
        ))}
      </div>

      {/* Footer ticker with quack & referee actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <Calendar className="h-4 w-4 text-amber-500" />
          <span>AquaPark Olympic Flume, Utrecht • Aug 28–30, 2026</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="quack-cheer-btn"
            onClick={() => {
              playDuckQuack(1.0);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-900 font-bold uppercase tracking-wider hover:border-slate-400 active:scale-95 transition-all text-xs"
            title="Sound the Official Duck Horn"
          >
            <Volume2 className="h-3.5 w-3.5 text-amber-500" />
            <span>Quack Cheer!</span>
          </button>

          <button
            id="referee-whistle-btn"
            onClick={() => {
              playWhistle();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 text-black font-black uppercase tracking-wider hover:bg-amber-300 active:scale-95 transition-all text-xs border border-amber-500"
            title="Blow Referee Whistle"
          >
            <span>🏁 Start Whistle</span>
          </button>
        </div>
      </div>
    </div>
  );
};
