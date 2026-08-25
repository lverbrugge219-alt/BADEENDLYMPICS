export type SpelId =
  | 'geheim-01'
  | 'geheim-02'
  | 'geheim-03'
  | 'geheim-04'
  | 'geheim-05';

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

