import { PresetAvatarId } from '../types';

export interface PresetAvatarOption {
  id: PresetAvatarId;
  name: string;
  subtitle: string;
  accentColor: string;
  badge: string;
}

export const PRESET_AVATARS: PresetAvatarOption[] = [
  {
    id: 'duck-referee',
    name: 'Scheidsrechter Eend',
    subtitle: 'Met zwart-wit gestreepte cap & fluitje',
    accentColor: 'bg-zinc-800 text-white',
    badge: 'Strenge Lijn',
  },
  {
    id: 'duck-judge-wig',
    name: 'Edelachtbare Eend',
    subtitle: 'Met klassieke jurypruik & hamer',
    accentColor: 'bg-amber-700 text-white',
    badge: 'Eindoordeel',
  },
  {
    id: 'duck-gold',
    name: 'Gouden Kroon Eend',
    subtitle: 'Glimmend goud met koninklijke kroon',
    accentColor: 'bg-amber-400 text-black',
    badge: 'Ere-Jury',
  },
  {
    id: 'duck-detective',
    name: 'Speurneus Eend',
    subtitle: 'Met Sherlock-hoed & vergrootglas',
    accentColor: 'bg-amber-900 text-white',
    badge: 'Valsspel-controleur',
  },
  {
    id: 'duck-captain',
    name: 'Kapitein Eend',
    subtitle: 'Met officiële marinepet & kompas',
    accentColor: 'bg-blue-900 text-white',
    badge: 'Watercommissaris',
  },
  {
    id: 'duck-sunglasses',
    name: 'Cool Jurylid Eend',
    subtitle: 'Zwarte zonnebril & stijlvolle uitstraling',
    accentColor: 'bg-purple-900 text-white',
    badge: 'Stijl & Flair',
  },
  {
    id: 'duck-pirate',
    name: 'Piraten Eend',
    subtitle: 'Met ooglapje & piratenhoed',
    accentColor: 'bg-rose-900 text-white',
    badge: 'Kaper-expert',
  },
  {
    id: 'duck-whistle',
    name: 'Coach & Tijdwaarnemer',
    subtitle: 'Met stopwatch & fluitje',
    accentColor: 'bg-emerald-800 text-white',
    badge: 'Milliseconden',
  },
  {
    id: 'duck-swimmer',
    name: 'Duiker Eend',
    subtitle: 'Met duikbril & snorkel',
    accentColor: 'bg-cyan-800 text-white',
    badge: 'Onderwaterinspectie',
  },
  {
    id: 'duck-wizard',
    name: 'Magiër Eend',
    subtitle: 'Met toverhoed & magische sterren',
    accentColor: 'bg-indigo-900 text-white',
    badge: 'Verrassingsoordeel',
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
