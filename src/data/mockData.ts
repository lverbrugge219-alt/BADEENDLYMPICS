import { SpelInfo, Team, ScoreEntry, ScheduleItem } from '../types';

export const SPELEN: SpelInfo[] = [
  {
    id: 'geheim-01',
    number: '01',
    name: 'NOG GEHEIM #01',
    subtitle: 'Onthulling op zaterdag 3 april 2027',
    tagline: 'MYSTERY DISCIPLINE 1',
    description:
      'De organisatie van Scouting Van Brederode houdt de details van de eerste discipline strikt geheim. Zorg dat je team voorbereid is op snelheid, behendigheid en onverwachte obstakels!',
    isSecret: true,
    rules: [
      'Details worden 15 minuten voor aanvang ter plekke bekendgemaakt.',
      'Ieder teamlid moet paraat staan met stevig schoeisel.',
      'Badeend-attributen kunnen onverwacht ingezet worden.',
      'Jurybesluit is te allen tijde onherroepelijk en bindend.',
    ],
  },
  {
    id: 'geheim-02',
    number: '02',
    name: 'NOG GEHEIM #02',
    subtitle: 'Onthulling op zaterdag 3 april 2027',
    tagline: 'MYSTERY DISCIPLINE 2',
    description:
      'Het tweede mysterieuze spel van de BADEENDLYMPICS 2027. Een ware test voor teamcoördinatie, evenwicht en stalen zenuwen.',
    isSecret: true,
    rules: [
      'Wordt ter plaatse onthuld na afronding van Spel 01.',
      'Ieder team zet minimaal 2 spelers tegelijkertijd in.',
      'Elke millimeter en milliseconde telt mee voor de jurering.',
      'Eerlijk spel en ongekende gezelligheid staan voorop.',
    ],
  },
  {
    id: 'geheim-03',
    number: '03',
    name: 'NOG GEHEIM #03',
    subtitle: 'Onthulling op zaterdag 3 april 2027',
    tagline: 'MYSTERY DISCIPLINE 3',
    description:
      'De grote beproeving in het midden van het toernooi. Zowel fysiek als tactisch zal het uiterste van de teams gevraagd worden op het centrale veld.',
    isSecret: true,
    rules: [
      'Gedetailleerde spelregels liggen veilig opgeslagen in de gele kluis.',
      'Directe strijd tussen poule-tegenstanders.',
      'Geen hulpmiddelen toegestaan behalve de officiële toernooimaterialen.',
      'Punten worden live bijgeschreven op het scorebord.',
    ],
  },
  {
    id: 'geheim-04',
    number: '04',
    name: 'NOG GEHEIM #04',
    subtitle: 'Onthulling op zaterdag 3 april 2027',
    tagline: 'MYSTERY DISCIPLINE 4',
    description:
      'De voorlaatste discipline vóór de grote ontknoping. Een spectaculair onderdeel vol onvoorspelbare wendingen en hilarische momenten.',
    isSecret: true,
    rules: [
      'Onthulling 15 minuten voor de start van ronde 4.',
      'Hoge amusementswaarde met bonuspunten voor originaliteit.',
      'Waterbestendige kleding wordt ten zeerste aangeraden.',
      'De tussenstand wordt direct hierna op scherp gezet.',
    ],
  },
  {
    id: 'geheim-05',
    number: '05',
    name: 'NOG GEHEIM #05',
    subtitle: 'De grote mysterieuze slotclimax',
    tagline: 'DE GROTE FINALE • DUBBELE PUNTEN',
    description:
      'Het ultieme finalespel waarin alles op het spel staat. Punten tellen dubbel mee voor het eindklassement van de Gouden Badeend Wisseltrofee!',
    isSecret: true,
    rules: [
      'Wordt pas onthuld vlak voor de grote finale.',
      'Dubbele punten voor het algemeen toernooiklassement.',
      'Vereist uiterste teamcoördinatie, uithoudingsvermogen en feestgeest.',
      'De winnaar pakt mogelijk op het allerlaatste moment de Gouden Badeend.',
    ],
  },
];

