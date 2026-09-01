import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, Trophy, Sparkles, Flame, Zap } from 'lucide-react';

// Duck types with points, duration, and styling
type DuckType = 'standard' | 'golden' | 'fast' | 'pirate';

interface HoleState {
  id: number;
  active: boolean;
  duckType: DuckType;
  hit: boolean;
  hitScore?: number;
}

interface FloatingScore {
  id: number;
  holeId: number;
  score: number;
  text: string;
  type: DuckType | 'penalty';
}

export const WhackADuckGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = localStorage.getItem('badeend_whack_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);

  // 9 holes (3x3 grid)
  const [holes, setHoles] = useState<HoleState[]>(() =>
    Array.from({ length: 9 }, (_, i) => ({
      id: i,
      active: false,
      duckType: 'standard',
      hit: false,
    }))
  );

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimersRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
  const nextFloatingId = useRef(1);

  // Sound Synthesizer via Web Audio API
  const playSound = useCallback(
    (type: 'squeak' | 'gold' | 'splash' | 'penalty' | 'start' | 'gameover') => {
      if (!soundEnabled) return;
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        const now = ctx.currentTime;

        if (type === 'squeak') {
          // Classic cute rubber duck squeak
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
          osc.frequency.exponentialRampToValueAtTime(320, now + 0.18);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
        } else if (type === 'gold') {
          // Shiny gold bell / double squeak
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc2.type = 'triangle';
          osc1.frequency.setValueAtTime(587.33, now); // D5
          osc1.frequency.setValueAtTime(880, now + 0.08); // A5
          osc2.frequency.setValueAtTime(1174.66, now); // D6

          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.35);
          osc2.stop(now + 0.35);
        } else if (type === 'penalty') {
          // Low buzz / splash
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.linearRampToValueAtTime(90, now + 0.25);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === 'start') {
          // Start whistle
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.linearRampToValueAtTime(900, now + 0.15);

          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
        } else if (type === 'gameover') {
          // Fanfare end
          const notes = [523.25, 659.25, 783.99, 1046.5];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.09);
            gain.gain.setValueAtTime(0.18, now + idx * 0.09);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.09 + 0.2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.09);
            osc.stop(now + idx * 0.09 + 0.2);
          });
        }
      } catch (e) {
        // AudioContext ignored if blocked
      }
    },
    [soundEnabled]
  );

  // Clear all active hide timers
  const clearHideTimers = () => {
    Object.keys(hideTimersRef.current).forEach((key) => {
      const timer = hideTimersRef.current[Number(key)];
      if (timer) clearTimeout(timer);
    });
    hideTimersRef.current = {};
  };

  // Pop up a duck in random available hole
  const spawnDuck = useCallback(() => {
    setHoles((prevHoles) => {
      // Find inactive holes
      const inactiveHoles = prevHoles.filter((h) => !h.active);
      if (inactiveHoles.length === 0) return prevHoles;

      // Pick 1 to 2 random holes to activate
      const randomCount = Math.random() > 0.65 && inactiveHoles.length > 2 ? 2 : 1;
      const shuffled = [...inactiveHoles].sort(() => Math.random() - 0.5);
      const chosen = shuffled.slice(0, randomCount);

      const nextHoles = [...prevHoles];

      chosen.forEach((targetHole) => {
        // Determine duck type based on probabilities
        const rand = Math.random();
        let duckType: DuckType = 'standard';
        let stayDuration = 1100 + Math.random() * 400; // default 1.1s - 1.5s

        if (rand < 0.18) {
          duckType = 'golden'; // 18% chance
          stayDuration = 850;
        } else if (rand < 0.40) {
          duckType = 'fast'; // 22% chance
          stayDuration = 700;
        } else if (rand < 0.58) {
          duckType = 'pirate'; // 18% chance (penalty duck!)
          stayDuration = 1200;
        }

        const idx = nextHoles.findIndex((h) => h.id === targetHole.id);
        if (idx !== -1) {
          nextHoles[idx] = {
            id: targetHole.id,
            active: true,
            duckType,
            hit: false,
          };

          // Schedule duck hide
          if (hideTimersRef.current[targetHole.id]) {
            clearTimeout(hideTimersRef.current[targetHole.id]);
          }

          hideTimersRef.current[targetHole.id] = setTimeout(() => {
            setHoles((curr) =>
              curr.map((h) => (h.id === targetHole.id ? { ...h, active: false, hit: false } : h))
            );
          }, stayDuration);
        }
      });

      return nextHoles;
    });
  }, []);

  // Main game countdown timer
  useEffect(() => {
    if (!isPlaying) return;

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          setIsGameOver(true);
          playSound('gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, [isPlaying, playSound]);

  // Spawning loop
  useEffect(() => {
    if (!isPlaying) return;

    // Faster spawns as time decreases
    const speed = timeLeft > 15 ? 750 : timeLeft > 7 ? 600 : 480;

    spawnTimerRef.current = setInterval(() => {
      spawnDuck();
    }, speed);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [isPlaying, timeLeft, spawnDuck]);

  // High score updater
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('badeend_whack_highscore', score.toString());
    }
  }, [score, highScore]);

  // Start game
  const startGame = () => {
    clearHideTimers();
    setScore(0);
    setTimeLeft(30);
    setCombo(0);
    setMaxCombo(0);
    setIsGameOver(false);
    setFloatingScores([]);
    setHoles(
      Array.from({ length: 9 }, (_, i) => ({
        id: i,
        active: false,
        duckType: 'standard',
        hit: false,
      }))
    );
    setIsPlaying(true);
    playSound('start');

    // Spawn first duck immediately
    setTimeout(() => {
      spawnDuck();
    }, 200);
  };

  // Stop / Reset game
  const stopGame = () => {
    setIsPlaying(false);
    clearHideTimers();
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    setHoles((prev) => prev.map((h) => ({ ...h, active: false, hit: false })));
  };

  // Hit duck handler
  const handleDuckClick = (holeId: number) => {
    if (!isPlaying) return;

    setHoles((prev) => {
      const hole = prev.find((h) => h.id === holeId);
      if (!hole || !hole.active || hole.hit) return prev;

      let points = 10;
      let text = '+10';

      if (hole.duckType === 'golden') {
        points = 35;
        text = '🌟 +35!';
        playSound('gold');
      } else if (hole.duckType === 'fast') {
        points = 20;
        text = '⚡ +20!';
        playSound('squeak');
      } else if (hole.duckType === 'pirate') {
        // Penalty duck!
        points = -15;
        text = '☠️ -15';
        playSound('penalty');
      } else {
        playSound('squeak');
      }

      // Combo handling
      if (hole.duckType === 'pirate') {
        setCombo(0);
      } else {
        setCombo((prevCombo) => {
          const next = prevCombo + 1;
          if (next > maxCombo) setMaxCombo(next);
          // Combo bonus for >= 5 hits
          if (next >= 5 && next % 5 === 0) {
            points += 10;
            text += ' 🔥 COMBO!';
          }
          return next;
        });
      }

      // Update score (do not go below 0)
      setScore((s) => Math.max(0, s + points));

      // Add floating score badge
      const floatId = nextFloatingId.current++;
      setFloatingScores((f) => [
        ...f,
        {
          id: floatId,
          holeId,
          score: points,
          text,
          type: hole.duckType === 'pirate' ? 'penalty' : hole.duckType,
        },
      ]);

      // Remove floating score after animation
      setTimeout(() => {
        setFloatingScores((f) => f.filter((item) => item.id !== floatId));
      }, 700);

      // Clear the auto-hide timer for this hole
      if (hideTimersRef.current[holeId]) {
        clearTimeout(hideTimersRef.current[holeId]);
      }

      // Mark as hit and hide quickly
      setTimeout(() => {
        setHoles((curr) =>
          curr.map((h) => (h.id === holeId ? { ...h, active: false, hit: false } : h))
        );
      }, 250);

      return prev.map((h) =>
        h.id === holeId ? { ...h, hit: true, hitScore: points } : h
      );
    });
  };

  return (
    <div
      id="whack-a-duck-container"
      className="bg-white border-2 border-black p-5 sm:p-7 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
    >
      {/* Top Banner with Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-white border-2 border-black p-0.5 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] select-none overflow-hidden">
            <img
              src="/hammer-duck.png"
              alt="Badeendjes Meppen"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-sky-100 border border-sky-400 text-[10px] font-black uppercase tracking-wider text-sky-800 rounded-sm mb-0.5">
              <Sparkles size={11} /> Officiële Teaser Game
            </div>
            <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black leading-none">
              BADEENDJES MEPPEN (TRAINING)
            </h3>
          </div>
        </div>

        {/* Action / Audio controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 border-2 border-black font-display text-xs font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-colors ${
              soundEnabled ? 'bg-amber-400 hover:bg-amber-300' : 'bg-slate-200 text-slate-500'
            }`}
            title={soundEnabled ? 'Geluid dempen' : 'Geluid inschakelen'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="hidden sm:inline">{soundEnabled ? 'GELUID AAN' : 'GEDEMPT'}</span>
          </button>
        </div>
      </div>

      {/* Dashboard Bar: Score, Time, Combo, High Score */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {/* Score */}
        <div className="bg-amber-50 border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block mb-0.5">
            PUNTEN
          </span>
          <span className="font-display font-black text-3xl text-black leading-none block">
            {score}
          </span>
        </div>

        {/* Time Left */}
        <div
          className={`border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors ${
            timeLeft <= 5 && isPlaying
              ? 'bg-rose-100 text-rose-900 animate-pulse'
              : 'bg-sky-50 text-sky-900'
          }`}
        >
          <span className="text-[10px] font-black uppercase tracking-wider block mb-0.5">
            TIJD OVER
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-display font-black text-3xl leading-none text-black">
              {timeLeft}
            </span>
            <span className="text-xs font-bold uppercase text-slate-500">sec</span>
          </div>
        </div>

        {/* Combo */}
        <div className="bg-emerald-50 border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900">
              STREAK
            </span>
            {combo >= 3 && <Flame size={14} className="text-amber-500 fill-amber-500 animate-bounce" />}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-black text-3xl text-emerald-700 leading-none">
              {combo}x
            </span>
            {combo >= 5 && (
              <span className="text-[10px] font-black uppercase bg-amber-400 border border-black px-1">
                BONUS!
              </span>
            )}
          </div>
        </div>

        {/* High Score */}
        <div className="bg-purple-50 border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-900">
              RECORD
            </span>
            <Trophy size={14} className="text-amber-500 fill-amber-400" />
          </div>
          <span className="font-display font-black text-3xl text-purple-950 leading-none block">
            {highScore}
          </span>
        </div>
      </div>

      {/* Progress Bar of Time */}
      <div className="w-full bg-slate-200 border-2 border-black h-3 mb-6 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            timeLeft > 10 ? 'bg-amber-400' : timeLeft > 5 ? 'bg-orange-500' : 'bg-rose-500'
          }`}
          style={{ width: `${(timeLeft / 30) * 100}%` }}
        />
      </div>

      {/* Main Whack-a-Mole Arena: 3x3 Grid of Water Ponds */}
      <div className="relative bg-sky-100 border-2 border-black p-4 sm:p-6 rounded-none shadow-[inset_0px_4px_8px_rgba(0,0,0,0.06)] mb-6 select-none">
        {/* Subtle Water Ripples Decoration */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="grid grid-cols-3 gap-3 sm:gap-5 relative z-10 max-w-md mx-auto">
          {holes.map((hole) => {
            const floating = floatingScores.find((f) => f.holeId === hole.id);

            return (
              <div
                key={hole.id}
                id={`duck-hole-${hole.id}`}
                onClick={() => handleDuckClick(hole.id)}
                className="relative aspect-square bg-sky-200 border-2 border-black flex flex-col items-center justify-end overflow-hidden cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-sky-300/80 active:translate-y-0.5 active:translate-x-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all group"
              >
                {/* Floating Score Pop-up on Hit */}
                {floating && (
                  <div
                    className={`absolute top-2 z-30 font-display font-black text-sm sm:text-base border border-black px-1.5 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in-75 duration-200 ${
                      floating.type === 'penalty'
                        ? 'bg-rose-400 text-white'
                        : floating.type === 'golden'
                        ? 'bg-amber-300 text-amber-950'
                        : 'bg-white text-black'
                    }`}
                  >
                    {floating.text}
                  </div>
                )}

                {/* The Duck Character */}
                <div
                  className={`w-full h-full flex flex-col items-center justify-center transition-all duration-150 transform ${
                    hole.active
                      ? hole.hit
                        ? 'scale-75 translate-y-4 opacity-50 rotate-12'
                        : 'scale-100 translate-y-0 opacity-100'
                      : 'translate-y-16 opacity-0 scale-50 pointer-events-none'
                  }`}
                >
                  {/* Duck Visuals based on Type */}
                  {hole.duckType === 'standard' && (
                    <div className="flex flex-col items-center animate-bounce-subtle">
                      <span className="text-4xl sm:text-5xl drop-shadow-md filter">🐥</span>
                      <span className="text-[9px] font-black uppercase bg-amber-400 border border-black px-1 text-black mt-0.5">
                        +10
                      </span>
                    </div>
                  )}

                  {hole.duckType === 'golden' && (
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <span className="text-4xl sm:text-5xl drop-shadow-md">🦆</span>
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-base">👑</span>
                      </div>
                      <span className="text-[9px] font-black uppercase bg-amber-300 text-amber-950 border border-black px-1 mt-0.5 animate-pulse">
                        +35 GOUD!
                      </span>
                    </div>
                  )}

                  {hole.duckType === 'fast' && (
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <span className="text-4xl sm:text-5xl drop-shadow-md">🤿</span>
                      </div>
                      <span className="text-[9px] font-black uppercase bg-cyan-300 text-cyan-950 border border-black px-1 mt-0.5">
                        +20 SNEL!
                      </span>
                    </div>
                  )}

                  {hole.duckType === 'pirate' && (
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <span className="text-4xl sm:text-5xl drop-shadow-md">🏴‍☠️</span>
                      </div>
                      <span className="text-[9px] font-black uppercase bg-rose-500 text-white border border-black px-1 mt-0.5">
                        PAS OP! -15
                      </span>
                    </div>
                  )}
                </div>

                {/* Water Ring / Pool Base Trim */}
                <div className="w-full bg-sky-400 border-t-2 border-black py-1 px-2 flex items-center justify-between text-[9px] font-black text-sky-950 uppercase tracking-tighter shrink-0 select-none">
                  <span>PLONS #{hole.id + 1}</span>
                  <div className="w-2 h-2 rounded-full bg-sky-200 border border-black" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Start / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-20">
            {isGameOver ? (
              <div className="bg-white border-2 border-black p-6 max-w-sm w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-90 duration-200">
                <div className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black mb-1">
                  TIJD IS OM!
                </div>
                <p className="text-xs font-semibold text-slate-600 mb-4">
                  Goede reactiesnelheid voor de mystery discipline!
                </p>

                <div className="bg-amber-100 border-2 border-black p-3 mb-5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block mb-1">
                    JOUW EINDSCORE
                  </span>
                  <span className="font-display font-black text-4xl text-black leading-none block">
                    {score} PUNTEN
                  </span>
                  {score >= highScore && score > 0 && (
                    <span className="inline-block mt-2 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-black uppercase tracking-wider">
                      🎉 NIEUW PERSOONLIJK RECORD!
                    </span>
                  )}
                </div>

                <button
                  id="whack-a-duck-restart-btn"
                  onClick={startGame}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 border-2 border-black font-display font-black text-sm uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-2 transition-all active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
                >
                  <RotateCcw size={16} /> OPNIEUW SPELEN
                </button>
              </div>
            ) : (
              <div className="bg-white border-2 border-black p-6 max-w-sm w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="w-16 h-16 bg-white border-2 border-black mx-auto mb-3 p-1 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                  <img
                    src="/hammer-duck.png"
                    alt="Badeendjes Meppen Start"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="font-display font-black text-2xl uppercase tracking-tight text-black mb-2">
                  KLAAR VOOR DE TRAINING?
                </div>
                <p className="text-xs text-slate-600 font-medium mb-4 leading-relaxed">
                  Tik binnen 30 seconden op zoveel mogelijk gele, gouden en duikende eendjes. Pas op voor de pirateneenden!
                </p>

                <button
                  id="whack-a-duck-start-btn"
                  onClick={startGame}
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 border-2 border-black font-display font-black text-sm uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-2 transition-all active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
                >
                  <Play size={18} fill="currentColor" /> START DE TEASER GAME
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Legend & Spel 1 Teaser Hook */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t-2 border-slate-100 text-center">
        <div className="p-2 bg-slate-50 border border-black/20 text-xs">
          <span className="text-lg block mb-0.5">🐥</span>
          <span className="font-bold text-[11px] block">Gele Eend</span>
          <span className="text-[10px] text-slate-500 font-bold">+10 pt</span>
        </div>
        <div className="p-2 bg-slate-50 border border-black/20 text-xs">
          <span className="text-lg block mb-0.5">🏆</span>
          <span className="font-bold text-[11px] block">Troffee</span>
          <span className="text-[10px] text-amber-600 font-black">+35 pt (snel)</span>
        </div>
        <div className="p-2 bg-slate-50 border border-black/20 text-xs">
          <span className="text-lg block mb-0.5">🍺</span>
          <span className="font-bold text-[11px] block">Pils!</span>
          <span className="text-[10px] text-sky-600 font-black">+20 pt</span>
        </div>
        <div className="p-2 bg-slate-50 border border-black/20 text-xs">
          <span className="text-lg block mb-0.5">🏴‍☠️</span>
          <span className="font-bold text-[11px] block">Piraat</span>
          <span className="text-[10px] text-rose-600 font-black">-15 pt (ontwijk)</span>
        </div>
      </div>
    </div>
  );
};
