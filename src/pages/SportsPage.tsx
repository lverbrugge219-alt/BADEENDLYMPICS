import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Compass,
  Flame,
  Info,
  Play,
  RotateCcw,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Waves,
  Zap
} from 'lucide-react';
import { PageRoute, ScheduleEvent, SportId, SportInfo, Team } from '../types';
import { RubberDuckGraphic } from '../components/RubberDuckGraphic';
import { playDuckQuack, playVictoryChime, playWhistle } from '../utils/audio';

interface SportsPageProps {
  currentSportId: SportId;
  sports: SportInfo[];
  teams: Team[];
  schedule: ScheduleEvent[];
  onNavigate: (route: PageRoute) => void;
  onSelectSport: (sportId: SportId) => void;
}

export const SportsPage: React.FC<SportsPageProps> = ({
  currentSportId,
  sports,
  teams,
  schedule,
  onNavigate,
  onSelectSport
}) => {
  const sport = sports.find((s) => s.id === currentSportId) || sports[0];

  // Interactive Live Race / Heat Simulator State
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationResults, setSimulationResults] = useState<{ name: string; country: string; time: string; color: string; accessory: 'goggles' | 'medal' | 'headband' | 'snorkel' | 'cape' | 'crown'; rank: number }[] | null>(null);

  // Teams participating in this sport
  const competingTeams = teams.filter((t) => t.registeredSports.includes(sport.id));

  // Scheduled events for this sport
  const sportEvents = schedule.filter((e) => e.sportId === sport.id);

  const startMiniSimulation = () => {
    setSimulationRunning(true);
    setSimulationResults(null);
    playWhistle();

    setTimeout(() => {
      playDuckQuack(1.1);
    }, 600);
    setTimeout(() => {
      playDuckQuack(1.3);
    }, 1200);

    setTimeout(() => {
      const sampleRunners = competingTeams.slice(0, 4).map((t, idx) => {
        const baseSeconds = sport.id === 'rapids-sprint' ? 11.5 : sport.id === 'whirlpool-slalom' ? 24.5 : sport.id === 'hydro-tug' ? 18.0 : 85.0;
        const variance = (Math.random() * 1.8 - 0.9);
        const scoreVal = (baseSeconds + variance).toFixed(2);
        return {
          name: t.name,
          country: t.country,
          color: t.duckColor,
          accessory: t.accessory,
          time: sport.id === 'quack-diving' ? `${(94 + Math.random() * 5).toFixed(2)} pts` : `${scoreVal}s`
        };
      });

      // Sort by time or points
      sampleRunners.sort((a, b) => {
        if (sport.id === 'quack-diving') {
          return parseFloat(b.time) - parseFloat(a.time);
        }
        return parseFloat(a.time) - parseFloat(b.time);
      });

      const ranked = sampleRunners.map((r, i) => ({ ...r, rank: i + 1 }));
      setSimulationResults(ranked);
      setSimulationRunning(false);
      playVictoryChime();
    }, 2200);
  };

  const getSportIcon = (id: SportId) => {
    switch (id) {
      case 'rapids-sprint': return '⚡';
      case 'quack-diving': return '🌊';
      case 'hydro-tug': return '⚓';
      case 'pond-water-polo': return '🛡️';
      case 'whirlpool-slalom': return '🌀';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* TOP SPORT SUBNAV TABS */}
      <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('home')}
            className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-black uppercase tracking-widest text-black">Official Disciplines</span>
        </div>

        {/* 5 SPORT SELECTOR PILLS */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl">
          {sports.map((s) => {
            const isSelected = s.id === sport.id;
            return (
              <button
                key={s.id}
                id={`sport-tab-${s.id}`}
                onClick={() => {
                  onSelectSport(s.id);
                  playDuckQuack(1.05);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  isSelected
                    ? 'bg-black text-white shadow-xs'
                    : 'text-slate-700 hover:bg-white hover:text-slate-950'
                }`}
              >
                <span>{getSportIcon(s.id)}</span>
                <span className="hidden sm:inline">{s.name}</span>
                <span className="sm:hidden">{s.dutchName.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DEDICATED SPORT HERO BANNER */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-400 text-black font-black text-xs uppercase tracking-widest shadow-xs">
                {getSportIcon(sport.id)} Discipline #{sports.findIndex((s) => s.id === sport.id) + 1}
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                {sport.dutchName}
              </span>
              <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                {sport.trackDetails.arena}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-black uppercase italic tracking-tight text-slate-950">
              {sport.name}
            </h1>

            <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
              {sport.description}
            </p>

            {/* Key Technique Callout */}
            <div className="inline-flex items-center gap-2 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-black text-amber-950 uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Key Technique: {sport.keyTechnique}</span>
            </div>
          </div>

          {/* Right Col: Big Duck Mascot + World Record Card */}
          <div className="lg:col-span-4 space-y-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm text-center flex flex-col items-center">
              <RubberDuckGraphic
                size={84}
                color="#F59E0B"
                accessory={sport.id === 'quack-diving' ? 'medal' : sport.id === 'rapids-sprint' ? 'goggles' : sport.id === 'hydro-tug' ? 'snorkel' : 'headband'}
                showWaterRipple
                animated
              />

              <div className="w-full mt-4 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-black text-[10px] uppercase tracking-widest text-slate-400">World Record Holder</span>
                  <Trophy className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <div className="text-xl font-black uppercase italic tracking-tight text-slate-950">{sport.worldRecord.record}</div>
                <div className="text-xs font-bold text-slate-700">{sport.worldRecord.holder}</div>
                <div className="text-[11px] text-slate-400">{sport.worldRecord.team} ({sport.worldRecord.year})</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRACK SPECS & TECHNICAL PARAMETERS */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-1.5 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Course Length</span>
          <div className="text-xl font-black text-slate-950 font-mono">{sport.trackDetails.length}</div>
          <p className="text-xs text-slate-400">Official Olympic Standard</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-1.5 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Current Velocity</span>
          <div className="text-xl font-black text-sky-700 font-mono">{sport.currentSpeed}</div>
          <p className="text-xs text-slate-400">Hydraulic Pump System</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-1.5 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Pool Depth</span>
          <div className="text-xl font-black text-slate-950 font-mono">{sport.poolDepth}</div>
          <p className="text-xs text-slate-400">Sub-surface Clearance</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 space-y-1.5 shadow-xs">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Duck Weight Spec</span>
          <div className="text-xl font-black text-amber-500 font-mono">{sport.duckSpec.split(',')[0]}</div>
          <p className="text-xs text-slate-400">Scrutineering Verified</p>
        </div>
      </section>

      {/* INTERACTIVE TRACK DIAGRAM & HEAT SIMULATOR */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900 text-white p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-amber-400 mb-1">
              <Zap className="h-3.5 w-3.5" />
              Interactive Heat Simulator
            </div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white">
              Simulate Live {sport.name}
            </h3>
          </div>

          <button
            id="simulate-heat-btn"
            onClick={startMiniSimulation}
            disabled={simulationRunning}
            className={`px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md active:scale-95 ${
              simulationRunning
                ? 'bg-amber-400/50 text-black cursor-wait'
                : 'bg-amber-400 hover:bg-amber-300 text-black'
            }`}
          >
            {simulationRunning ? (
              <>
                <RotateCcw className="h-4 w-4 animate-spin text-black" />
                <span>Ducks Floating Downstream...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-black text-black" />
                <span>Launch Test Heat</span>
              </>
            )}
          </button>
        </div>

        {/* Visual Flume Track simulation lane */}
        <div className="relative rounded-3xl border border-slate-800 bg-slate-950/90 p-5 sm:p-6 overflow-hidden">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
            <span>🏁 Gate Start</span>
            <span className="text-amber-400 font-bold">Turbulent Flow (4.2 m/s) →</span>
            <span>🏁 Laser Finish</span>
          </div>

          {/* Visual Track Lanes */}
          <div className="space-y-2.5">
            {competingTeams.slice(0, 4).map((t, idx) => (
              <div
                key={t.id}
                className="relative h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center px-4 overflow-hidden"
              >
                {/* Lane Water Wave Lines */}
                <div className="absolute inset-0 bg-gradient-to-r from-sky-950/30 via-slate-900 to-sky-900/20" />

                <span className="relative z-10 text-[10px] font-mono font-black text-slate-400 mr-3">
                  LANE {idx + 1}
                </span>

                {/* Animated Duck */}
                <div
                  className={`relative z-10 flex items-center gap-2.5 transition-all duration-1000 ${
                    simulationRunning ? 'translate-x-[260px] sm:translate-x-[450px]' : 'translate-x-0'
                  }`}
                >
                  <RubberDuckGraphic size={28} color={t.duckColor} accessory={t.accessory} />
                  <span className="text-xs font-black uppercase tracking-tight text-white whitespace-nowrap">{t.name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Simulation Output Table */}
          {simulationResults && (
            <div className="mt-6 rounded-2xl border border-amber-400/40 bg-slate-900 p-5 animate-in fade-in zoom-in-95">
              <div className="text-xs font-black uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-1.5">
                <Trophy className="h-4 w-4" />
                <span>Simulated Heat Results</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {simulationResults.map((res) => (
                  <div
                    key={res.name}
                    className={`p-3.5 rounded-xl border ${
                      res.rank === 1
                        ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black uppercase tracking-wider text-[10px]">Rank #{res.rank}</span>
                      <span className="font-mono font-black text-amber-400">{res.time}</span>
                    </div>
                    <div className="font-bold text-white text-xs mt-1 truncate">{res.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* OFFICIAL DISCIPLINE RULES & SCORING */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Shield className="h-5 w-5 text-amber-500" />
            <h3 className="font-black uppercase italic tracking-tight text-slate-950 text-xl">Official Sport Rules</h3>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-600">
            {sport.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-white font-bold text-[10px] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Award className="h-5 w-5 text-sky-600" />
            <h3 className="font-black uppercase italic tracking-tight text-slate-950 text-xl">Scoring & Qualification</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            {sport.scoringSystem}
          </p>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2.5">
            <span className="text-xs font-black uppercase tracking-widest text-slate-900 block">
              Upcoming Heats for {sport.name}
            </span>
            {sportEvents.length > 0 ? (
              <div className="space-y-2">
                {sportEvents.map((evt) => (
                  <div key={evt.id} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                    <span className="font-black uppercase tracking-tight text-slate-900">{evt.stage}</span>
                    <span className="text-slate-400 font-medium">{evt.date} • {evt.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">Heats announced after preliminary weigh-in.</p>
            )}
          </div>
        </div>
      </section>

      {/* SIGN UP CTA */}
      <div className="rounded-3xl border border-slate-200 bg-white p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="font-black uppercase italic tracking-tight text-xl sm:text-2xl text-slate-950">Want to Enter Your Duck in {sport.name}?</h4>
          <p className="text-xs sm:text-sm font-medium text-slate-500">
            Open Classic and Junior categories are now accepting team registrations!
          </p>
        </div>
        <button
          onClick={() => {
            onNavigate('signup');
            playDuckQuack(1.1);
          }}
          className="bg-black text-white hover:bg-slate-800 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-black/10 active:scale-95 transition-all shrink-0"
        >
          Sign Up for {sport.dutchName} →
        </button>
      </div>
    </div>
  );
};
