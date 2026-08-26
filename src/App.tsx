import React, { useState, useEffect } from 'react';
import { PageRoute, SpelId } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { InfoPage } from './pages/InfoPage';
import { SchedulePage } from './pages/SchedulePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ParticipantsPage } from './pages/ParticipantsPage';
import { SignUpPage } from './pages/SignUpPage';
import { LoginPage } from './pages/LoginPage';
import { TeamPortalPage } from './pages/TeamPortalPage';
import { AdminPage } from './pages/AdminPage';
import { SportDetailPage } from './pages/SportDetailPage';
import { initFirestoreSync } from './utils/storage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [loginInitialTab, setLoginInitialTab] = useState<'team' | 'organisatie'>('team');

  useEffect(() => {
    const cleanup = initFirestoreSync();
    return cleanup;
  }, []);

  const handleNavigate = (route: PageRoute) => {
    if (route === 'scorebeheer') {
      // If user is trying to access scorebeheer directly from non-admin, LoginPage handles or AdminPage checks
    }
    setCurrentPage(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateWithTab = (route: PageRoute, tab: 'team' | 'organisatie') => {
    setLoginInitialTab(tab);
    handleNavigate(route);
  };

  const getSpelIdFromRoute = (route: PageRoute): SpelId => {
    if (route === 'spel-geheim-01') return 'geheim-01';
    if (route === 'spel-geheim-02') return 'geheim-02';
    if (route === 'spel-geheim-03') return 'geheim-03';
    if (route === 'spel-geheim-04') return 'geheim-04';
    if (route === 'spel-geheim-05') return 'geheim-05';
    return 'geheim-01';
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans selection:bg-amber-400 selection:text-black">
      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onNavigateLoginWithTab={handleNavigateWithTab}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}

        {currentPage === 'info' && <InfoPage onNavigate={handleNavigate} />}

        {currentPage === 'schema' && <SchedulePage onNavigate={handleNavigate} />}

        {currentPage === 'scores' && <LeaderboardPage onNavigate={handleNavigate} />}

        {currentPage === 'deelnemers' && <ParticipantsPage onNavigate={handleNavigate} />}

        {currentPage === 'inschrijven' && <SignUpPage onNavigate={handleNavigate} />}

        {currentPage === 'login' && (
          <LoginPage onNavigate={handleNavigate} initialTab={loginInitialTab} />
        )}

        {currentPage === 'team-portal' && <TeamPortalPage onNavigate={handleNavigate} />}

        {currentPage === 'scorebeheer' && <AdminPage onNavigate={handleNavigate} />}

        {currentPage.startsWith('spel-') && (
          <SportDetailPage
            spelId={getSpelIdFromRoute(currentPage)}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
