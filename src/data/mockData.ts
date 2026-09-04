import { SpelInfo, Team, ScoreEntry, ScheduleItem } from '../types';

export const SPELEN: SpelInfo[] = [
  {
    id: 'geheim-01',
    number: '01',
    name: 'NOG GEHEIM #01',
    subtitle: 'Officiële onthulling: 21 september 2026 · 00:00 CEST',
    tagline: 'MYSTERY DISCIPLINE 01 • 21 SEPT 2026 · 00:00 CEST (UTC+2)',
    description:
      'De eerste officiële discipline van de BADEENDLYMPICS 2027. De spelbeschrijving, materialen en regels worden op 21 september 2026 om exact 00:00 CEST (UTC+2) officieel onthuld door de organisatie. Test ondertussen je reflexen in de interactieve mini-game teaser!',
    isSecret: true,
    revealDate: '21 september 2026 · 00:00 CEST (UTC+2)',
    revealIsoDate: '2026-09-21T00:00:00+02:00',
    rules: [],
    unlockedData: {
      name: 'BUILD & BEER',
      subtitle: 'Biertafel & banken opzetten en 4 bier leegdrinken',
      tagline: 'DISCIPLINE 01 • BADEENDLYMPICS 2027',
      description:
        'Het team bouwt in zo kort mogelijke tijd een biertafel met twee bierbanken op, neemt plaats aan tafel, en drinkt gezamenlijk de 4 bier. Snelheid én tactiek bepalen de eindtijd.',
      isSecret: false,
      goal: 'Het team bouwt in zo kort mogelijke tijd een biertafel met twee bierbanken op, neemt plaats aan tafel, en drinkt gezamenlijk de 4 bier. Snelheid én tactiek bepalen de eindtijd.',
      location: 'Grasveld',
      resultType: 'Tijd in seconden (zie Algemeen Reglement, regel 13)',
      materials: [
        '1 biertafel (ingeklapt bij start)',
        '2 bierbanken (ingeklapt bij start)',
        '4 flesjes bier (verstrekt door de organisatie, verhouding regulier/0.0 zoals vooraf door het team opgegeven)',
        'Stopwatch / tijdklok, bediend door de jury',
        '1 of meerdere maatbekers van 10 ml (voor nameting van restbier)',
      ],
      sections: [
        {
          title: 'Startopstelling',
          items: [
            '1. De biertafel ligt ingeklapt op de grond, met het tafelblad naar boven.',
            '2. De 2 bierbanken liggen ingeklapt bovenop de tafel, met het zitvlak naar beneden.',
            '3. De 4 flesjes bier staan rechtop, met de dop er nog op, op de tafel tussen de 2 bierbanken in.',
            '4. Het team staat gezamenlijk achter de startlijn. Deze startlijn ligt op 2 meter afstand van het materiaal.',
          ],
        },
        {
          title: 'Startprocedure',
          items: [
            '5. Op het startsignaal van de jury mag het team de startlijn overschrijden en beginnen.',
            '6. De klok start op het moment van het startsignaal.',
          ],
        },
        {
          title: 'Uitvoering',
          items: [
            '7. Het team bouwt de biertafel en beide bierbanken volledig op.',
            '8. Het team opent de flesjes met de bieropener (zie Algemeen Reglement).',
            '9. Het team drinkt de flesjes leeg. Het team bepaalt zelf wie van het team drinkt en op welk moment tijdens het spel dit gebeurt (bijvoorbeeld deels tijdens het opbouwen, deels erna).',
          ],
        },
        {
          title: 'Stopmoment van de klok',
          items: [
            '10. De tijd stopt op het moment dat alle onderstaande voorwaarden gelijktijdig vervuld zijn:',
            '• elk teamlid zit op een correct opgestelde bierbank, én',
            '• elk teamlid raakt op datzelfde moment de (correct opgestelde) biertafel aan, én',
            '• alle 4 bierflesjes staan leeg rechtop op de biertafel.',
            '11. Zodra de jury vaststelt dat aan alle voorwaarden gelijktijdig is voldaan, wordt de klok stopgezet.',
          ],
        },
        {
          title: 'Nacontrole door de jury',
          items: [
            '12. Na het spel controleert de jury of de biertafel en beide bierbanken correct zijn opgesteld. Is dit niet het geval, dan was niet geldig aan het stopmoment (regel 10) voldaan en wordt de tijd hierop door de jury gecorrigeerd.',
            '13. De jury voert de "leeg"-controle uit zoals beschreven in het Algemeen Reglement (maatbeker van 10 ml). Voor dit spelonderdeel geldt: voor elke volle maatbeker (elke volle 10 ml aan restvloeistof, opgeteld over alle 4 flesjes) wordt 5 seconden straftijd bij de eindtijd van het team opgeteld.',
          ],
        },
      ],
      scoringDetails:
        'De einduitslag voor dit onderdeel is de gemeten speeltijd (zie regel 10-12), vermeerderd met eventuele straftijd voor gemorst bier (Algemeen Reglement) en/of restvloeistof in de flesjes (regel 13: 5 seconden straftijd per volle 10 ml maatbeker).',
      rules: [
        'Biertafel en twee bierbanken volledig en stabiel opbouwen.',
        'Gezamenlijk de 4 flesjes bier (of 0.0) leegdrinken met 1 bieropener.',
        'Klok stopt als iedereen op de bank zit, iedereen de tafel aanraakt én alle 4 lege flesjes rechtop op tafel staan.',
        'Nacontrole: 5 seconden straftijd per volle 10 ml restvloeistof over de 4 flesjes.',
      ],
    },
  },
  {
    id: 'geheim-02',
    number: '02',
    name: 'NOG GEHEIM #02',
    subtitle: 'Discipline wordt de komende tijd bekendgemaakt',
    tagline: 'MYSTERY DISCIPLINE 2',
    description:
      'Het tweede mysterieuze spel van de BADEENDLYMPICS 2027. De discipline wordt de komende tijd bekendgemaakt. Teams van 4 strijden samen voor de punten.',
    isSecret: true,
    rules: [],
  },
  {
    id: 'geheim-03',
    number: '03',
    name: 'NOG GEHEIM #03',
    subtitle: 'Discipline wordt de komende tijd bekendgemaakt',
    tagline: 'MYSTERY DISCIPLINE 3',
    description:
      'De derde discipline van het toernooi. De details worden de komende tijd officieel bekendgemaakt door de organisatie.',
    isSecret: true,
    rules: [],
  },
  {
    id: 'geheim-04',
    number: '04',
    name: 'NOG GEHEIM #04',
    subtitle: 'Discipline wordt de komende tijd bekendgemaakt',
    tagline: 'MYSTERY DISCIPLINE 4',
    description:
      'De vierde discipline van de BADEENDLYMPICS 2027. Wordt de komende tijd bekendgemaakt door Scouting Van Brederode.',
    isSecret: true,
    rules: [],
  },
  {
    id: 'geheim-05',
    number: '05',
    name: 'NOG GEHEIM #05',
    subtitle: 'Discipline wordt de komende tijd bekendgemaakt',
    tagline: 'MYSTERY DISCIPLINE 5',
    description:
      'De vijfde en laatste discipline van de dag. De precieze inhoud wordt de komende tijd bekendgemaakt.',
    isSecret: true,
    rules: [],
  },
];

