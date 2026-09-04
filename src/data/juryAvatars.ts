import { PresetAvatarId } from '../types';

export interface PresetAvatarOption {
  id: PresetAvatarId;
  name: string;
  subtitle: string;
  accentColor: string;
  badge: string;
}

export const PRESET_AVATARS: PresetAvatarOption[] = [
  // 🍺 BIER & FEEST
  {
    id: 'duck-beer',
    name: 'Bierpul Eend',
    subtitle: 'Met schuimende goudgele bierpul in de vleugel',
    accentColor: 'bg-amber-600 text-white',
    badge: 'Gerstenat',
  },
  {
    id: 'duck-beer-helmet',
    name: 'Bierhelm Eend',
    subtitle: 'Rode party-bierhelm met 2 blikjes & drinkrietjes',
    accentColor: 'bg-rose-600 text-white',
    badge: 'Feestcommissie',
  },
  {
    id: 'duck-sunglasses',
    name: 'Derde Helft Eend',
    subtitle: 'Snelle zonnebril & festival vissershoedje',
    accentColor: 'bg-purple-800 text-white',
    badge: 'Biertafel-held',
  },

  // 🏕️ SCOUTING & OUTDOOR
  {
    id: 'duck-scout',
    name: 'Padvinder Eend',
    subtitle: 'Met officiële scoutinghoed & tweekleurige das',
    accentColor: 'bg-emerald-900 text-white',
    badge: 'Altijd Paraat',
  },
  {
    id: 'duck-campfire',
    name: 'Kampvuur & Pionier Eend',
    subtitle: 'Scoutingdas & geroosterde marshmallow op stok',
    accentColor: 'bg-amber-900 text-white',
    badge: 'Woudloper',
  },

  // 🏃 SPORTEN & KRACHT
  {
    id: 'duck-athlete',
    name: 'Zweetband Atleet Eend',
    subtitle: 'Retro gestreepte sportband & gouden medaille',
    accentColor: 'bg-blue-600 text-white',
    badge: 'Topconditie',
  },
  {
    id: 'duck-weightlifter',
    name: 'Krachtpatser Eend',
    subtitle: 'Zware halter in vleugel & stoere polsbanden',
    accentColor: 'bg-zinc-900 text-white',
    badge: 'Bierkratten-kracht',
  },
  {
    id: 'duck-swimmer',
    name: 'Duiker & Snorkel Eend',
    subtitle: 'Heldere duikbril & neon-oranje snorkel',
    accentColor: 'bg-cyan-700 text-white',
    badge: 'Watersport',
  },

  // 🏆 TOERNOOI & LEIDING
  {
    id: 'duck-referee',
    name: 'Scheidsrechter Eend',
    subtitle: 'Zwart-wit gestreepte sportcap & spelfluitje',
    accentColor: 'bg-zinc-800 text-white',
    badge: 'Spelleiding',
  },
  {
    id: 'duck-gold',
    name: 'Badeendlympics Kampioen Eend',
    subtitle: 'Glimmend goud, lauwerkrans & toernooibeker',
    accentColor: 'bg-amber-400 text-black',
    badge: 'Goudzoekers',
  },
];

export const SUGGESTED_JURY_ROLES = [
  'Hoofdjury Stijl & Eendigheid',
  'Waterpas & Drijfvermogen Scheidsrechter',
  'Valsspel-detectie & Humor Inspecteur',
  'Bocht & Stroomcontroleur',
  'Badeend-Sommelier & Sfeercommissaris',
  'Wedstrijdklok & Milliseconden Rechter',
  'Teamoutfit & Esthetiek Beoordelaar',
  'Start & Finish Baancommissaris',
];

export const DEFAULT_JURY_MEMBERS = [
  {
    id: 'jury-default-01',
    name: 'Lotte van Brederode',
    email: 'Lotte@scoutingpapendrecht.nl',
    isHeadJury: true,
    isOrganizer: true,
    bioQuote: 'Een badeend zonder passie is als een tent zonder haringen: zakt meteen in.',
    scoutingAffiliation: 'Scouting Van Brederode',
    avatarType: 'preset' as const,
    avatarPresetId: 'duck-gold' as PresetAvatarId,
    status: 'active' as const,
    registeredAt: '2026-08-01T10:00:00.000Z',
    favoriteSpel: 'all' as const,
  },
  {
    id: 'jury-default-02',
    name: 'Bram de Baancommissaris',
    email: 'bram@scoutingpapendrecht.nl',
    isHeadJury: false,
    isOrganizer: true,
    bioQuote: 'Mijn fluitje liegt nooit. Zuiver dobberen of 5 straf-eenden!',
    scoutingAffiliation: 'Scouting Van Brederode',
    avatarType: 'preset' as const,
    avatarPresetId: 'duck-referee' as PresetAvatarId,
    status: 'active' as const,
    registeredAt: '2026-08-02T11:30:00.000Z',
    favoriteSpel: 'geheim-01' as const,
  },
];
