export type SpelId =
  | 'biertafel-opzetten'
  | 'dienblad-parcours'
  | 'kratbier-hindernisbaan'
  | 'geheim-01'
  | 'geheim-02';

export interface SpelInfo {
  id: SpelId;
  number: string; // "01", "02", "03", "04", "05"
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  imageUrl?: string;
  isSecret: boolean;
  rules: string[];
}

export interface Team {
  id: string;
  name: string;
  aanvoerder: string;
  email: string;
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

export type PageRoute =
  | 'home'
  | 'info'
  | 'schema'
  | 'scores'
  | 'deelnemers'
  | 'inschrijven'
  | 'scorebeheer'
  | 'spel-biertafel-opzetten'
  | 'spel-dienblad-parcours'
  | 'spel-kratbier-hindernisbaan'
  | 'spel-geheim-01'
  | 'spel-geheim-02';

export interface ScheduleItem {
  time: string;
  title: string;
  description: string;
  location?: string;
  highlight?: boolean;
}

