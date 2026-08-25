import React from 'react';
import {
  ArrowRight,
  Award,
  Calendar,
  Compass,
  Flame,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Waves,
  Zap
} from 'lucide-react';
import { DuckleteProfile, PageRoute, SportId, SportInfo, Team } from '../types';
import { CountdownTimer } from '../components/CountdownTimer';
import { RubberDuckGraphic } from '../components/RubberDuckGraphic';
import { playDuckQuack } from '../utils/audio';

interface HomePageProps {
  sports: SportInfo[];
  teams: Team[];
  starDuckletes: DuckleteProfile[];
  onNavigate: (route: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  sports,
  teams,
  starDuckletes,
  onNavigate
}) => {
  // Sort top 3 teams for the podium preview
  const topTeams = [...teams].sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white pt-10 pb-16 sm:pt-16 sm:pb-24">
        {/* Subtle background gradients */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-amber-100/50 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-sky-100/40 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Col: Hero Title & Badges */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-black uppercase tracking-widest text-slate-900 shadow-xs">
                <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span>Official 2026 World Games</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 font-bold">Utrecht, Netherlands</span>
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black uppercase tracking-tight italic leading-none text-slate-950">
                  THE WORLD’S <br className="hidden sm:inline" />
                  <span className="text-amber-500 underline decoration-sky-300 decoration-8 underline-offset-4">
                    FASTEST
                  </span>{' '}
                  DUCKS.
                </h1>
                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
                  Welcome to <span className="font-black text-slate-950 uppercase">BADEENDLYMPICS</span> — where supreme hydrodynamics, aerodynamic beaks, and fearless flotation collide in 5 Olympic disciplines.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  id="hero-cta-signup"
                  onClick={() => {
                    onNavigate('signup');
                    playDuckQuack(1.1);
                  }}
                  className="inline-flex items-center gap-2 bg-black text-white hover:bg-slate-800 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-black/10 active:scale-95 transition-all"
                >
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>Sign Up Your Team</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  id="hero-cta-sports"
                  onClick={() => {
                    onNavigate('sport-rapids-sprint');
                    playDuckQuack(1.0);
                  }}
                  className="inline-flex items-center gap-2 bg-white border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs text-slate-900 hover:border-slate-400 active:scale-95 transition-all"
                >
                  <Zap className="h-4 w-4 text-amber-500" />
                  <span>Explore 5 Sports</span>
                </button>

                <button
                  id="hero-cta-schedule"
                  onClick={() => onNavigate('schedule')}
                  className="inline-flex items-center gap-2 px-5 py-4 rounded-2xl text-slate-600 font-bold uppercase tracking-wider text-xs hover:text-slate-950 hover:bg-slate-100 transition-all"
                >
                  <Calendar className="h-4 w-4 text-sky-500" />
                  <span>Race Schedule</span>
                </button>
              </div>

              {/* Quick Stat Highlights */}
              <div className="grid grid-cols-3 gap-3 pt-4 max-w-lg mx-auto lg:mx-0">
                <div className="rounded-2xl border border-slate-200 bg-white p-3.5 text-center shadow-xs">
                  <div className="text-2xl font-black italic text-slate-950">5</div>
                  <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Disciplines</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3.5 text-center shadow-xs">
                  <div className="text-2xl font-black italic text-slate-950">24+</div>
                  <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Nations</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-3.5 text-center shadow-xs">
                  <div className="text-2xl font-black italic text-slate-950">1,200+</div>
                  <div className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Ducks Fleet</div>
                </div>
              </div>
            </div>

            {/* Right Col: Interactive Countdown Timer & Defending Champion */}
            <div className="lg:col-span-5 space-y-4">
              <CountdownTimer onExploreClick={() => onNavigate('schedule')} />

              {/* Defending Champion Card */}
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="relative flex items-center justify-center p-1 bg-amber-50 rounded-2xl border border-amber-200">
                    <RubberDuckGraphic size={44} color="#F59E0B" accessory="goggles" animated showWaterRipple />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block">
                      Defending Champion
                    </span>
                    <h4 className="text-sm font-black text-slate-950 uppercase tracking-tight">Sir Quacks-a-Lot (NED)</h4>
                    <p className="text-xs text-slate-500 font-mono">11.42s in 50m Rapids Sprint</p>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('profiles')}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold uppercase tracking-wider text-xs shrink-0 transition-colors"
                >
                  Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 SPORTS SHOWCASE BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-900 bg-amber-400 px-3 py-1 rounded-full mb-3">
              <Zap className="h-3.5 w-3.5" />
              Championship Disciplines
            </div>
            <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tight text-slate-950">
              5 Dedicated Olympic Sports
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-1 max-w-2xl font-medium">
              Every discipline demands specialized ballast distribution, hull aerodynamics, and water navigation strategy.
            </p>
          </div>

          <button
            onClick={() => onNavigate('info')}
            className="text-xs font-black uppercase tracking-widest text-slate-900 hover:text-amber-600 flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl border border-slate-200 transition-colors"
          >
            <span>Read Rulebook</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sports.map((sport, index) => {
            const sportRoutes: Record<SportId, PageRoute> = {
              'rapids-sprint': 'sport-rapids-sprint',
              'quack-diving': 'sport-quack-diving',
              'hydro-tug': 'sport-hydro-tug',
              'pond-water-polo': 'sport-pond-water-polo',
              'whirlpool-slalom': 'sport-whirlpool-slalom'
            };

            const icons: Record<SportId, string> = {
              'rapids-sprint': '⚡',
              'quack-diving': '🌊',
              'hydro-tug': '⚓',
              'pond-water-polo': '🛡️',
              'whirlpool-slalom': '🌀'
            };

            const accessories: Record<SportId, 'goggles' | 'medal' | 'headband' | 'snorkel' | 'cape'> = {
              'rapids-sprint': 'goggles',
              'quack-diving': 'medal',
              'hydro-tug': 'snorkel',
              'pond-water-polo': 'cape',
              'whirlpool-slalom': 'headband'
            };

            return (
              <div
                key={sport.id}
                id={`home-sport-card-${sport.id}`}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs hover:border-amber-400 hover:shadow-xl transition-all duration-200 ${
                  index === 0 ? 'lg:col-span-2 bg-gradient-to-br from-amber-50/40 via-white to-sky-50/30' : ''
                }`}
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400 text-black font-black text-xl shadow-xs border border-amber-500/20">
                        {icons[sport.id]}
                      </span>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {sport.dutchName}
                        </span>
                        <h3 className="text-xl font-black uppercase italic tracking-tight text-slate-950 group-hover:text-amber-600 transition-colors">
                          {sport.name}
                        </h3>
                      </div>
                    </div>

                    <RubberDuckGraphic
                      size={44}
                      color="#F59E0B"
                      accessory={accessories[sport.id]}
                      showWaterRipple={false}
                    />
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-5 font-normal">
                    {sport.tagline}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs font-semibold py-3 border-y border-slate-100">
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-slate-400 block text-[10px] uppercase font-black tracking-widest">World Record</span>
                      <span className="text-slate-950 font-mono font-bold">{sport.worldRecord.record}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-slate-400 block text-[10px] uppercase font-black tracking-widest">Current Speed</span>
                      <span className="text-slate-950 font-bold">{sport.currentSpeed}</span>
                    </div>
                  </div>
                </div>

                {/* Footer link */}
                <div className="pt-5 flex items-center justify-between mt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {sport.trackDetails.arena}
                  </span>
                  <button
                    onClick={() => {
                      onNavigate(sportRoutes[sport.id]);
                      playDuckQuack(1.05);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-900 group-hover:text-amber-500 group-hover:translate-x-1 transition-all"
                  >
                    <span>View Discipline</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* LIVE PODIUM & MEDAL PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 text-white p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle gold & aquatic glow */}
          <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />

          <div className="relative flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-2">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                Live Standings
              </div>
              <h2 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight text-white">
                Top Flotillas on the Podium
              </h2>
            </div>

            <button
              onClick={() => onNavigate('leaderboard')}
              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 border border-amber-500"
            >
              Full Leaderboard →
            </button>
          </div>

          {/* 3-Column Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 pt-2">
            {topTeams.map((team, idx) => {
              const medals = [
                { rank: '1ST', bg: 'bg-amber-400 text-black', badge: '🥇 GOLD TROPHY' },
                { rank: '2ND', bg: 'bg-slate-700 text-white', badge: '🥈 SILVER TROPHY' },
                { rank: '3RD', bg: 'bg-amber-900 text-amber-200', badge: '🥉 BRONZE TROPHY' }
              ];
              const m = medals[idx];

              return (
                <div
                  key={team.id}
                  className="rounded-2xl border border-slate-800 bg-white/5 p-6 flex flex-col justify-between hover:bg-white/10 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${m.bg}`}>
                        {m.badge}
                      </span>
                      <span className="font-mono text-sm font-black text-amber-400">
                        {team.totalPoints} PTS
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5 my-4">
                      <RubberDuckGraphic size={48} color={team.duckColor} accessory={team.accessory} />
                      <div>
                        <h4 className="font-black text-lg text-white uppercase italic tracking-tight">{team.name}</h4>
                        <p className="text-xs text-slate-400">{team.country} • Captain {team.captain}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-around text-xs bg-black/40 p-3 rounded-xl my-4 border border-white/5">
                      <span className="text-amber-400 font-bold">🥇 {team.gold}</span>
                      <span className="text-slate-300 font-bold">🥈 {team.silver}</span>
                      <span className="text-amber-600 font-bold">🥉 {team.bronze}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('profiles')}
                    className="w-full text-center py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold uppercase tracking-wider text-slate-200 transition-colors"
                  >
                    View Roster
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SPECTATOR & VISITOR CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-widest text-black bg-amber-400 px-3 py-1 rounded-full">
              Bring Your Family & Ducks
            </span>
            <h3 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-slate-950">
              Ready to Float with the Best?
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Whether you’re competing in the Open Division or cheering from the sunny grandstands with a cold drink, BADEENDLYMPICS 2026 is an unforgettable aquatic spectacle.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => {
                onNavigate('signup');
                playDuckQuack(1.1);
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-black text-white hover:bg-slate-800 font-bold uppercase tracking-widest text-xs active:scale-95 shadow-xl shadow-black/10 transition-all"
            >
              Register Team Now
            </button>
            <button
              onClick={() => onNavigate('info')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border-2 border-slate-200 text-slate-900 hover:border-slate-400 font-bold uppercase tracking-widest text-xs transition-all"
            >
              Venue & Parking
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
