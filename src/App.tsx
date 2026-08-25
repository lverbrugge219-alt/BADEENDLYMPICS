/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { PageRoute, SportId, Team } from './types';
import { INITIAL_TEAMS, SCHEDULE_DATA, SPORTS_DATA, STAR_DUCKLETES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { InfoPage } from './pages/InfoPage';
import { SportsPage } from './pages/SportsPage';
import { SignUpPage } from './pages/SignUpPage';
import { SchedulePage } from './pages/SchedulePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilesPage } from './pages/ProfilesPage';
import { RubberDuckGraphic } from './components/RubberDuckGraphic';
import { playDuckQuack } from './utils/audio';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [teams, setTeams] = useState<Team[]>(() => {
    try {
      const saved = localStorage.getItem('badeendlympics_teams');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback to initial teams
    }
    return INITIAL_TEAMS;
  });

  const [activeSportId, setActiveSportId] = useState<SportId>('rapids-sprint');

  // Persist teams
  useEffect(() => {
    try {
      localStorage.setItem('badeendlympics_teams', JSON.stringify(teams));
    } catch {
      // Fallback
    }
  }, [teams]);

  const handleNavigate = (route: PageRoute) => {
    setCurrentPage(route);
    if (route.startsWith('sport-')) {
      const sportId = route.replace('sport-', '') as SportId;
      setActiveSportId(sportId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSport = (sportId: SportId) => {
    setActiveSportId(sportId);
    setCurrentPage(`sport-${sportId}` as PageRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddTeam = (newTeam: Team) => {
    setTeams((prev) => [newTeam, ...prev]);
  };

  // Determine current active sport if on a sport page
  const currentSportFromRoute: SportId = currentPage.startsWith('sport-')
    ? (currentPage.replace('sport-', '') as SportId)
    : activeSportId;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-900 font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        registeredTeamsCount={teams.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            sports={SPORTS_DATA}
            teams={teams}
            starDuckletes={STAR_DUCKLETES}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'info' && (
          <InfoPage onNavigate={handleNavigate} />
        )}

        {currentPage.startsWith('sport-') && (
          <SportsPage
            currentSportId={currentSportFromRoute}
            sports={SPORTS_DATA}
            teams={teams}
            schedule={SCHEDULE_DATA}
            onNavigate={handleNavigate}
            onSelectSport={handleSelectSport}
          />
        )}

        {currentPage === 'signup' && (
          <SignUpPage onAddTeam={handleAddTeam} onNavigate={handleNavigate} />
        )}

        {currentPage === 'schedule' && (
          <SchedulePage schedule={SCHEDULE_DATA} onNavigate={handleNavigate} />
        )}

        {currentPage === 'leaderboard' && (
          <LeaderboardPage teams={teams} onNavigate={handleNavigate} />
        )}

        {currentPage === 'profiles' && (
          <ProfilesPage
            teams={teams}
            duckletes={STAR_DUCKLETES}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Floating Quack Cheer Toy Button */}
      <aside
        aria-label="Floating cheer button"
        className="fixed bottom-6 right-6 z-40"
      >
        <button
          id="floating-quack-btn"
          onClick={() => playDuckQuack(1.0 + Math.random() * 0.4)}
          className="group relative flex items-center gap-2 p-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all border-2 border-slate-950"
          title="Click for a Lucky Quack!"
        >
          <RubberDuckGraphic size={32} color="#F59E0B" accessory="crown" animated />
          <span className="hidden group-hover:inline-block pr-2 text-xs font-black uppercase tracking-wider">
            QUACK!
          </span>
        </button>
      </aside>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