// VEILIGHEID: Logingegevens van de organisatie worden uitsluitend server-side
// verwerkt via beveiligde /api/auth/admin endpoints met rate limiting en versleutelde tokens.
// Er worden GEEN wachtwoorden of gevoelige beheerdersgegevens in client bundles opgeslagen.

export const INITIAL_TEAMS: Team[] = [];

export const INITIAL_SCORES: ScoreEntry[] = [];

export const SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    time: '13:00 - 13:30',
    title: 'Inloop & Teamregistratie',
    description: 'Aanmelden van alle teams bij de wedstrijdbalie, controle van de teamleden (18+) en bewondering van de teamkleding.',
    location: 'Ingang scoutingterrein Batenstein, Scouting Van Brederode',
  },
  {
    time: '13:30 - 14:00',
    title: 'Officiële Openingsceremonie',
    description: 'Ontsteking van het Badeendlympisch vuur en officiële opening van de BADEENDLYMPICS 2027.',
    location: 'scoutingterrein Batenstein, Scouting Van Brederode',
    highlight: true,
  },
  {
    time: '14:00 - 14:45',
    title: 'SPEL 01: Discipline 01 (Nog geheim)',
    description: 'De eerste officiële discipline van het toernooi (officiële onthulling op 21 september 2026 · 00:00 CEST).',
    location: 'Grasveld scoutingterrein Batenstein',
    highlight: true,
  },
  {
    time: '14:45 - 15:00',
    title: 'Korte Pauze',
    description: 'Korte hydration break en voorbereiding op het tweede spel.',
    location: 'Bar & Buiten',
  },
  {
    time: '15:00 - 15:45',
    title: 'SPEL 02: Discipline 02',
    description: 'De tweede discipline van de BADEENDLYMPICS 2027 (wordt de komende tijd bekendgemaakt).',
    location: 'Locatie wordt later bekendgemaakt',
    highlight: true,
  },
  {
    time: '15:45 - 16:30',
    title: 'SPEL 03: Discipline 03',
    description: 'De derde discipline van het toernooi (wordt de komende tijd bekendgemaakt).',
    location: 'Locatie wordt later bekendgemaakt',
    highlight: true,
  },
  {
    time: '16:30 - 17:15',
    title: 'SPEL 04: Discipline 04',
    description: 'De vierde discipline van het toernooi (wordt de komende tijd bekendgemaakt).',
    location: 'Locatie wordt later bekendgemaakt',
    highlight: true,
  },
  {
    time: '17:15 - 18:00',
    title: 'SPEL 05: Discipline 05',
    description: 'De vijfde en beslissende discipline van de dag (wordt de komende tijd bekendgemaakt).',
    location: 'Locatie wordt later bekendgemaakt',
    highlight: true,
  },
  {
    time: '18:00 - 18:30',
    title: 'Puntentelling & Prijsuitreiking',
    description: 'Kroning van de BADEENDLYMPICS Kampioenen 2027 en uitreiking van een welverdiende goudgele rakkers!',
    location: 'Scoutingterrein Batenstein, Scouting van Brederode',
    highlight: true,
  },
  {
    time: '18:30 - later',
    title: 'Afsluitende borrel',
    description: 'Gezelligheid, muziek en napraten over de legendarische BADEENDLYMPICS.',
    location: 'Bar & Buiten',
  },
];
