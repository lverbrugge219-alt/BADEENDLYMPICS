export interface GeneralRuleItem {
  number: number;
  text: string;
}

export interface GeneralRuleSection {
  id: string;
  title: string;
  iconName: 'team' | 'beer' | 'flask' | 'alert' | 'timer';
  badge: string;
  rules: GeneralRuleItem[];
}

export const GENERAL_RULES_PREAMBLE =
  'Deze regels gelden voor alle spelonderdelen van het evenement. Per spel staan alleen de spelspecifieke regels apart beschreven; deze algemene regels hoeven daar niet herhaald te worden.';

export const GENERAL_RULES_SECTIONS: GeneralRuleSection[] = [
  {
    id: 'team',
    title: 'Team',
    badge: 'Regel 1 t/m 3',
    iconName: 'team',
    rules: [
      {
        number: 1,
        text: 'Een team bestaat altijd uit 4 spelers.',
      },
      {
        number: 2,
        text: 'Alle deelnemende teamleden moeten 18 jaar of ouder zijn. Hierop is geen uitzondering mogelijk, voor geen enkel spelonderdeel.',
      },
      {
        number: 3,
        text: 'Tijdens een spelonderdeel mogen uitsluitend de aangewezen teamleden van dat team de materialen hanteren en bijdragen aan het spel. Anderen (bijvoorbeeld teamleden die op dat moment niet aan de beurt zijn, of omstanders) mogen niet meehelpen of het materiaal aanraken.',
      },
    ],
  },
  {
    id: 'bier',
    title: 'Bier — algemeen',
    badge: 'Regel 4 t/m 7',
    iconName: 'beer',
    rules: [
      {
        number: 4,
        text: 'Bij elk spelonderdeel geldt de vaste regel: het team drinkt gezamenlijk 4 bier.',
      },
      {
        number: 5,
        text: 'Het team geeft vóór aanvang van elk spel aan hoeveel van de 4 biertjes vervangen worden door de 0.0-variant (van 0 tot 4). Deze keuze ligt per spel vast vóór de start en kan tijdens het spel niet meer gewijzigd worden.',
      },
      {
        number: 6,
        text: 'Alle bier wordt door de organisatie verstrekt.',
      },
      {
        number: 7,
        text: 'Het team mag bij elk spelonderdeel gebruikmaken van 1 bieropener. Deze wordt aangereikt door de organisatie, of is zelf door het team meegebracht.',
      },
    ],
  },
  {
    id: 'nacontrole',
    title: 'Nacontrole "leeg" bier',
    badge: 'Regel 8',
    iconName: 'flask',
    rules: [
      {
        number: 8,
        text: 'Na elk spelonderdeel controleert de jury of de flesjes daadwerkelijk leeg waren op het moment dat dit vereist was, door de resterende inhoud van elk flesje zorgvuldig over te gieten in een maatbeker van 10 ml. Loopt een maatbeker over, dan wordt een volgende maatbeker van 10 ml gebruikt. Voor elke volle maatbeker (elke volle 10 ml aan restvloeistof, opgeteld over alle 4 flesjes) volgt een straf. De hoogte van deze straf per 10 ml restvloeistof is per spelonderdeel vastgelegd in de spelspecifieke regels.',
      },
    ],
  },
  {
    id: 'overtredingen',
    title: 'Overtredingen',
    badge: 'Regel 9 t/m 12',
    iconName: 'alert',
    rules: [
      {
        number: 9,
        text: 'Morsen van bier tijdens een spelonderdeel leidt tot straftijd, ter hoogte van het oordeel van de jury.',
      },
      {
        number: 10,
        text: 'Breken of beschadigen van glaswerk leidt tot diskwalificatie van de betreffende poging.',
      },
      {
        number: 11,
        text: 'Demonteren of beschadigen van spelmateriaal leidt tot diskwalificatie van de betreffende poging.',
      },
      {
        number: 12,
        text: 'Onder verzachtende omstandigheden kan de jury een team eenmalig toestaan een poging opnieuw te doen. In dat geval telt het beste gemeten resultaat als einduitslag voor dat onderdeel.',
      },
    ],
  },
  {
    id: 'resultaatregistratie',
    title: 'Resultaatregistratie',
    badge: 'Regel 13 & 14',
    iconName: 'timer',
    rules: [
      {
        number: 13,
        text: 'De jury meet bij elk spelonderdeel het resultaat live. Dit resultaat is per spelonderdeel ofwel een tijd, ofwel een score in punten (vastgelegd in de spelspecifieke regels van dat onderdeel).',
      },
      {
        number: 14,
        text: 'De jury behoudt het recht om een gemeten tijd of score achteraf bij te stellen (bijvoorbeeld op basis van video-opnames), zodat deze zo nauwkeurig mogelijk aansluit bij het daadwerkelijke resultaat. Deze bijgestelde tijd of score is bindend.',
      },
    ],
  },
];
