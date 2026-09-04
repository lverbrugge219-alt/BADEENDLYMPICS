export type SpelId =
  | 'geheim-01'
  | 'geheim-02'
  | 'geheim-03'
  | 'geheim-04'
  | 'geheim-05';

export interface SpelRuleSection {
  title: string;
  items: string[];
}

export interface SpelInfo {
  id: SpelId;
  number: string; // "01", "02", "03", "04", "05"
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  imageUrl?: string;
  isSecret: boolean;
  revealDate?: string;
  revealIsoDate?: string;
  rules: string[];
  goal?: string;
  location?: string;
  resultType?: string;
  materials?: string[];
  sections?: SpelRuleSection[];
  scoringDetails?: string;
  unlockedData?: Partial<SpelInfo>;
}

export interface Team {
  id: string;
  name: string;
  aanvoerder: string;
  email: string;
  password?: string;
  members: string[];
  registeredAt: string;
  scores?: Record<string, number | null>; // spelId -> points
  totaal?: number;
}

export interface ScoreEntry {
  id: string;
  teamId?: string;
  teamName: string;
  spelId: SpelId;
  spelName: string;
  points: number;
  updatedAt: string;
}

export type PresetAvatarId =
  | 'duck-referee'
  | 'duck-judge-wig'
  | 'duck-gold'
  | 'duck-detective'
  | 'duck-captain'
  | 'duck-sunglasses'
  | 'duck-pirate'
  | 'duck-whistle'
  | 'duck-swimmer'
  | 'duck-wizard';

export interface JuryMember {
  id: string;
  name: string;
  email: string;
  password?: string;
  isHeadJury?: boolean; // Alleen in te stellen door de organisatie
  isOrganizer?: boolean; // Alleen in te stellen door de organisatie
  bioQuote?: string; // e.g. "Een dobber zonder stijl krijgt bij mij geen 10 punten."
  scoutingAffiliation?: string; // e.g. "Scouting Van Brederode", "Oud-lid / Vrijwilliger", "Sympathisant"
  avatarType: 'preset' | 'custom';
  avatarPresetId?: PresetAvatarId;
  photoUrl?: string; // Compressed Base64 image data URL (WebP/JPEG, max 30-50KB)
  status: 'active' | 'pending';
  registeredAt: string;
  favoriteSpel?: SpelId | 'all';
  roleTitle?: string; // Legacy / optioneel
  specialty?: string; // Legacy / optioneel
}

export type PageRoute =
  | 'home'
  | 'info'
  | 'schema'
  | 'scores'
  | 'deelnemers'
  | 'inschrijven'
  | 'jury'
  | 'jury-aanmelden'
  | 'jury-portal'
  | 'login'
  | 'team-portal'
  | 'scorebeheer'
  | 'privacy'
  | 'spel-geheim-01'
  | 'spel-geheim-02'
  | 'spel-geheim-03'
  | 'spel-geheim-04'
  | 'spel-geheim-05';

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  location?: string;
  highlight?: boolean;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  category?: string;
  updatedAt?: string;
}

export interface AdminSession {
  token: string;
  email: string;
  expiresAt: number;
}

export interface AdminAuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    email: string;
    role: 'admin';
  };
  expiresAt?: number;
  remainingAttempts?: number;
  lockedUntil?: number;
}

export interface MinigameScore {
  id: string;
  playerName: string;
  teamName?: string;
  score: number;
  accuracy: number;
  maxStreak: number;
  avgReactionTimeMs?: number;
  rankTitle?: string;
  createdAt: string;
}


