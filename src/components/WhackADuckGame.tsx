import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Trophy as TrophyIcon,
  Sparkles,
  Flame,
  Zap,
  Target,
  Clock,
  Medal,
  Users,
  CheckCircle2,
  AlertCircle,
  Crown,
} from 'lucide-react';
import { MinigameScore, Team } from '../types';
import {
  getStoredMinigameScores,
  saveMinigameScore,
  getStoredTeams,
  getTeamSession,
} from '../utils/storage';
import {
  BadeendIllustration,
  PilsIllustration,
  GoudenBadeendIllustration,
  PiraatIllustration,
  TrofeeIllustration,
} from './GameIllustrations';

// Duck & Item types with points, duration, and styling
export type DuckType = 'standard' | 'pils' | 'trophy' | 'pirate' | 'golden';

interface HoleState {
  id: number;
  active: boolean;
  duckType: DuckType;
  hit: boolean;
  hitScore?: number;
  spawnTime?: number;
}

interface FloatingScore {
  id: number;
  holeId: number;
  score: number;
  text: string;
  type: DuckType | 'penalty' | 'miss';
}

export const WhackADuckGame: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);

  // Statistics for competitive feedback
  const [totalClicks, setTotalClicks] = useState(0);
  const [successfulHits, setSuccessfulHits] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);

  // Submission & Leaderboard state
  const [leaderboardScores, setLeaderboardScores] = useState<MinigameScore[]>(() =>
    getStoredMinigameScores()
  );
  const [registeredTeams, setRegisteredTeams] = useState<Team[]>(() => getStoredTeams());
  const [playerNameInput, setPlayerNameInput] = useState<string>(() => {
    return localStorage.getItem('badeend_player_name') || '';
  });
  const [selectedTeamInput, setSelectedTeamInput] = useState<string>(() => {
    return getTeamSession()?.name || '';
  });
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<'individual' | 'teams'>('individual');

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

  // Load real-time leaderboard data
  const refreshScores = useCallback(() => {
    setLeaderboardScores(getStoredMinigameScores());
    setRegisteredTeams(getStoredTeams());
  }, []);

  useEffect(() => {
    refreshScores();
    window.addEventListener('badeendlympics_minigame_change', refreshScores);
    window.addEventListener('badeendlympics_data_change', refreshScores);
    return () => {
      window.removeEventListener('badeendlympics_minigame_change', refreshScores);
      window.removeEventListener('badeendlympics_data_change', refreshScores);
    };
  }, [refreshScores]);

  // Determine current record (#1 on leaderboard or local record)
  const topLeaderboardScore = leaderboardScores.length > 0 ? leaderboardScores[0].score : 0;
  const topRecordHolder = leaderboardScores.length > 0 ? leaderboardScores[0].playerName : null;

  // Sound Synthesizer via Web Audio API
  const playSound = useCallback(
    (type: 'squeak' | 'pils' | 'trophy' | 'golden' | 'penalty' | 'miss' | 'combo' | 'frenzy' | 'start' | 'gameover') => {
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
          osc.frequency.setValueAtTime(460, now);
          osc.frequency.exponentialRampToValueAtTime(920, now + 0.08);
          osc.frequency.exponentialRampToValueAtTime(340, now + 0.18);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
        } else if (type === 'pils') {
          // Sparkling beer cheers sound / crisp bell clink
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc2.type = 'triangle';
          osc1.frequency.setValueAtTime(784, now); // G5
          osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.09); // C6
          osc2.frequency.setValueAtTime(1318.51, now); // E6

          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.35);
          osc2.stop(now + 0.35);
        } else if (type === 'trophy') {
          // Triumphant golden trophy chime
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc2.type = 'sine';
          osc1.frequency.setValueAtTime(587.33, now); // D5
          osc1.frequency.setValueAtTime(880, now + 0.07); // A5
          osc2.frequency.setValueAtTime(1174.66, now + 0.07); // D6

          gain.gain.setValueAtTime(0.22, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.35);
          osc2.stop(now + 0.35);
        } else if (type === 'golden') {
          // Glorious fanfare for the Gouden Badeend
          const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51];
          freqs.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);
            gain.gain.setValueAtTime(0.2, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.3);
          });
        } else if (type === 'miss') {
          // Water splash miss sound
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(220, now);
          osc.frequency.linearRampToValueAtTime(110, now + 0.12);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
        } else if (type === 'penalty') {
          // Low pirate penalty buzz
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(170, now);
          osc.frequency.linearRampToValueAtTime(80, now + 0.25);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === 'combo') {
          // Multiplier upgrade chime
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.exponentialRampToValueAtTime(1320, now + 0.15);

          gain.gain.setValueAtTime(0.2, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
        } else if (type === 'frenzy') {
          // Frenzy mode alert
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.linearRampToValueAtTime(880, now + 0.2);

          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.3);
        } else if (type === 'start') {
          // Start whistle
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, now);
          osc.frequency.linearRampToValueAtTime(880, now + 0.15);

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
      } catch {
        // AudioContext error ignored
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

  // Pop up a duck/item in random available hole
  const spawnDuck = useCallback(() => {
    setHoles((prevHoles) => {
      const inactiveHoles = prevHoles.filter((h) => !h.active);
      if (inactiveHoles.length === 0) return prevHoles;

      // In the final 7 seconds (Gouden Frenzy), allow up to 3 ducks simultaneously!
      const isFrenzy = timeLeft <= 7;
      const maxSpawns = isFrenzy ? (inactiveHoles.length >= 3 ? 3 : 2) : inactiveHoles.length > 2 && Math.random() > 0.6 ? 2 : 1;
      const shuffled = [...inactiveHoles].sort(() => Math.random() - 0.5);
      const chosen = shuffled.slice(0, maxSpawns);

      const nextHoles = [...prevHoles];
      const nowMs = Date.now();

      chosen.forEach((targetHole) => {
        const rand = Math.random();
        let duckType: DuckType = 'standard';
        let stayDuration = 1000 + Math.random() * 350;

        if (isFrenzy) {
          // In Gouden Frenzy: 35% chance for the Gouden Badeend!
          if (rand < 0.35) {
            duckType = 'golden';
            stayDuration = 650; // Fast!
          } else if (rand < 0.60) {
            duckType = 'pils';
            stayDuration = 700;
          } else if (rand < 0.80) {
            duckType = 'trophy';
            stayDuration = 650;
          } else {
            duckType = 'pirate';
            stayDuration = 1000;
          }
        } else {
          // Standard phase
          if (rand < 0.08) {
            duckType = 'golden'; // 8% chance in normal time
            stayDuration = 700;
          } else if (rand < 0.26) {
            duckType = 'pils'; // 18% Pils
            stayDuration = 800;
          } else if (rand < 0.46) {
            duckType = 'trophy'; // 20% Trofee
            stayDuration = 720;
          } else if (rand < 0.64) {
            duckType = 'pirate'; // 18% Piraat (penalty)
            stayDuration = 1100;
          }
        }

        const idx = nextHoles.findIndex((h) => h.id === targetHole.id);
        if (idx !== -1) {
          nextHoles[idx] = {
            id: targetHole.id,
            active: true,
            duckType,
            hit: false,
            spawnTime: nowMs,
          };

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
  }, [timeLeft]);

  // Main countdown timer
  useEffect(() => {
    if (!isPlaying) return;

    gameTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 8) {
          // Announce Gouden Frenzy in the final 7 seconds
          playSound('frenzy');
        }

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

  // Spawning loop with acceleration
  useEffect(() => {
    if (!isPlaying) return;

    // Faster spawns during final frenzy
    const speed = timeLeft <= 7 ? 400 : timeLeft > 18 ? 720 : 540;

    spawnTimerRef.current = setInterval(() => {
      spawnDuck();
    }, speed);

    return () => {
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, [isPlaying, timeLeft, spawnDuck]);

  // Start game
  const startGame = () => {
    clearHideTimers();
    setScore(0);
    setTimeLeft(30);
    setCombo(0);
    setMaxCombo(0);
    setTotalClicks(0);
    setSuccessfulHits(0);
    setReactionTimes([]);
    setIsGameOver(false);
    setScoreSubmitted(false);
    setSubmitError(null);
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

    setTimeout(() => {
      spawnDuck();
    }, 150);
  };

  // Multiplier helper based on streak
  const getMultiplier = (currentCombo: number): number => {
    if (currentCombo >= 15) return 3.0;
    if (currentCombo >= 10) return 2.0;
    if (currentCombo >= 5) return 1.5;
    return 1.0;
  };

  const currentMultiplier = getMultiplier(combo);

  // Click on a duck hole
  const handleHoleClick = (holeId: number) => {
    if (!isPlaying) return;

    setTotalClicks((c) => c + 1);

    const targetHole = holes.find((h) => h.id === holeId);

    // ANTI-SPAM: Miss on empty water or already hit duck
    if (!targetHole || !targetHole.active || targetHole.hit) {
      playSound('miss');
      setCombo(0); // Drops streak back to 1x multiplier
      setScore((s) => Math.max(0, s - 5));

      const floatId = nextFloatingId.current++;
      setFloatingScores((f) => [
        ...f,
        {
          id: floatId,
          holeId,
          score: -5,
          text: 'MIS! -5',
          type: 'miss',
        },
      ]);
      setTimeout(() => {
        setFloatingScores((f) => f.filter((item) => item.id !== floatId));
      }, 700);
      return;
    }

    // A valid duck was hit!
    setHoles((prev) => {
      const hole = prev.find((h) => h.id === holeId);
      if (!hole || !hole.active || hole.hit) return prev;

      const reactionTime = hole.spawnTime ? Date.now() - hole.spawnTime : 400;
      setReactionTimes((rt) => [...rt, reactionTime]);
      const isReflexBonus = reactionTime <= 350;

      let basePoints = 10;
      let text = '+10';

      if (hole.duckType === 'golden') {
        // Gouden Badeend!
        basePoints = 75;
        text = '+75! 👑';
        playSound('golden');
      } else if (hole.duckType === 'pils') {
        basePoints = 35;
        text = '+35! 🍺';
        playSound('pils');
      } else if (hole.duckType === 'trophy') {
        basePoints = 20;
        text = '+20! 🏆';
        playSound('trophy');
      } else if (hole.duckType === 'pirate') {
        // Penalty duck!
        basePoints = -20;
        text = '-20! 🏴‍☠️';
        playSound('penalty');
      } else {
        playSound('squeak');
      }

      // Combo & Multiplier Calculation
      let finalPoints = 0;
      if (hole.duckType === 'pirate') {
        setCombo(0);
        finalPoints = -20;
      } else {
        setSuccessfulHits((h) => h + 1);
        const nextCombo = combo + 1;
        setCombo(nextCombo);
        if (nextCombo > maxCombo) setMaxCombo(nextCombo);

        const mult = getMultiplier(nextCombo);
        finalPoints = Math.round(basePoints * mult);

        if (isReflexBonus) {
          finalPoints += 5;
          text = `BLIKSEM REFLEX! +${finalPoints}`;
        } else if (mult > 1.0) {
          text = `${mult}x COMBO! +${finalPoints}`;
        } else {
          text = `+${finalPoints}`;
        }

        if (nextCombo === 5 || nextCombo === 10 || nextCombo === 15) {
          playSound('combo');
        }
      }

      // Update score (cannot go below 0)
      setScore((s) => Math.max(0, s + finalPoints));

      // Floating score badge
      const floatId = nextFloatingId.current++;
      setFloatingScores((f) => [
        ...f,
        {
          id: floatId,
          holeId,
          score: finalPoints,
          text,
          type: hole.duckType === 'pirate' ? 'penalty' : hole.duckType,
        },
      ]);
      setTimeout(() => {
        setFloatingScores((f) => f.filter((item) => item.id !== floatId));
      }, 700);

      // Clear auto-hide timer
      if (hideTimersRef.current[holeId]) {
        clearTimeout(hideTimersRef.current[holeId]);
      }

      // Mark as hit and hide quickly
      setTimeout(() => {
        setHoles((curr) =>
          curr.map((h) => (h.id === holeId ? { ...h, active: false, hit: false } : h))
        );
      }, 220);

      return prev.map((h) =>
        h.id === holeId ? { ...h, hit: true, hitScore: finalPoints } : h
      );
    });
  };

  // Performance metrics calculation
  const accuracy = totalClicks > 0 ? Math.round((successfulHits / totalClicks) * 100) : 0;
  const avgReactionTime =
    reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;

  const getRankTitle = (pts: number): string => {
    if (pts >= 750) return 'Legendarische Meestermepper 👑';
    if (pts >= 500) return 'Olympisch Badeend-Mepper';
    if (pts >= 300) return 'Badmeester';
    if (pts >= 150) return 'Snelle Snater';
    return 'Amateur';
  };

  // Submit score to Leaderboard
  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerNameInput.trim()) {
      setSubmitError('Vul je naam of bijnaam in.');
      return;
    }

    setIsSubmittingScore(true);
    setSubmitError(null);

    try {
      localStorage.setItem('badeend_player_name', playerNameInput.trim());

      await saveMinigameScore({
        playerName: playerNameInput.trim(),
        teamName: selectedTeamInput || undefined,
        score,
        accuracy,
        maxStreak: maxCombo,
        avgReactionTimeMs: avgReactionTime,
        rankTitle: getRankTitle(score),
      });

      setScoreSubmitted(true);
      refreshScores();
    } catch (err) {
      console.error('Error saving minigame score:', err);
      setSubmitError('Er trad een fout op bij het opslaan. Probeer opnieuw.');
    } finally {
      setIsSubmittingScore(false);
    }
  };

  // Aggregate team standings
  const teamStandings = React.useMemo(() => {
    const map: Record<
      string,
      { teamName: string; totalScore: number; bestPlayer: string; bestScore: number; playerCount: number }
    > = {};

    leaderboardScores.forEach((item) => {
      if (item.teamName && item.teamName.trim()) {
        const tName = item.teamName.trim();
        if (!map[tName]) {
          map[tName] = {
            teamName: tName,
            totalScore: 0,
            bestPlayer: item.playerName,
            bestScore: item.score,
            playerCount: 0,
          };
        }
        map[tName].totalScore += item.score;
        map[tName].playerCount += 1;
        if (item.score > map[tName].bestScore) {
          map[tName].bestScore = item.score;
          map[tName].bestPlayer = item.playerName;
        }
      }
    });

    return Object.values(map).sort((a, b) => b.totalScore - a.totalScore);
  }, [leaderboardScores]);

  const isFrenzyActive = isPlaying && timeLeft <= 7;

  return (
    <div
      id="whack-a-duck-container"
      className="bg-white border-2 border-black p-5 sm:p-7 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
    >
      {/* Top Banner with Badges & Record info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b-2 border-slate-100">
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
              <Sparkles size={11} /> Officiële Teaser Minigame
            </div>
            <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-tight text-black leading-none">
              BADEENDJES MEPPEN (COMPETITIEF)
            </h3>
          </div>
        </div>

        {/* Action / Audio controls */}
        <div className="flex items-center gap-2">
          {topLeaderboardScore > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border-2 border-black text-xs font-black uppercase tracking-wider text-purple-950 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <TrophyIcon size={14} className="text-amber-500 fill-amber-400" />
              <span>
                Huidig record: {topLeaderboardScore} pt{' '}
                {topRecordHolder && <span className="text-slate-500">({topRecordHolder})</span>}
              </span>
            </div>
          )}

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

      {/* Competitive Dashboard Bar: Score, Time, Multiplier/Streak, Top Record */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
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
          className={`border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
            isFrenzyActive
              ? 'bg-amber-400 text-black animate-bounce-subtle ring-2 ring-amber-600'
              : timeLeft <= 5 && isPlaying
              ? 'bg-rose-100 text-rose-900 animate-pulse'
              : 'bg-sky-50 text-sky-900'
          }`}
        >
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider">
              {isFrenzyActive ? '⚡ FRENZY!' : 'TIJD OVER'}
            </span>
            {isFrenzyActive && <Crown size={14} className="text-amber-950 fill-amber-900 animate-spin" />}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display font-black text-3xl leading-none text-black">
              {timeLeft}
            </span>
            <span className="text-xs font-bold uppercase text-slate-700">sec</span>
          </div>
        </div>

        {/* Combo Multiplier */}
        <div
          className={`border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors ${
            currentMultiplier >= 3.0
              ? 'bg-rose-50 border-rose-600 ring-2 ring-rose-500'
              : currentMultiplier >= 2.0
              ? 'bg-orange-50 border-orange-600'
              : currentMultiplier >= 1.5
              ? 'bg-amber-50 border-amber-600'
              : 'bg-emerald-50'
          }`}
        >
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-black">
              MULTIPLIER
            </span>
            {combo >= 5 && <Flame size={14} className="text-orange-500 fill-orange-500 animate-bounce" />}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-display font-black text-3xl leading-none ${
                currentMultiplier >= 3.0
                  ? 'text-rose-600'
                  : currentMultiplier >= 2.0
                  ? 'text-orange-600'
                  : currentMultiplier >= 1.5
                  ? 'text-amber-600'
                  : 'text-emerald-700'
              }`}
            >
              {currentMultiplier.toFixed(1)}x
            </span>
            <span className="text-[10px] font-black uppercase text-slate-600">
              ({combo} streak)
            </span>
          </div>
        </div>

        {/* Record to beat */}
        <div className="bg-purple-50 border-2 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-900">
              HUIDIG RECORD
            </span>
            <TrophyIcon size={14} className="text-amber-500 fill-amber-400" />
          </div>
          <span className="font-display font-black text-3xl text-purple-950 leading-none block">
            {topLeaderboardScore > 0 ? topLeaderboardScore : 0}
          </span>
        </div>
      </div>

      {/* Frenzy Alert Banner in the final 7 seconds */}
      {isFrenzyActive && (
        <div className="mb-3 px-3 py-1.5 bg-amber-400 border-2 border-black flex items-center justify-between text-black font-display font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-pulse">
          <span className="flex items-center gap-1.5">
            <Crown size={15} className="fill-black text-black" />
            GOUDEN FRENZY ACTIEF: VANG DE GOUDEN BADEEND VOOR +75 PT!
          </span>
          <span className="text-[11px] bg-black text-amber-400 px-2 py-0.5">
            {timeLeft}s OVER
          </span>
        </div>
      )}

      {/* Progress Bar of Time */}
      <div className="w-full bg-slate-200 border-2 border-black h-3 mb-5 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isFrenzyActive ? 'bg-amber-400 animate-pulse' : timeLeft > 10 ? 'bg-sky-500' : 'bg-rose-500'
          }`}
          style={{ width: `${(timeLeft / 30) * 100}%` }}
        />
      </div>

      {/* Main Arena: 3x3 Grid of Water Ponds with Anti-Spam clicking */}
      <div
        className={`relative border-2 border-black p-4 sm:p-6 shadow-[inset_0px_4px_8px_rgba(0,0,0,0.06)] mb-6 select-none transition-colors duration-300 ${
          isFrenzyActive ? 'bg-amber-100/70 ring-4 ring-amber-400' : 'bg-sky-100'
        }`}
      >
        {/* Water Ripples Decoration */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="grid grid-cols-3 gap-3 sm:gap-5 relative z-10 max-w-md mx-auto">
          {holes.map((hole) => {
            const floating = floatingScores.find((f) => f.holeId === hole.id);

            return (
              <div
                key={hole.id}
                id={`duck-hole-${hole.id}`}
                onClick={() => handleHoleClick(hole.id)}
                className={`relative aspect-square border-2 border-black flex flex-col items-center justify-end overflow-hidden cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:translate-x-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all group ${
                  isFrenzyActive
                    ? 'bg-amber-200 hover:bg-amber-300'
                    : 'bg-sky-200 hover:bg-sky-300/80'
                }`}
              >
                {/* Floating Score Pop-up on Hit or Miss */}
                {floating && (
                  <div
                    className={`absolute top-2 z-30 font-display font-black text-xs sm:text-sm border border-black px-1.5 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in-75 duration-200 whitespace-nowrap ${
                      floating.type === 'miss'
                        ? 'bg-rose-600 text-white'
                        : floating.type === 'penalty'
                        ? 'bg-rose-500 text-white'
                        : floating.type === 'golden'
                        ? 'bg-amber-400 text-black ring-2 ring-black'
                        : floating.type === 'pils'
                        ? 'bg-amber-300 text-amber-950 ring-2 ring-amber-600'
                        : floating.type === 'trophy'
                        ? 'bg-yellow-300 text-yellow-950 ring-2 ring-yellow-500'
                        : 'bg-white text-black'
                    }`}
                  >
                    {floating.text}
                  </div>
                )}

                {/* The Duck/Item Character */}
                <div
                  className={`w-full h-full flex flex-col items-center justify-center transition-all duration-150 transform ${
                    hole.active
                      ? hole.hit
                        ? 'scale-75 translate-y-4 opacity-50 rotate-12'
                        : 'scale-100 translate-y-0 opacity-100'
                      : 'translate-y-16 opacity-0 scale-50 pointer-events-none'
                  }`}
                >
                  {/* Standard Gele Badeend */}
                  {hole.duckType === 'standard' && (
                    <div className="flex flex-col items-center animate-bounce-subtle">
                      <BadeendIllustration className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-md" />
                      <span className="text-[9px] font-black uppercase bg-amber-400 border border-black px-1 text-black mt-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        +10
                      </span>
                    </div>
                  )}

                  {/* Koude Pils! */}
                  {hole.duckType === 'pils' && (
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <PilsIllustration className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-md" />
                        <span className="absolute -top-1 -right-1 text-xs">✨</span>
                      </div>
                      <span className="text-[9px] font-black uppercase bg-amber-400 text-amber-950 border border-black px-1.5 mt-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        +35!
                      </span>
                    </div>
                  )}

                  {/* Gouden Trofee */}
                  {hole.duckType === 'trophy' && (
                    <div className="flex flex-col items-center">
                      <div className="relative animate-pulse">
                        <TrofeeIllustration className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-md" />
                        <span className="absolute -top-1 -left-1 text-xs">⭐</span>
                      </div>
                      <span className="text-[9px] font-black uppercase bg-yellow-300 text-yellow-950 border border-black px-1.5 mt-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        +20!
                      </span>
                    </div>
                  )}

                  {/* De Gouden Badeend (Super Bonus) */}
                  {hole.duckType === 'golden' && (
                    <div className="flex flex-col items-center">
                      <div className="relative animate-bounce">
                        <GoudenBadeendIllustration className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-lg filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)]" />
                        <span className="absolute -top-1 -right-1 text-xs animate-spin">✨</span>
                      </div>
                      <span className="text-[9px] font-black uppercase bg-black text-amber-400 border border-amber-400 px-1.5 mt-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        +75
                      </span>
                    </div>
                  )}

                  {/* Piraat Badeend (Penalty) */}
                  {hole.duckType === 'pirate' && (
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <PiraatIllustration className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-md" />
                      </div>
                      <span className="text-[9px] font-black uppercase bg-rose-500 text-white border border-black px-1 mt-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                        PAS OP! -20
                      </span>
                    </div>
                  )}
                </div>

                {/* Water Ring / Pool Base Trim */}
                <div
                  className={`w-full border-t-2 border-black py-1 px-2 flex items-center justify-between text-[9px] font-black uppercase tracking-tighter shrink-0 select-none ${
                    isFrenzyActive ? 'bg-amber-400 text-black' : 'bg-sky-400 text-sky-950'
                  }`}
                >
                  <span>PLONS #{hole.id + 1}</span>
                  <div className="w-2 h-2 rounded-full bg-white border border-black" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Start / Game Over Modal Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-20 overflow-y-auto">
            {isGameOver ? (
              <div className="bg-white border-2 border-black p-5 sm:p-7 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200 text-left my-auto">
                <div className="text-center pb-3 border-b-2 border-black mb-4">
                  <div className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black leading-none mb-1">
                    TIJD IS OM!
                  </div>
                  <div className="inline-block px-3 py-1 bg-amber-400 border border-black text-xs font-display font-black uppercase tracking-wider text-black mt-1">
                    {getRankTitle(score)}
                  </div>
                </div>

                {/* Post Game Stats Grid */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-amber-50 border-2 border-black p-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-950 block">
                      SCORE
                    </span>
                    <span className="font-display font-black text-2xl text-black block leading-none mt-0.5">
                      {score}
                    </span>
                  </div>

                  <div className="bg-sky-50 border-2 border-black p-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-sky-950 block">
                      PRECISIE
                    </span>
                    <span className="font-display font-black text-2xl text-sky-900 block leading-none mt-0.5">
                      {accuracy}%
                    </span>
                  </div>

                  <div className="bg-emerald-50 border-2 border-black p-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-950 block">
                      MAX STREAK
                    </span>
                    <span className="font-display font-black text-2xl text-emerald-700 block leading-none mt-0.5">
                      {maxCombo}x
                    </span>
                  </div>
                </div>

                {/* Additional metrics */}
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-4 px-1">
                  <span>Gem. reactietijd: <strong>{avgReactionTime} ms</strong></span>
                  <span>Rake tikken: <strong>{successfulHits} van {totalClicks}</strong></span>
                </div>

                {/* Submit to Live Leaderboard Form */}
                {!scoreSubmitted ? (
                  <form onSubmit={handleSubmitScore} className="bg-slate-50 border-2 border-black p-3.5 mb-4">
                    <span className="font-display font-black text-xs uppercase tracking-wider text-black block mb-2">
                      🏆 PLAATS JE SCORE OP HET LEADERBOARD:
                    </span>

                    {submitError && (
                      <div className="mb-2 p-2 bg-rose-50 border border-rose-500 text-rose-800 text-xs font-bold flex items-center gap-1.5">
                        <AlertCircle size={14} /> {submitError}
                      </div>
                    )}

                    <div className="space-y-2 mb-3">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700 mb-0.5">
                          JOUW NAAM / BIJNAAM *
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={40}
                          value={playerNameInput}
                          onChange={(e) => setPlayerNameInput(e.target.value)}
                          placeholder="Bijv. Tim de Mepper"
                          className="w-full px-2.5 py-1.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none focus:bg-amber-50"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-0.5">
                          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-700">
                            TEAM VERTEGENWOORDIGEN (OPTIONEEL)
                          </label>
                          {registeredTeams.length > 0 && (
                            <span className="text-[10px] text-amber-700 font-bold">
                              {registeredTeams.length} ingeschreven {registeredTeams.length === 1 ? 'team' : 'teams'}
                            </span>
                          )}
                        </div>

                        {registeredTeams.length > 0 ? (
                          <div className="space-y-1.5">
                            <select
                              value={selectedTeamInput}
                              onChange={(e) => setSelectedTeamInput(e.target.value)}
                              className="w-full px-2.5 py-1.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none focus:bg-amber-50"
                            >
                              <option value="">-- Geen team / Individueel --</option>
                              {registeredTeams.map((t) => (
                                <option key={t.id} value={t.name}>
                                  {t.name}
                                </option>
                              ))}
                            </select>
                            <span className="text-[10px] text-slate-500 font-medium block">
                              Selecteer je officiële team om punten te verzamelen voor het teamklassement.
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            <input
                              type="text"
                              maxLength={40}
                              value={selectedTeamInput}
                              onChange={(e) => setSelectedTeamInput(e.target.value)}
                              placeholder="Bijv. De Gele Snelle Kwakers (of leeg laten)"
                              className="w-full px-2.5 py-1.5 bg-white border-2 border-black text-xs font-bold text-black focus:outline-none focus:bg-amber-50"
                            />
                            <span className="text-[10px] text-slate-500 font-medium block">
                              Typ je teamnaam in, of meld je team officieel aan via het inschrijfformulier.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingScore}
                      className="w-full py-2 bg-black text-amber-400 hover:bg-slate-900 border-2 border-black font-display font-black text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                    >
                      {isSubmittingScore ? 'BEZIG MET OPSLAAN...' : 'SCORE VERZENDEN NAAR LEADERBOARD →'}
                    </button>
                  </form>
                ) : (
                  <div className="bg-emerald-50 border-2 border-emerald-600 p-3 mb-4 text-center">
                    <CheckCircle2 size={24} className="text-emerald-600 mx-auto mb-1" />
                    <span className="font-display font-black text-xs uppercase tracking-wider text-emerald-950 block">
                      SCORE SUCCESVOL VERZONDEN! 🎉
                    </span>
                    <span className="text-[11px] text-emerald-800 font-semibold block mt-0.5">
                      Je score is live toegevoegd aan het officiële minigame leaderboard hieronder.
                    </span>
                  </div>
                )}

                <button
                  id="whack-a-duck-restart-btn"
                  onClick={startGame}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 border-2 border-black font-display font-black text-sm uppercase tracking-wider text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-2 transition-all active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
                >
                  <RotateCcw size={16} /> OPNIEUW SPELEN
                </button>
              </div>
            ) : (
              <div className="bg-white border-2 border-black p-6 max-w-sm w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
                <div className="w-16 h-16 bg-white border-2 border-black mx-auto mb-3 p-1 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                  <img
                    src="/hammer-duck.png"
                    alt="Badeendjes Meppen Start"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="font-display font-black text-2xl uppercase tracking-tight text-black mb-1">
                  KLAAR VOOR DE STRIJD?
                </div>
                <p className="text-xs text-slate-600 font-medium mb-3 leading-relaxed">
                  Meppen vereist precisie: misklikken kost 5 punten en verbreekt je streak! Vang in de slotfase de <strong>Gouden Badeend (+75 pt)</strong>.
                </p>

                <div className="bg-amber-50 border-2 border-black p-2.5 mb-4 text-xs font-bold text-amber-950 flex items-center justify-around">
                  <span>🔥 Multiplier tot 3x</span>
                  <span>⚡ Snelle reflex bonus</span>
                </div>

                <button
                  id="whack-a-duck-start-btn"
                  onClick={startGame}
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 border-2 border-black font-display font-black text-sm uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer flex items-center justify-center gap-2 transition-all active:translate-y-0.5 active:translate-x-0.5 active:shadow-none"
                >
                  <Play size={18} fill="currentColor" /> START DE COMPETITIE
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Item Guide & Scoring Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t-2 border-slate-100 text-center mb-8">
        <div className="p-2.5 bg-slate-50 border-2 border-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
          <BadeendIllustration className="w-10 h-10 mb-1" />
          <span className="font-bold text-[11px] block text-black">Badeend</span>
          <span className="text-[10px] text-slate-600 font-bold">+10 pt</span>
        </div>
        <div className="p-2.5 bg-slate-50 border-2 border-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
          <PilsIllustration className="w-10 h-10 mb-1" />
          <span className="font-bold text-[11px] block text-black">Pils!</span>
          <span className="text-[10px] text-amber-700 font-black">+35 pt (snel)</span>
        </div>
        <div className="p-2.5 bg-slate-50 border-2 border-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
          <TrofeeIllustration className="w-10 h-10 mb-1" />
          <span className="font-bold text-[11px] block text-black">Trofee</span>
          <span className="text-[10px] text-yellow-800 font-black">+20 pt</span>
        </div>
        <div className="p-2.5 bg-amber-50 border-2 border-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
          <GoudenBadeendIllustration className="w-10 h-10 mb-1" />
          <span className="font-black text-[11px] block text-black">Gouden Badeend</span>
          <span className="text-[10px] text-amber-800 font-black">+75 pt (frenzy)</span>
        </div>
        <div className="p-2.5 bg-slate-50 border-2 border-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center">
          <PiraatIllustration className="w-10 h-10 mb-1" />
          <span className="font-bold text-[11px] block text-black">Piraat</span>
          <span className="text-[10px] text-rose-600 font-black">-20 pt (ontwijk)</span>
        </div>
      </div>

      {/* --- LIVE PUBLIC LEADERBOARD SECTION --- */}
      <div id="minigame-leaderboard" className="pt-6 border-t-2 border-black">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <TrophyIcon size={16} />
            </div>
            <div>
              <h4 className="font-display font-black text-lg uppercase tracking-tight text-black">
                LEADERBOARD BADEENDJES MEPPEN
              </h4>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Live ranglijst & teamstrijd
              </span>
            </div>
          </div>

          {/* Toggle Tab: Individual vs Teams */}
          <div className="flex items-center bg-slate-100 border-2 border-black p-0.5">
            <button
              onClick={() => setActiveLeaderboardTab('individual')}
              className={`px-3 py-1 text-xs font-display font-black uppercase tracking-wider cursor-pointer transition-colors ${
                activeLeaderboardTab === 'individual'
                  ? 'bg-black text-amber-400'
                  : 'text-slate-700 hover:text-black'
              }`}
            >
              Top 10 Meppers
            </button>
            <button
              onClick={() => setActiveLeaderboardTab('teams')}
              className={`px-3 py-1 text-xs font-display font-black uppercase tracking-wider cursor-pointer transition-colors ${
                activeLeaderboardTab === 'teams'
                  ? 'bg-black text-amber-400'
                  : 'text-slate-700 hover:text-black'
              }`}
            >
              Teamklassement
            </button>
          </div>
        </div>

        {/* Tab 1: Top 10 Individual */}
        {activeLeaderboardTab === 'individual' && (
          <div>
            {leaderboardScores.length === 0 ? (
              <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 text-center text-xs font-semibold text-slate-600">
                Er zijn nog geen scores ingediend. Speel de minigame en vestig het allereerste record!
              </div>
            ) : (
              <div className="border-2 border-black overflow-hidden bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-black text-white font-display font-black text-[11px] uppercase tracking-wider border-b-2 border-black">
                        <th className="py-2.5 px-3 w-12 text-center">#</th>
                        <th className="py-2.5 px-3">Deelnemer</th>
                        <th className="py-2.5 px-3">Team</th>
                        <th className="py-2.5 px-3 text-right">Score</th>
                        <th className="py-2.5 px-3 text-right hidden sm:table-cell">Precisie</th>
                        <th className="py-2.5 px-3 text-right hidden sm:table-cell">Streak</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-bold">
                      {leaderboardScores.slice(0, 10).map((entry, idx) => {
                        const isGold = idx === 0;
                        const isSilver = idx === 1;
                        const isBronze = idx === 2;

                        return (
                          <tr
                            key={entry.id}
                            className={`hover:bg-slate-50 transition-colors ${
                              isGold ? 'bg-amber-50/70 font-black' : ''
                            }`}
                          >
                            <td className="py-2.5 px-3 text-center">
                              {isGold ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-400 border border-black text-xs font-black rounded-full">
                                  1
                                </span>
                              ) : isSilver ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-slate-200 border border-black text-xs font-black rounded-full">
                                  2
                                </span>
                              ) : isBronze ? (
                                <span className="inline-flex items-center justify-center w-6 h-6 bg-amber-700 text-white border border-black text-xs font-black rounded-full">
                                  3
                                </span>
                              ) : (
                                <span className="text-slate-500 font-display font-black">
                                  {idx + 1}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-black">
                              <div className="flex items-center gap-1.5">
                                <span>{entry.playerName}</span>
                                {isGold && <Crown size={13} className="text-amber-500 fill-amber-400" />}
                              </div>
                              {entry.rankTitle && (
                                <span className="text-[10px] text-slate-500 font-medium block">
                                  {entry.rankTitle}
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-slate-700">
                              {entry.teamName ? (
                                <span className="inline-block px-1.5 py-0.5 bg-slate-100 border border-slate-300 text-[10px] uppercase tracking-wider text-black">
                                  {entry.teamName}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">Individueel</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-right font-display font-black text-sm text-black">
                              {entry.score} pt
                            </td>
                            <td className="py-2.5 px-3 text-right hidden sm:table-cell text-slate-600">
                              {entry.accuracy ? `${entry.accuracy}%` : '-'}
                            </td>
                            <td className="py-2.5 px-3 text-right hidden sm:table-cell text-slate-600">
                              {entry.maxStreak ? `${entry.maxStreak}x` : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Team Standings */}
        {activeLeaderboardTab === 'teams' && (
          <div>
            {teamStandings.length === 0 ? (
              <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 text-center text-xs font-semibold text-slate-600">
                Nog geen teamscores vastgelegd. Speel een potje en kies jouw team om punten te verzamelen voor het klassement!
              </div>
            ) : (
              <div className="border-2 border-black overflow-hidden bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-black text-white font-display font-black text-[11px] uppercase tracking-wider border-b-2 border-black">
                      <th className="py-2.5 px-3 w-12 text-center">#</th>
                      <th className="py-2.5 px-3">Team</th>
                      <th className="py-2.5 px-3 text-right">Totaal Punten</th>
                      <th className="py-2.5 px-3 text-right hidden sm:table-cell">Top Mepper</th>
                      <th className="py-2.5 px-3 text-right hidden sm:table-cell">Aantal Meppers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold">
                    {teamStandings.map((team, idx) => (
                      <tr key={team.teamName} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 text-center font-display font-black">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                        </td>
                        <td className="py-2.5 px-3 text-black font-black uppercase tracking-tight">
                          {team.teamName}
                        </td>
                        <td className="py-2.5 px-3 text-right font-display font-black text-sm text-black">
                          {team.totalScore} pt
                        </td>
                        <td className="py-2.5 px-3 text-right hidden sm:table-cell text-slate-700">
                          {team.bestPlayer} ({team.bestScore} pt)
                        </td>
                        <td className="py-2.5 px-3 text-right hidden sm:table-cell text-slate-600">
                          {team.playerCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