export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-testeenden',
    name: 'DE TESTEENDEN',
    aanvoerder: 'E2E TESTER',
    email: 'e2e@test.nl',
    members: ['Anna', 'Bram', 'Cees', 'Daan'],
    registeredAt: '2026-08-20T10:00:00Z',
    scores: {
      'geheim-01': 42,
      'geheim-02': null,
      'geheim-03': null,
      'geheim-04': null,
      'geheim-05': null,
    },
    totaal: 42,
  },
  {
    id: 'team-schuimkoppen',
    name: 'DE SCHUIMKOPPEN',
    aanvoerder: 'Lars van Dijk',
    email: 'lars@schuimkoppen.nl',
    members: ['Lars', 'Sander', 'Koen', 'Tim'],
    registeredAt: '2026-08-21T14:30:00Z',
    scores: {
      'geheim-01': 38,
      'geheim-02': null,
      'geheim-03': null,
      'geheim-04': null,
      'geheim-05': null,
    },
    totaal: 38,
  },
  {
    id: 'team-kwakzalvers',
    name: 'DE KWAKZALVERS',
    aanvoerder: 'Sanne Meijer',
    email: 'sanne@kwakzalvers.nl',
    members: ['Sanne', 'Eva', 'Daan', 'Ruben'],
    registeredAt: '2026-08-22T09:15:00Z',
    scores: {
      'geheim-01': 35,
      'geheim-02': null,
      'geheim-03': null,
      'geheim-04': null,
      'geheim-05': null,
    },
    totaal: 35,
  },
];

export const INITIAL_SCORES: ScoreEntry[] = [
  {
    id: 'score-1',
    teamId: 'team-testeenden',
    teamName: 'DE TESTEENDEN',
    spelId: 'geheim-01',
    spelName: 'NOG GEHEIM #01',
    points: 42,
    updatedAt: '2026-08-20T11:00:00Z',
  },
  {
    id: 'score-2',
    teamId: 'team-schuimkoppen',
    teamName: 'DE SCHUIMKOPPEN',
    spelId: 'geheim-01',
    spelName: 'NOG GEHEIM #01',
    points: 38,
    updatedAt: '2026-08-21T15:00:00Z',
  },
  {
    id: 'score-3',
    teamId: 'team-kwakzalvers',
    teamName: 'DE KWAKZALVERS',
    spelId: 'geheim-01',
    spelName: 'NOG GEHEIM #01',
    points: 35,
    updatedAt: '2026-08-22T10:00:00Z',
  },
];

export const SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    time: '13:00 - 13:30',
    title: 'Inloop & Teamregistratie',
    description: 'Aanmelden van alle teams bij de wedstrijdbalie, controle van de teamcaptains en uitdelen van officiële toernooibadges.',
    location: 'Hoofdingang Scouting Van Brederode',
  },
  {
    time: '13:30 - 14:00',
    title: 'Officiële Openingsceremonie & Eed',
    description: 'Ontsteking van de Olympische Vlam & onthulling van de felbegeerde Gouden Badeend Wisseltrofee.',
    location: 'Centraal Evenementenveld',
    highlight: true,
  },
  {
    time: '14:00 - 14:45',
    title: 'SPEL 01: Geheim Spel #01',
    description: 'Onthulling en uitvoering van de allereerste Olympische discipline. Twee heats per team.',
    location: 'Arena A (Grasveld)',
    highlight: true,
  },
  {
    time: '14:45 - 15:00',
    title: 'Korte Hydratatie- & Bierpauze',
    description: 'Muziek, drankjes bij de buitenbar en voorbereiding op ronde 2.',
    location: 'Kantine & Terras',
  },
  {
    time: '15:00 - 15:45',
    title: 'SPEL 02: Geheim Spel #02',
    description: 'Onthulling van de tweede mysterieuze krachtmeting vol teamtactiek.',
    location: 'Arena B (Verhard parcours)',
    highlight: true,
  },
  {
    time: '15:45 - 16:30',
    title: 'SPEL 03: Geheim Spel #03',
    description: 'Het derde geheime onderdeel: uithoudingsvermogen, balans en samenwerking.',
    location: 'De Centrale Zone',
    highlight: true,
  },
  {
    time: '16:30 - 17:15',
    title: 'SPEL 04: Geheim Spel #04',
    description: 'De vierde geheime discipline voor behendigheid en stalen zenuwen.',
    location: 'Arena A',
    highlight: true,
  },
  {
    time: '17:15 - 18:00',
    title: 'SPEL 05: De Grote Geheime Finale',
    description: 'De mysterieuze slotclimax van de BADEENDLYMPICS! Dubbele punten voor het eindklassement.',
    location: 'Hoofdarena',
    highlight: true,
  },
  {
    time: '18:00 - 18:30',
    title: 'Puntentelling & Grote Prijsuitreiking',
    description: 'Kroning van de BADEENDLYMPICS Kampioenen 2027 en uitreiking van de Gouden Badeend.',
    location: 'Hoofdpodium',
    highlight: true,
  },
  {
    time: '18:30 - Laat',
    title: 'Afsluitend Feest & Derde Helft',
    description: 'Gezelligheid, BBQ, muziek en napraten over de legendarische spellen.',
    location: 'Clubgebouw & Buitenterrein',
  },
];
