import React, { useState } from 'react';
import { PageRoute } from '../types';
import { MapPin, Calendar, Users, Trophy, ChevronDown, ChevronUp, Beer, Shield, Mail, Scale } from 'lucide-react';

interface InfoPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const InfoPage: React.FC<InfoPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Wie kan er meedoen aan de BADEENDLYMPICS?',
      a: 'Iedereen vanaf 18 jaar met een gezonde dosis humor, teamspirit en een lichte fascinatie voor gele badeenden en gezelligheid. Teams bestaan uit exact 4 personen. Ieder teamlid moet 18+ zijn voor deelname.',
    },
    {
      q: 'Kan ik me aanmelden als vrijwillige Jury?',
      a: 'Jazeker! Vrijwillige juryleden zijn van harte welkom om mee te jureren. Je kunt je aanmelden door een e-mail te sturen naar Lotte@scoutingpapendrecht.nl.',
    },
    {
      q: 'Moeten we ons eigen bier of badeend meenemen?',
      a: 'Nee! De organisatie en Scouting Van Brederode verzorgen alle officiële wedstrijdbadeenden en benodigdheden voor de spellen. De bar in het clubgebouw is geopend voor een lekker drankje.',
    },
    {
      q: 'Wat kosten de inschrijvingen?',
      a: 'Inschrijven is 100% gratis t/m 1 maart 2027. Er is geen maximum aantal teams, dus meld je gerust aan met al je vrienden, familie of collega’s!',
    },
    {
      q: 'Wat winnen we als we eerste worden?',
      a: 'Eeuwige roem in Papendrecht en omstreken, de officiële BADEENDLYMPICS 2027 titel en een welverdiende goudgele rakker voor het winnende team!',
    },
    {
      q: 'Zijn toeschouwers welkom?',
      a: 'Zeker! Toegang voor supporters en toeschouwers is gratis. Er is volop muziek, sfeer en spektakel op het terrein.',
    },
  ];

  return (
    <div className="bg-white text-black min-h-screen">
      {/* Header */}
      <section className="bg-black text-white border-b-2 border-black py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <span className="text-sky-400 font-display font-black text-xs sm:text-sm tracking-widest uppercase block mb-2">
            PRAKTISCHE INFORMATIE
          </span>
          <h1 className="font-display font-black text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-amber-400 tracking-tight uppercase leading-none mb-4">
            ALLES WAT JE <span className="text-stroke-white">MOET WETEN</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium max-w-xl">
            Reglementen, tijden, locatie en de gouden erecode van de BADEENDLYMPICS 2027 in Papendrecht.
          </p>
        </div>
      </section>

      {/* Main Info Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Card 1: Datum */}
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-amber-400 border-2 border-black flex items-center justify-center mb-4">
                <Calendar size={20} className="text-black" />
              </div>
              <span className="text-sky-500 font-display font-black text-xs uppercase tracking-widest block mb-1">
                DATUM & TIJD
              </span>
              <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black mb-2">
                3 APRIL 2027
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Inloop vanaf 13:00 uur. Start spelen om 14:00 uur. Finale en feest tot in de late uurtjes.
              </p>
            </div>
          </div>

          {/* Card 2: Locatie */}
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-amber-400 border-2 border-black flex items-center justify-center mb-4">
                <MapPin size={20} className="text-black" />
              </div>
              <span className="text-sky-500 font-display font-black text-xs uppercase tracking-widest block mb-1">
                LOCATIE
              </span>
              <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black mb-2">
                SCOUTING PAPENDRECHT
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Scouting Van Brederode terrein, Papendrecht. Goed bereikbaar per fiets en OV.
              </p>
            </div>
          </div>

          {/* Card 3: Teams */}
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-amber-400 border-2 border-black flex items-center justify-center mb-4">
                <Users size={20} className="text-black" />
              </div>
              <span className="text-sky-500 font-display font-black text-xs uppercase tracking-widest block mb-1">
                TEAMS
              </span>
              <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black mb-2">
                EXACT 4 LEDEN (18+)
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Ieder teamlid moet 18+ zijn voor deelname. Elk team bestaat uit exact 4 strijders. Matchende teamkleding en badeend-outfits worden van harte aangemoedigd!
              </p>
            </div>
          </div>

          {/* Card 4: Hoofdprijs */}
          <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 bg-amber-400 border-2 border-black flex items-center justify-center mb-4">
                <Trophy size={20} className="text-black" />
              </div>
              <span className="text-sky-500 font-display font-black text-xs uppercase tracking-widest block mb-1">
                DE HOOFDPRIJS
              </span>
              <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black mb-2">
                GOUDGELE RAKKER
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Eeuwige lokale roem, de officiële BADEENDLYMPICS titel en een welverdiende goudgele rakker voor het winnende team.
              </p>
            </div>
          </div>
        </div>

        {/* Erecode & Reglement */}
        <div className="bg-slate-50 border-2 border-black p-8 sm:p-12 mb-16 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={24} className="text-amber-500" />
            <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black">
              DE OFFICIËLE BADEEND ERECODE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm font-semibold text-slate-800">
            <div className="border-2 border-black bg-white p-5">
              <span className="font-display font-black text-amber-500 text-lg block mb-1">01. FAIR PLAY</span>
              Geen stiekeme hulpmiddelen, geen lithium-aandrijving in de badeend en geen discussie met de jury.
            </div>
            <div className="border-2 border-black bg-white p-5">
              <span className="font-display font-black text-amber-500 text-lg block mb-1">02. TEAMKLEDING AANGEMOEDIGD</span>
              Trek je meest epische matchende outfits, geelste teamshirts of badeend-kostuums aan. Teamkleding wordt maximaal toegejuicht!
            </div>
            <div className="border-2 border-black bg-white p-5">
              <span className="font-display font-black text-amber-500 text-lg block mb-1">03. 5 DISCIPLINES</span>
              De disciplines worden de komende tijd bekendgemaakt. Alle teamleden schikken zich sportief naar de beslissingen van de jury!
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <h2 className="font-display font-black text-4xl uppercase tracking-tight text-black mb-8 text-center">
            VEELGESTELDE VRAGEN
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border-2 border-black bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 font-display font-black text-base sm:text-lg uppercase tracking-tight flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {openFaq === idx && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm font-medium text-slate-700 leading-relaxed border-t border-slate-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Vrijwillige Jury Banner */}
          <div className="mt-12 bg-amber-400 border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-black text-amber-400 border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Scale size={24} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-black/70 block mb-0.5">
                  COMMISSIE & JURY
                </span>
                <h3 className="font-display font-black text-2xl uppercase tracking-tight text-black">
                  AANMELDEN ALS VRIJWILLIGE JURY
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-black/80 mt-1 max-w-md">
                  Wil je als jurylid toezien op een eerlijk verloop van de spelen? Stuur een e-mail naar <strong className="text-black underline">Lotte@scoutingpapendrecht.nl</strong>.
                </p>
              </div>
            </div>
            <a
              href="mailto:Lotte@scoutingpapendrecht.nl?subject=Aanmelding%20Vrijwillige%20Jury%20Badeendlympics%202027"
              className="px-6 py-3.5 bg-black text-white border-2 border-black font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 hover:bg-slate-900 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0"
            >
              <Mail size={16} className="text-amber-400" />
              E-MAIL LOTTE →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
