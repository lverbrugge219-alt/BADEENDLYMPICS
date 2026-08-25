import React, { useState } from 'react';
import { PageRoute } from '../types';
import { MapPin, Calendar, Users, Trophy, ChevronDown, ChevronUp, Beer, Shield } from 'lucide-react';

interface InfoPageProps {
  onNavigate: (page: PageRoute) => void;
}

export const InfoPage: React.FC<InfoPageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Wie kan er meedoen aan de BADEENDLYMPICS?',
      a: 'Iedereen vanaf 18 jaar met een gezonde dosis humor, teamspirit en een lichte fascinatie voor gele badeenden en bier. Teams bestaan uit exact 4 personen.',
    },
    {
      q: 'Moeten we ons eigen bier of badeend meenemen?',
      a: 'Nee! De organisatie en Scouting Van Brederode verzorgen alle officiële wedstrijdbadeenden, biertafels, volle kratten en parcoursbenodigdheden. Er is tevens een ruime bar voor toeschouwers en dorstige atleten.',
    },
    {
      q: 'Wat kosten de inschrijvingen?',
      a: 'Inschrijven is 100% gratis t/m 1 maart 2027. Wees er wel op tijd bij want er is een maximum aantal startplekken beschikbaar.',
    },
    {
      q: 'Wat winnen we als we eerste worden?',
      a: 'De felbegeerde Gouden Badeend Wisseltrofee, eeuwige roem in Papendrecht en omstreken, en een koud fust voor het hele team.',
    },
    {
      q: 'Zijn toeschouwers welkom?',
      a: 'Zeker! Toegang voor supporters en toeschouwers is gratis. Er zijn tribunes, muziek, een buitenbar en volop spektakel.',
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
                EXACT 4 LEDEN
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Minimaal 18 jaar. Elk team bestaat uit exact 4 strijders met één aangewezen aanvoerder. Teamkleding of badeend-thema sterk aangemoedigd!
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
                DE GOUDEN BADEEND
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                De felbegeerde wisseltrofee, eeuwige lokale roem en een teamfeestpakket.
              </p>
            </div>
          </div>
        </div>

        {/* Erecode & Reglement */}
        <div className="bg-slate-50 border-2 border-black p-8 sm:p-12 mb-16 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={24} className="text-amber-500" />
            <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-black">
              DE KONINKLIJKE BADEEND ERECODE
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm font-semibold text-slate-800">
            <div className="border-2 border-black bg-white p-5">
              <span className="font-display font-black text-amber-500 text-lg block mb-1">01. FAIR PLAY</span>
              Geen stiekeme hulpmiddelen, geen lithium-aandrijving in de badeend en geen discussie met de scheidsrechter.
            </div>
            <div className="border-2 border-black bg-white p-5">
              <span className="font-display font-black text-amber-500 text-lg block mb-1">02. DRUPPEL-TOLERANTIE</span>
              Gemorste vloeistof of verloren badeenden resulteren in onherroepelijke straftijd volgens de officiële wedstrijdleiding.
            </div>
            <div className="border-2 border-black bg-white p-5">
              <span className="font-display font-black text-amber-500 text-lg block mb-1">03. 5 GEHEIME SPELEN</span>
              Alle 5 de mystery disciplines worden pas live op 3 april onthuld. Alle teamleden schikken zich sportief naar het lot!
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
        </div>
      </div>
    </div>
  );
};
