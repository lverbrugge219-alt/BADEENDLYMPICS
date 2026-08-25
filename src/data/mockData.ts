import { SpelInfo, Team, ScoreEntry, ScheduleItem } from '../types';

export const SPELEN: SpelInfo[] = [
  {
    id: 'biertafel-opzetten',
    number: '01',
    name: 'BIERTAFEL OPZETTEN',
    subtitle: 'Snelheid, precisie en een rechte bank',
    tagline: 'SNELHEID, PRECISIE EN EEN RECHTE BANK',
    description:
      'Het fundament van elk respectabel evenement. Twee teamleden klappen op het startsignaal een complete biertafelset uit: tafel en twee banken. Vergrendeling moet 100% klikken en de waterpas beslist over eventuele strafseconden.',
    imageUrl: 'https://images.unsplash.com/photo-1575037614876-c38a4d44f5b8?auto=format&fit=crop&w=1000&q=80',
    isSecret: false,
    rules: [
      'Teams van 2 personen, start achter de startlijn met ingeklapte set.',
      'Beide banken en tafel moeten volledig in de borgpennen klikken.',
      'Waterpas-test: de badeend mag niet van de tafel afglijden.',
      'Snelste tijd wint, losse borgpen = 15 seconden straftijd.',
    ],
  },
  {
    id: 'dienblad-parcours',
    number: '02',
    name: 'DIENBLAD PARCOURS',
    subtitle: 'Volle glazen, lege handen, natte sokken',
    tagline: 'VOLLE GLAZEN, LEGE HANDEN, NATTE SOKKEN',
    description:
      'Navigeer met één hand een dienblad vol wankelende (bier)glazen over een verraderlijk slalomparcours vol pionnen, schansen en windturbines. Elke gemorste milliliter wordt aan de finish genadeloos verrekend.',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1000&q=80',
    isSecret: false,
    rules: [
      'Dienblad mag slechts met één hand gedragen worden.',
      'Parcours bevat 6 slalompoortjes en een wipwap-evenwichtsbalk.',
      'Meting met de officiële KBF-maatcilinder bij de finish.',
      'Minimaal 80% vloeistof vereist voor een geldige tijd.',
    ],
  },
  {
    id: 'kratbier-hindernisbaan',
    number: '03',
    name: 'KRATBIER HINDERNISBAAN',
    subtitle: '24 flesjes tegen de zwaartekracht',
    tagline: '24 FLESJES TEGEN DE ZWAARTEKRACHT',
    description:
      'De koninginnenrit van de BADEENDLYMPICS. Sleep, til en balanceer een vol krat over de hindernisbaan: klimrek, evenwichtsbalk, kruiptunnel en de beruchte eendglijbaan. Het krat mag de grond niet raken bij de gemarkeerde zones.',
    imageUrl: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=1000&q=80',
    isSecret: false,
    rules: [
      'Teams van 2, krat wisselt nooit van gripzone.',
      'Krat raakt grond in rode zone = 10 sec straftijd.',
      'Alle hindernissen verplicht, geen shortcuts.',
      'Zwaarste krat + snelste tijd = legende-status.',
    ],
  },
  {
    id: 'geheim-01',
    number: '04',
    name: 'NOG GEHEIM #01',
    subtitle: 'Onthulling op zaterdag 3 april 2027',
    tagline: 'MYSTERY DISCIPLINE 1',
    description:
      'De organisatie houdt de details van dit vierde spel strikt geheim in een verzegelde gele kluis. Bereid je voor op tactiek, behendigheid en onvoorspelbare badeend-interacties!',
    isSecret: true,
    rules: [
      'Details worden 15 minuten voor aanvang live bekendgemaakt.',
      'Ieder teamlid moet paraat staan met droge kleren.',
      'Badeend-attributen kunnen onverwacht ingezet worden.',
      'Jurybesluit is onherroepelijk bindend.',
    ],
  },
  {
    id: 'geheim-02',
    number: '05',
    name: 'NOG GEHEIM #02',
    subtitle: 'De grote mysterieuze slotclimax',
    tagline: 'MYSTERY DISCIPLINE 2',
    description:
      'Het ultieme finalespel waarin alles op het spel staat. Punten tellen dubbel mee voor het eindklassement van de Gouden Badeend.',
    isSecret: true,
    rules: [
      'Wordt pas onthuld vlak voor de grote finale.',
      'Dubbele punten voor het algemeen klassement.',
      'Vereist uiterste teamcoördinatie en uithoudingsvermogen.',
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
    members: ['Anna', 'Bram', 'Cees'],
    registeredAt: '2026-08-20T10:00:00Z',
    scores: {
      'biertafel-opzetten': 42,
      'dienblad-parcours': null,
      'kratbier-hindernisbaan': null,
      'geheim-01': null,
      'geheim-02': null,
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
      'biertafel-opzetten': 38,
      'dienblad-parcours': null,
      'kratbier-hindernisbaan': null,
      'geheim-01': null,
      'geheim-02': null,
    },
    totaal: 38,
  },
  {
    id: 'team-kwakzalvers',
    name: 'DE KWAKZALVERS',
    aanvoerder: 'Sanne Meijer',
    email: 'sanne@kwakzalvers.nl',
    members: ['Sanne', 'Eva', 'Daan'],
    registeredAt: '2026-08-22T09:15:00Z',
    scores: {
      'biertafel-opzetten': 35,
      'dienblad-parcours': null,
      'kratbier-hindernisbaan': null,
      'geheim-01': null,
      'geheim-02': null,
    },
    totaal: 35,
  },
];

export const INITIAL_SCORES: ScoreEntry[] = [
  {
    id: 'score-1',
    teamId: 'team-testeenden',
    teamName: 'DE TESTEENDEN',
    spelId: 'biertafel-opzetten',
    spelName: 'Biertafel Opzetten',
    points: 42,
    updatedAt: '2026-08-20T11:00:00Z',
  },
  {
    id: 'score-2',
    teamId: 'team-schuimkoppen',
    teamName: 'DE SCHUIMKOPPEN',
    spelId: 'biertafel-opzetten',
    spelName: 'Biertafel Opzetten',
    points: 38,
    updatedAt: '2026-08-21T15:00:00Z',
  },
  {
    id: 'score-3',
    teamId: 'team-kwakzalvers',
    teamName: 'DE KWAKZALVERS',
    spelId: 'biertafel-opzetten',
    spelName: 'Biertafel Opzetten',
    points: 35,
    updatedAt: '2026-08-22T10:00:00Z',
  },
];

export const SCHEDULE_ITEMS: ScheduleItem[] = [
  {
    time: '13:00 - 13:30',
    title: 'Inloop & Teamregistratie',
    description: 'Aanmelden van alle teams bij de wedstrijdbalie, controle van de teamcaptains en uitdelen van officiële teamnummers.',
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
    title: 'SPEL 01: Biertafel Opzetten',
    description: 'Wie klapt het snelst en stevigst een complete set uit? Twee heats per team.',
    location: 'Arena A (Grasveld)',
  },
  {
    time: '14:45 - 15:00',
    title: 'Korte Hydratatie- & Bierpauze',
    description: 'Muziek, drankjes bij de buitenbar en voorbereiding op het precisiewerk.',
    location: 'Kantine & Terras',
  },
  {
    time: '15:00 - 15:45',
    title: 'SPEL 02: Dienblad Parcours',
    description: 'Tijdrit over de hindernis-slalom. Iedere druppel gemorst is straftijd!',
    location: 'Arena B (Verhard parcours)',
  },
  {
    time: '15:45 - 16:45',
    title: 'SPEL 03: Kratbier Hindernisbaan',
    description: 'De koninginnenrit van de BADEENDLYMPICS. Kracht, balans en uithoudingsvermogen.',
    location: 'De Grote Hinderniszone',
    highlight: true,
  },
  {
    time: '16:45 - 17:45',
    title: 'SPEL 04 & 05: Onthulling Geheime Spellen',
    description: 'De grote verrassing van de organisatie. Dubbele punten voor het klassement!',
    location: 'Geheime Zone',
    highlight: true,
  },
  {
    time: '17:45 - 18:15',
    title: 'Puntentelling & Grote Prijsuitreiking',
    description: 'Kroning van de BADEENDLYMPICS Kampioenen 2027 en uitreiking van de Gouden Badeend.',
    location: 'Hoofdpodium',
    highlight: true,
  },
  {
    time: '18:15 - Laat',
    title: 'Afsluitend Feest & Derde Helft',
    description: 'Gezelligheid, BBQ, live muziek en napraten over de legendarische races.',
    location: 'Clubgebouw & Buitenterrein',
  },
];
