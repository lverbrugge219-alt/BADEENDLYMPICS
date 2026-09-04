import React, { useState, useEffect } from 'react';
import { PageRoute, SpelId } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
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
import { PrivacyPage } from './pages/PrivacyPage';
import { JuryPage } from './pages/JuryPage';
import { JuryPortalPage } from './pages/JuryPortalPage';
import { initFirestoreSync } from './utils/storage';
import { trackPageView } from './utils/analytics';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [loginInitialTab, setLoginInitialTab] = useState<'team' | 'jury' | 'organisatie'>('team');

  useEffect(() => {
    const cleanup = initFirestoreSync();
    return cleanup;
  }, []);

  useEffect(() => {
    // Automatically track pageviews via cookies and store metrics
    trackPageView(currentPage);
  }, [currentPage]);

  const handleNavigate = (route: PageRoute) => {
    setCurrentPage(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateWithTab = (route: PageRoute, tab: 'team' | 'jury' | 'organisatie') => {
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

        {currentPage === 'jury' && (
          <JuryPage onNavigate={handleNavigate} openSignUpInitially={false} />
        )}

        {currentPage === 'jury-aanmelden' && (
          <JuryPage onNavigate={handleNavigate} openSignUpInitially={true} />
        )}

        {currentPage === 'jury-portal' && <JuryPortalPage onNavigate={handleNavigate} />}

        {currentPage === 'deelnemers' && <ParticipantsPage onNavigate={handleNavigate} />}

        {currentPage === 'inschrijven' && <SignUpPage onNavigate={handleNavigate} />}

        {currentPage === 'login' && (
          <LoginPage onNavigate={handleNavigate} initialTab={loginInitialTab} />
        )}

        {currentPage === 'team-portal' && <TeamPortalPage onNavigate={handleNavigate} />}

        {currentPage === 'scorebeheer' && <AdminPage onNavigate={handleNavigate} />}

        {currentPage === 'privacy' && <PrivacyPage onNavigate={handleNavigate} />}

        {currentPage.startsWith('spel-') && (
          <SportDetailPage
            spelId={getSpelIdFromRoute(currentPage)}
            onNavigate={handleNavigate}
            onNavigateLoginWithTab={handleNavigateWithTab}
          />
        )}
      </main>

      {/* Cookie Consent Banner */}
      <CookieBanner onNavigate={handleNavigate} />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
