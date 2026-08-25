export type SportId = 'rapids-sprint' | 'quack-diving' | 'hydro-tug' | 'pond-water-polo' | 'whirlpool-slalom';

export interface SportInfo {
  id: SportId;
  name: string;
  dutchName: string;
  tagline: string;
  description: string;
  iconName: string;
  badgeColor: string;
  accentBg: string;
  poolDepth: string;
  currentSpeed: string;
  duckSpec: string;
  scoringSystem: string;
  worldRecord: {
    holder: string;
    team: string;
    record: string;
    year: string;
  };
  rules: string[];
  trackDetails: {
    length: string;
    obstacles: string;
    arena: string;
  };
  keyTechnique: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  duckNumber: number;
}

export interface Team {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  captain: string;
  mascotName: string;
  duckColor: string;
  accessory: 'goggles' | 'medal' | 'headband' | 'snorkel' | 'cape' | 'crown';
  category: 'Pro Float' | 'Open Classic' | 'Heavyweight Buoy' | 'Junior Quackers';
  registeredSports: SportId[];
  gold: number;
  silver: number;
  bronze: number;
  totalPoints: number;
  members: TeamMember[];
  bio: string;
  stats: {
    speed: number;
    buoyancy: number;
    hydroDynamics: number;
    quackVolume: number;
  };
  isUserRegistered?: boolean;
}

export interface DuckleteProfile {
  id: string;
  name: string;
  nickname: string;
  teamId: string;
  teamName: string;
  country: string;
  specialty: SportId;
  ageInFloatingDays: number;
  weightGrams: number;
  duckModel: string;
  stats: {
    speed: number;
    buoyancy: number;
    agility: number;
    flotationSteer: number;
  };
  achievements: string[];
  signatureMove: string;
  quote: string;
  avatarColor: string;
  avatarAccessory: 'goggles' | 'medal' | 'headband' | 'snorkel' | 'cape' | 'crown';
}

export type ScheduleStatus = 'upcoming' | 'live' | 'completed';

export interface ScheduleEvent {
  id: string;
  title: string;
  sportId: SportId;
  day: 1 | 2 | 3;
  date: string;
  time: string;
  stage: 'Heats' | 'Quarterfinals' | 'Semifinals' | 'Grand Final' | 'Ceremony';
  arena: string;
  status: ScheduleStatus;
  participatingTeams: string[];
  winner?: {
    gold: string;
    silver: string;
    bronze: string;
    scoreTime: string;
  };
  highlightVideoUrl?: string;
  description: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Rules' | 'Venue' | 'Registration' | 'Spectators';
}

export type PageRoute =
  | 'home'
  | 'info'
  | 'sport-rapids-sprint'
  | 'sport-quack-diving'
  | 'sport-hydro-tug'
  | 'sport-pond-water-polo'
  | 'sport-whirlpool-slalom'
  | 'signup'
  | 'schedule'
  | 'leaderboard'
  | 'profiles';
