import { SpelInfo, Team, ScoreEntry, ScheduleItem } from '../types';

export const SPELEN: SpelInfo[] = [
  {
    id: 'geheim-01',
    number: '01',
    name: 'NOG GEHEIM #01',
    subtitle: 'Discipline wordt de komende tijd bekendgemaakt',
    tagline: 'MYSTERY DISCIPLINE 1',
    description:
      'De eerste officiële discipline van de BADEENDLYMPICS 2027. De details van deze discipline worden de komende tijd bekendgemaakt. Zorg dat je team (18+) er klaar voor is en trek je beste teamkleding aan!',
    isSecret: true,
    rules: [
      'De discipline wordt de komende tijd bekendgemaakt.',
      'Ieder teamlid moet minimaal 18 jaar oud zijn voor deelname.',
      'Matchende teamkleding en badeend-outfits worden van harte aangemoedigd!',
      'Het besluit van de jury is te allen tijde onherroepelijk en bindend.',
    ],
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
    rules: [
      'De discipline wordt de komende tijd bekendgemaakt.',
      'Ieder teamlid moet minimaal 18 jaar oud zijn voor deelname.',
      'Creatieve en opvallende teamkleding wordt sterk toegejuicht.',
      'Eerlijk spel, sportiviteit en gezelligheid staan voorop onder toezicht van de jury.',
    ],
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
    rules: [
      'De discipline wordt de komende tijd bekendgemaakt.',
      'Ieder teamlid moet minimaal 18 jaar oud zijn voor deelname.',
      'Matchende teamoutfits en gele accessoires worden warm aanbevolen.',
      'Punten worden na afloop direct door de jury ingevoerd op het scorebord.',
    ],
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
    rules: [
      'De discipline wordt de komende tijd bekendgemaakt.',
      'Ieder teamlid moet minimaal 18 jaar oud zijn voor deelname.',
      'Teamkleding wordt van harte aangemoedigd voor extra teamspirit.',
      'De officiële jury beoordeelt de prestaties van alle teams.',
    ],
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
    rules: [
      'De discipline wordt de komende tijd bekendgemaakt.',
      'Ieder teamlid moet minimaal 18 jaar oud zijn voor deelname.',
      'Alle 5 de spellen tellen gelijkwaardig mee voor het algemeen klassement.',
      'De officiële jury houdt de score nauwkeurig bij.',
    ],
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
    title: 'SPEL 01: Discipline 01',
    description: 'De eerste officiële discipline van het toernooi (wordt de komende tijd bekendgemaakt).',
    location: 'Locatie wordt later bekendgemaakt',
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
