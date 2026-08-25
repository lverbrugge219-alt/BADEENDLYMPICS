import React, { useState } from 'react';
import {
  Calendar,
  ChevronDown,
  Info,
  Menu,
  Sparkles,
  Trophy,
  Users,
  Volume2,
  VolumeX,
  X,
  Zap
} from 'lucide-react';
import { RubberDuckGraphic } from './RubberDuckGraphic';
import { PageRoute, SportId } from '../types';
import { getSoundMuted, playDuckQuack, setSoundMuted } from '../utils/audio';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (route: PageRoute) => void;
  registeredTeamsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  registeredTeamsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sportsDropdownOpen, setSportsDropdownOpen] = useState(false);
  const [muted, setMuted] = useState(getSoundMuted());

  const toggleSound = () => {
    const next = !muted;
    setSoundMuted(next);
    setMuted(next);
    if (!next) {
      playDuckQuack(1.2);
    }
  };

  const sportsList: { id: SportId; route: PageRoute; name: string; icon: string; short: string }[] = [
    { id: 'rapids-sprint', route: 'sport-rapids-sprint', name: 'Duck Rapids Sprint 50m', icon: '⚡', short: 'Rapids Sprint' },
    { id: 'quack-diving', route: 'sport-quack-diving', name: 'Artistic Quack Diving', icon: '🌊', short: 'Quack Diving' },
    { id: 'hydro-tug', route: 'sport-hydro-tug', name: 'Giant Hydro Tug-of-War', icon: '⚓', short: 'Hydro Tug' },
    { id: 'pond-water-polo', route: 'sport-pond-water-polo', name: 'High-Velocity Pond Polo', icon: '🛡️', short: 'Pond Water Polo' },
    { id: 'whirlpool-slalom', route: 'sport-whirlpool-slalom', name: 'Whirlpool Obstacle Slalom', icon: '🌀', short: 'Whirlpool Slalom' }
  ];

  const isCurrentSport = currentPage.startsWith('sport-');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-amber-200/60 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top micro-announcement banner */}
      <div className="bg-slate-950 text-white text-[11px] font-bold uppercase tracking-wider py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-amber-400 text-black px-2 py-0.5 rounded-full font-black text-[10px] uppercase tracking-widest">
              OFFICIAL 2026
            </span>
            <span className="text-amber-300 font-bold hidden sm:inline tracking-wide">
              Koninklijke Internationale Rubber Duck Games
            </span>
            <span className="text-slate-400 hidden md:inline">• Utrecht Aquatic Arena • Aug 28–30</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onNavigate('signup');
                playDuckQuack(1.1);
              }}
              className="text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Register Open Flotilla ({registeredTeamsCount} Signed Up)</span>
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={toggleSound}
              className="text-slate-300 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded-lg hover:bg-slate-900 transition-colors"
              title={muted ? 'Unmute Duck Sounds' : 'Mute Duck Sounds'}
            >
              {muted ? <VolumeX className="h-3.5 w-3.5 text-rose-400" /> : <Volume2 className="h-3.5 w-3.5 text-amber-400" />}
              <span className="hidden sm:inline">{muted ? 'Muted' : 'Sound On'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            id="nav-brand-logo"
            onClick={() => {
              onNavigate('home');
              playDuckQuack(1.0);
            }}
            className="flex items-center gap-3.5 text-left group focus:outline-none"
          >
            <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform border border-amber-500/30">
              <RubberDuckGraphic size={32} color="#000000" accessory="crown" showWaterRipple={false} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tighter uppercase italic text-slate-950">
                  BADEENDLY<span className="text-amber-500">MPICS</span>
                </span>
                <span className="hidden xl:inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-black text-amber-400 rounded-md">
                  2026
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase -mt-0.5">
                World Championship of Rubber Ducks
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-slate-500">
            <button
              id="nav-link-home"
              onClick={() => onNavigate('home')}
              className={`transition-all pb-1 ${
                currentPage === 'home'
                  ? 'text-black border-b-2 border-amber-400 font-black'
                  : 'hover:text-black hover:border-b-2 hover:border-slate-300'
              }`}
            >
              Frontpage
            </button>

            <button
              id="nav-link-info"
              onClick={() => onNavigate('info')}
              className={`transition-all pb-1 flex items-center gap-1.5 ${
                currentPage === 'info'
                  ? 'text-black border-b-2 border-amber-400 font-black'
                  : 'hover:text-black hover:border-b-2 hover:border-slate-300'
              }`}
            >
              <Info className="h-3.5 w-3.5 text-amber-500" />
              <span>Info & Rules</span>
            </button>

            {/* Sports Dropdown */}
            <div className="relative">
              <button
                id="nav-link-sports-menu"
                onClick={() => setSportsDropdownOpen(!sportsDropdownOpen)}
                className={`transition-all pb-1 flex items-center gap-1.5 ${
                  isCurrentSport
                    ? 'text-black border-b-2 border-amber-400 font-black'
                    : 'hover:text-black hover:border-b-2 hover:border-slate-300'
                }`}
              >
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>5 Sports</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${sportsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {sportsDropdownOpen && (
                <div
                  className="absolute left-0 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setSportsDropdownOpen(false)}
                >
                  <div className="px-3 py-2 text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 mb-1">
                    Official 5 Disciplines
                  </div>
                  {sportsList.map((sport) => (
                    <button
                      key={sport.id}
                      id={`nav-sport-${sport.id}`}
                      onClick={() => {
                        onNavigate(sport.route);
                        setSportsDropdownOpen(false);
                        playDuckQuack(1.05);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-bold uppercase tracking-wider transition-all ${
                        currentPage === sport.route
                          ? 'bg-amber-400 text-black font-black'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-black'
                      }`}
                    >
                      <span className="text-base">{sport.icon}</span>
                      <div className="flex-1 truncate">{sport.name}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              id="nav-link-schedule"
              onClick={() => onNavigate('schedule')}
              className={`transition-all pb-1 flex items-center gap-1.5 ${
                currentPage === 'schedule'
                  ? 'text-black border-b-2 border-amber-400 font-black'
                  : 'hover:text-black hover:border-b-2 hover:border-slate-300'
              }`}
            >
              <Calendar className="h-3.5 w-3.5 text-sky-500" />
              <span>Schedule</span>
            </button>

            <button
              id="nav-link-leaderboard"
              onClick={() => onNavigate('leaderboard')}
              className={`transition-all pb-1 flex items-center gap-1.5 ${
                currentPage === 'leaderboard'
                  ? 'text-black border-b-2 border-amber-400 font-black'
                  : 'hover:text-black hover:border-b-2 hover:border-slate-300'
              }`}
            >
              <Trophy className="h-3.5 w-3.5 text-amber-500" />
              <span>Leaderboard</span>
            </button>

            <button
              id="nav-link-profiles"
              onClick={() => onNavigate('profiles')}
              className={`transition-all pb-1 flex items-center gap-1.5 ${
                currentPage === 'profiles'
                  ? 'text-black border-b-2 border-amber-400 font-black'
                  : 'hover:text-black hover:border-b-2 hover:border-slate-300'
              }`}
            >
              <Users className="h-3.5 w-3.5 text-slate-500" />
              <span>Profiles</span>
            </button>
          </nav>

          {/* CTA & Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              id="nav-btn-signup"
              onClick={() => {
                onNavigate('signup');
                playDuckQuack(1.1);
              }}
              className="bg-black text-white hover:bg-slate-800 px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-black/10 active:scale-95 transition-all flex items-center gap-2"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Sign Up Team</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-signup-cta"
              onClick={() => {
                onNavigate('signup');
                playDuckQuack(1.1);
              }}
              className="bg-black text-white font-bold uppercase tracking-widest text-[11px] px-3.5 py-2 rounded-xl"
            >
              Sign Up
            </button>
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-900 hover:bg-slate-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-200/80 bg-white/98 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm ${
                currentPage === 'home' ? 'bg-amber-100 text-slate-950 font-black' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              🏠 Frontpage
            </button>

            <button
              onClick={() => {
                onNavigate('info');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm ${
                currentPage === 'info' ? 'bg-amber-100 text-slate-950 font-black' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              ℹ️ Info, Rules & Venue
            </button>

            {/* 5 Sports Expandable */}
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/40 p-2 my-1">
              <div className="px-2 py-1 text-xs font-black uppercase text-amber-900">
                5 Dedicated Sports
              </div>
              <div className="grid grid-cols-1 gap-1 mt-1">
                {sportsList.map((sport) => (
                  <button
                    key={sport.id}
                    onClick={() => {
                      onNavigate(sport.route);
                      setMobileMenuOpen(false);
                      playDuckQuack(1.05);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 ${
                      currentPage === sport.route ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-700 hover:bg-white'
                    }`}
                  >
                    <span>{sport.icon}</span>
                    <span>{sport.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onNavigate('schedule');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm ${
                currentPage === 'schedule' ? 'bg-amber-100 text-slate-950 font-black' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              📅 Event Schedule
            </button>

            <button
              onClick={() => {
                onNavigate('leaderboard');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm ${
                currentPage === 'leaderboard' ? 'bg-amber-100 text-slate-950 font-black' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              🏆 Leaderboard & Scores
            </button>

            <button
              onClick={() => {
                onNavigate('profiles');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-sm ${
                currentPage === 'profiles' ? 'bg-amber-100 text-slate-950 font-black' : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              🦆 Ducklete & Team Profiles
            </button>

            <button
              onClick={() => {
                onNavigate('signup');
                setMobileMenuOpen(false);
                playDuckQuack(1.1);
              }}
              className="w-full text-center mt-2 px-4 py-3 rounded-xl bg-amber-400 font-black text-slate-950 uppercase tracking-wider text-xs shadow-md"
            >
              ✨ Sign Up a Team ({registeredTeamsCount} Registered)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
