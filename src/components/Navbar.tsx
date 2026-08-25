import React, { useState } from 'react';
import { PageRoute } from '../types';
import { BADEEND_LOGO_SRC } from '../assets/logo';
import { Menu, X, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: PageRoute }[] = [
    { label: 'HOME', page: 'home' },
    { label: 'INFO', page: 'info' },
    { label: 'SCHEMA', page: 'schema' },
    { label: 'SCORES', page: 'scores' },
    { label: 'DEELNEMERS', page: 'deelnemers' },
  ];

  const isCurrent = (page: PageRoute) => {
    if (page === 'scores' && currentPage === 'scorebeheer') return true;
    if (page === 'home' && currentPage.startsWith('spel-')) return false;
    return currentPage === page;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 sm:gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-white border-2 border-black flex items-center justify-center p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all overflow-hidden">
              <img
                src={BADEEND_LOGO_SRC}
                alt="Badeendlympics Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-display font-black text-xl sm:text-2xl tracking-tighter text-black uppercase">
              BADEEND<span className="text-black">LYMPICS</span>{' '}
              <span className="text-amber-500 font-display font-black">2027</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((item) => {
              const active = isCurrent(item.page);
              return (
                <button
                  key={item.page}
                  onClick={() => onNavigate(item.page)}
                  className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    active
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Inschrijven Yellow Button */}
            <button
              onClick={() => onNavigate('inschrijven')}
              className={`ml-2 px-4 py-2 border-2 border-black text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none ${
                currentPage === 'inschrijven'
                  ? 'bg-black text-amber-400 border-black'
                  : 'bg-amber-400 text-black hover:bg-amber-300'
              }`}
            >
              INSCHRIJVEN
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => onNavigate('inschrijven')}
              className="px-2.5 py-1 bg-amber-400 border-2 border-black text-[11px] font-black uppercase tracking-wider"
            >
              INSCHRIJVEN
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border-2 border-black text-black bg-slate-50 hover:bg-slate-100"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t-2 border-black bg-white px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((item) => (
            <button
              key={item.page}
              onClick={() => {
                onNavigate(item.page);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-black uppercase tracking-wider ${
                isCurrent(item.page) ? 'bg-black text-white' : 'text-black hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate('inschrijven');
              setMobileMenuOpen(false);
            }}
            className="w-full text-center px-4 py-2.5 bg-amber-400 border-2 border-black text-black font-black uppercase tracking-wider"
          >
            MELD JE TEAM AAN
          </button>
          <button
            onClick={() => {
              onNavigate('scorebeheer');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-xs font-bold uppercase text-slate-500 hover:text-black flex items-center gap-1.5 pt-2 border-t border-slate-200"
          >
            <ShieldAlert size={14} /> Organisatie / Scorebeheer
          </button>
        </div>
      )}
    </header>
  );
};
