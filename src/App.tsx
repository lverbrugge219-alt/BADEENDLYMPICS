import React, { useState } from 'react';
import { PageRoute, SpelId } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { InfoPage } from './pages/InfoPage';
import { SchedulePage } from './pages/SchedulePage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ParticipantsPage } from './pages/ParticipantsPage';
import { SignUpPage } from './pages/SignUpPage';
import { AdminPage } from './pages/AdminPage';
import { SportDetailPage } from './pages/SportDetailPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');

  const handleNavigate = (route: PageRoute) => {
    setCurrentPage(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getSpelIdFromRoute = (route: PageRoute): SpelId => {
    if (route === 'spel-biertafel-opzetten') return 'biertafel-opzetten';
    if (route === 'spel-dienblad-parcours') return 'dienblad-parcours';
    if (route === 'spel-kratbier-hindernisbaan') return 'kratbier-hindernisbaan';
    if (route === 'spel-geheim-01') return 'geheim-01';
    if (route === 'spel-geheim-02') return 'geheim-02';
    return 'kratbier-hindernisbaan';
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-sans selection:bg-amber-400 selection:text-black">
      {/* Navigation Header */}
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Main Content View */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}

        {currentPage === 'info' && <InfoPage onNavigate={handleNavigate} />}

        {currentPage === 'schema' && <SchedulePage onNavigate={handleNavigate} />}

        {currentPage === 'scores' && <LeaderboardPage onNavigate={handleNavigate} />}

        {currentPage === 'deelnemers' && <ParticipantsPage onNavigate={handleNavigate} />}

        {currentPage === 'inschrijven' && <SignUpPage onNavigate={handleNavigate} />}

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
