import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Team, ScoreEntry, SpelId, JuryMember, FaqItem, AdminSession, AdminAuthResponse, MinigameScore } from '../types';
import { SPELEN } from '../data/mockData';
import { DEFAULT_JURY_MEMBERS } from '../data/juryAvatars';
import { hashPassword, verifyPassword, isSha256Hash } from './crypto';

const TEAMS_STORAGE_KEY = 'badeendlympics_teams_v5';
const SCORES_STORAGE_KEY = 'badeendlympics_scores_v5';
const JURY_STORAGE_KEY = 'badeendlympics_jury_v1';
const FAQS_STORAGE_KEY = 'badeendlympics_faqs_v1';
const MINIGAME_STORAGE_KEY = 'badeendlympics_minigame_scores_v1';
const ADMIN_SESSION_KEY = 'badeendlympics_admin_session';
const ADMIN_TOKEN_KEY = 'badeendlympics_admin_token';
const ADMIN_SESSION_DATA_KEY = 'badeendlympics_admin_data';
const TEAM_SESSION_KEY = 'badeendlympics_team_session';
const JURY_SESSION_KEY = 'badeendlympics_jury_session';

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'faq-01',
    question: 'Wie kan er meedoen aan de BADEENDLYMPICS?',
    answer:
      'Iedereen vanaf 18 jaar met een gezonde dosis humor, teamspirit en een lichte fascinatie voor gele badeenden en gezelligheid. Teams bestaan uit exact 4 personen. Ieder teamlid moet 18+ zijn voor deelname.',
    order: 1,
    category: 'Deelname',
    updatedAt: '2027-01-01T12:00:00.000Z',
  },
  {
    id: 'faq-02',
    question: 'Kan ik me aanmelden als vrijwillig jurylid?',
    answer:
      'Jazeker! Vrijwillige juryleden zijn onmisbaar voor de BADEENDLYMPICS 2027. Je kunt je eenvoudig direct online aanmelden via de officiële jurypagina op deze website. Kies een unieke badeend-avatar, stel je juryquote in en jureer mee!',
    order: 2,
    category: 'Jury',
    updatedAt: '2027-01-01T12:00:00.000Z',
  },
  {
    id: 'faq-03',
    question: 'Heb je algemene vragen of opmerkingen over het evenement?',
    answer:
      'Voor alle algemene vragen over de organisatie, het programma of inschrijvingen kun je direct contact opnemen via een e-mail naar Lotte@scoutingpapendrecht.nl.',
    order: 3,
    category: 'Organisatie',
    updatedAt: '2027-01-01T12:00:00.000Z',
  },
  {
    id: 'faq-04',
    question: 'Moeten we ons eigen bier of badeend meenemen?',
    answer:
      'Nee! De organisatie en Scouting Van Brederode verzorgen alle officiële wedstrijdbadeenden en benodigdheden voor de spellen. De bar in het clubgebouw is geopend voor een lekker koud drankje.',
    order: 4,
    category: 'Spelregels',
    updatedAt: '2027-01-01T12:00:00.000Z',
  },
  {
    id: 'faq-05',
    question: 'Wat kosten de inschrijvingen?',
    answer:
      'Inschrijven is geheel gratis en kan t/m 1 maart 2027. Eventuele kosten worden achteraf verrekend met de deelnemers.',
    order: 5,
    category: 'Kosten',
    updatedAt: '2027-01-01T12:00:00.000Z',
  },
  {
    id: 'faq-06',
    question: 'Wat winnen we als we eerste worden?',
    answer:
      'Eeuwige roem in Papendrecht en omstreken, de officiële BADEENDLYMPICS 2027 titel en een welverdiende goudgele rakker voor het winnende team!',
    order: 6,
    category: 'Prijzen',
    updatedAt: '2027-01-01T12:00:00.000Z',
  },
  {
    id: 'faq-07',
    question: 'Zijn toeschouwers welkom?',
    answer:
      'Zeker! Toegang voor supporters en toeschouwers is gratis. Er is volop muziek, sfeer en spektakel op het terrein van Scouting Papendrecht.',
    order: 7,
    category: 'Bezoekers',
    updatedAt: '2027-01-01T12:00:00.000Z',
  },
];

// In-memory cache for fast synchronous access
let cachedTeams: Team[] = [];
let cachedScores: ScoreEntry[] = [];
let cachedJury: JuryMember[] = [];
let cachedFaqs: FaqItem[] = [];
let cachedMinigameScores: MinigameScore[] = [];
let isFirestoreInitialized = false;

// Load initial local data without hardcoded dummy entries
function initLocalCache() {
  try {
    const rawTeams = localStorage.getItem(TEAMS_STORAGE_KEY);
    cachedTeams = rawTeams ? JSON.parse(rawTeams) : [];
  } catch {
    cachedTeams = [];
  }

  try {
    const rawScores = localStorage.getItem(SCORES_STORAGE_KEY);
    cachedScores = rawScores ? JSON.parse(rawScores) : [];
  } catch {
    cachedScores = [];
  }

  try {
    const rawJury = localStorage.getItem(JURY_STORAGE_KEY);
    cachedJury = rawJury ? JSON.parse(rawJury) : DEFAULT_JURY_MEMBERS;
  } catch {
    cachedJury = DEFAULT_JURY_MEMBERS;
  }

  try {
    const rawFaqs = localStorage.getItem(FAQS_STORAGE_KEY);
    cachedFaqs = rawFaqs ? JSON.parse(rawFaqs) : DEFAULT_FAQS;
  } catch {
    cachedFaqs = DEFAULT_FAQS;
  }

  try {
    const rawMinigame = localStorage.getItem(MINIGAME_STORAGE_KEY);
    cachedMinigameScores = rawMinigame ? JSON.parse(rawMinigame) : [];
  } catch {
    cachedMinigameScores = [];
  }
}

initLocalCache();

// Synchronous getters for components
export function getStoredTeams(): Team[] {
  return cachedTeams.map((t) => ({
    ...t,
    password: t.password || 'Badeend2027',
  }));
}

export function getStoredScores(): ScoreEntry[] {
  return cachedScores;
}

export function getStoredJuryMembers(): JuryMember[] {
  return cachedJury;
}

export function getStoredFaqs(): FaqItem[] {
  return [...cachedFaqs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getStoredMinigameScores(): MinigameScore[] {
  return [...cachedMinigameScores].sort((a, b) => b.score - a.score);
}

export function recalculateTeamTotals(teams: Team[], scores: ScoreEntry[]): Team[] {
  return teams.map((team) => {
    const teamScores: Record<string, number | null> = {
      'geheim-01': null,
      'geheim-02': null,
      'geheim-03': null,
      'geheim-04': null,
      'geheim-05': null,
    };

    let totaal = 0;

    scores.forEach((entry) => {
      if (
        entry.teamName.trim().toLowerCase() === team.name.trim().toLowerCase() ||
        entry.teamId === team.id
      ) {
        teamScores[entry.spelId] = entry.points;
        totaal += entry.points;
      }
    });

    return {
      ...team,
      scores: teamScores,
      totaal,
    };
  });
}

/**
 * Initialize Firestore listeners.
 * Realtime sync loads and listens to teams and scores from Firestore without injecting mock data.
 */
export function initFirestoreSync() {
  if (isFirestoreInitialized) return () => {};
  isFirestoreInitialized = true;

  const teamsCollection = collection(db, 'teams');
  const scoresCollection = collection(db, 'scores');
  const juryCollection = collection(db, 'jury_members');
  const faqsCollection = collection(db, 'faqs');
  const minigameCollection = collection(db, 'minigame_scores');

  // Real-time listener for Teams from Firestore
  const unsubscribeTeams = onSnapshot(
    teamsCollection,
    (snapshot) => {
      const liveTeams: Team[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Team;
        liveTeams.push({
          ...data,
          id: docSnap.id,
          password: data.password || 'Badeend2027',
        });
      });

      cachedTeams = liveTeams;
      localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(liveTeams));
      window.dispatchEvent(new Event('badeendlympics_data_change'));
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'teams');
    }
  );

  // Real-time listener for Scores from Firestore
  const unsubscribeScores = onSnapshot(
    scoresCollection,
    (snapshot) => {
      const liveScores: ScoreEntry[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as ScoreEntry;
        liveScores.push({
          ...data,
          id: docSnap.id,
        });
      });

      cachedScores = liveScores;
      localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(liveScores));
      window.dispatchEvent(new Event('badeendlympics_data_change'));
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'scores');
    }
  );

  // Real-time listener for Jury Members from Firestore
  const unsubscribeJury = onSnapshot(
    juryCollection,
    (snapshot) => {
      const liveJury: JuryMember[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as JuryMember;
        liveJury.push({
          ...data,
          id: docSnap.id,
        });
      });

      if (liveJury.length > 0) {
        cachedJury = liveJury;
        localStorage.setItem(JURY_STORAGE_KEY, JSON.stringify(liveJury));
      } else if (cachedJury.length === 0) {
        cachedJury = DEFAULT_JURY_MEMBERS;
        localStorage.setItem(JURY_STORAGE_KEY, JSON.stringify(DEFAULT_JURY_MEMBERS));
      }
      window.dispatchEvent(new Event('badeendlympics_data_change'));
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'jury_members');
    }
  );

  // Real-time listener for FAQs from Firestore
  const unsubscribeFaqs = onSnapshot(
    faqsCollection,
    (snapshot) => {
      const liveFaqs: FaqItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as FaqItem;
        liveFaqs.push({
          ...data,
          id: docSnap.id,
        });
      });

      if (liveFaqs.length > 0) {
        liveFaqs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        cachedFaqs = liveFaqs;
        localStorage.setItem(FAQS_STORAGE_KEY, JSON.stringify(liveFaqs));
      } else if (cachedFaqs.length === 0) {
        cachedFaqs = DEFAULT_FAQS;
        localStorage.setItem(FAQS_STORAGE_KEY, JSON.stringify(DEFAULT_FAQS));
      }
      window.dispatchEvent(new Event('badeendlympics_data_change'));
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'faqs');
    }
  );

  // Real-time listener for Minigame Scores from Firestore
  const unsubscribeMinigame = onSnapshot(
    minigameCollection,
    (snapshot) => {
      const liveMinigame: MinigameScore[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as MinigameScore;
        liveMinigame.push({
          ...data,
          id: docSnap.id,
        });
      });

      liveMinigame.sort((a, b) => b.score - a.score);
      cachedMinigameScores = liveMinigame;
      localStorage.setItem(MINIGAME_STORAGE_KEY, JSON.stringify(liveMinigame));
      window.dispatchEvent(new Event('badeendlympics_minigame_change'));
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'minigame_scores');
    }
  );

  return () => {
    unsubscribeTeams();
    unsubscribeScores();
    unsubscribeJury();
    unsubscribeFaqs();
    unsubscribeMinigame();
  };
}

// Helper to strip undefined fields recursively because Firestore reject undefined values
export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): T {
  const clean: any = {};
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if (val !== undefined) {
      if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
        clean[key] = sanitizeForFirestore(val);
      } else {
        clean[key] = val;
      }
    }
  });
  return clean;
}

export async function saveTeam(
  teamData: Omit<Team, 'id' | 'registeredAt' | 'scores' | 'totaal'>
): Promise<Team> {
  const newTeamId = `team-${Date.now()}`;
  const rawPassword = teamData.password || 'Badeend2027';
  const hashedPassword = isSha256Hash(rawPassword)
    ? rawPassword
    : await hashPassword(rawPassword);

  const newTeam: Team = {
    id: newTeamId,
    name: teamData.name.trim(),
    aanvoerder: teamData.aanvoerder.trim(),
    email: teamData.email.trim().toLowerCase(),
    password: hashedPassword,
    members: teamData.members.map((m) => m.trim()).filter((m) => m.length > 0),
    registeredAt: new Date().toISOString(),
    scores: {
      'geheim-01': null,
      'geheim-02': null,
      'geheim-03': null,
      'geheim-04': null,
      'geheim-05': null,
    },
    totaal: 0,
  };

  // 1. Update local cache immediately
  cachedTeams = [newTeam, ...cachedTeams.filter((t) => t.id !== newTeamId)];
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(cachedTeams));
  window.dispatchEvent(new Event('badeendlympics_data_change'));

  // 2. Persist to Firestore
  try {
    const cleanData = sanitizeForFirestore(newTeam);
    await setDoc(doc(db, 'teams', newTeamId), cleanData);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `teams/${newTeamId}`);
  }

  return newTeam;
}

export async function updateTeam(
  teamId: string,
  updatedData: Partial<Omit<Team, 'id' | 'registeredAt' | 'scores' | 'totaal'>>
): Promise<Team | null> {
  const index = cachedTeams.findIndex((t) => t.id === teamId);
  if (index === -1) return null;

  const oldTeam = cachedTeams[index];
  const oldName = oldTeam.name;

  let newPasswordHash = oldTeam.password;
  if (updatedData.password) {
    newPasswordHash = isSha256Hash(updatedData.password)
      ? updatedData.password
      : await hashPassword(updatedData.password);
  }

  const updatedTeam: Team = {
    ...oldTeam,
    name: updatedData.name ? updatedData.name.trim() : oldTeam.name,
    aanvoerder: updatedData.aanvoerder ? updatedData.aanvoerder.trim() : oldTeam.aanvoerder,
    email: updatedData.email ? updatedData.email.trim().toLowerCase() : oldTeam.email,
    password: newPasswordHash,
    members: updatedData.members
      ? updatedData.members.map((m) => m.trim()).filter(Boolean)
      : oldTeam.members,
  };

  cachedTeams[index] = updatedTeam;
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(cachedTeams));

  // If team name changed, update the name in scores
  if (updatedData.name && updatedData.name.trim().toLowerCase() !== oldName.trim().toLowerCase()) {
    const newName = updatedData.name.trim();
    cachedScores = cachedScores.map((s) => {
      if (s.teamId === teamId || s.teamName.trim().toLowerCase() === oldName.trim().toLowerCase()) {
        const updatedScore = { ...s, teamId, teamName: newName };
        setDoc(doc(db, 'scores', s.id), sanitizeForFirestore(updatedScore), { merge: true }).catch((err) => {
          handleFirestoreError(err, OperationType.UPDATE, `scores/${s.id}`);
        });
        return updatedScore;
      }
      return s;
    });
    localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(cachedScores));
  }

  // Persist to Firestore
  try {
    const cleanData = sanitizeForFirestore(updatedTeam);
    await setDoc(doc(db, 'teams', teamId), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `teams/${teamId}`);
  }

  // Also update active session if this team is logged in
  const activeTeamdirect = getTeamSession();
  if (activeTeamdirect && activeTeamdirect.id === teamId) {
    setTeamSession(updatedTeam);
  }

  window.dispatchEvent(new Event('badeendlympics_data_change'));
  return updatedTeam;
}

export function deleteTeam(teamId: string): void {
  const teamToDelete = cachedTeams.find((t) => t.id === teamId);
  cachedTeams = cachedTeams.filter((t) => t.id !== teamId);
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(cachedTeams));

  // Delete from Firestore
  deleteDoc(doc(db, 'teams', teamId)).catch((error) => {
    handleFirestoreError(error, OperationType.DELETE, `teams/${teamId}`);
  });

  // Also remove scores for this team
  if (teamToDelete) {
    const scoresToDelete = cachedScores.filter(
      (s) =>
        s.teamId === teamId ||
        s.teamName.trim().toLowerCase() === teamToDelete.name.trim().toLowerCase()
    );

    scoresToDelete.forEach((s) => {
      deleteDoc(doc(db, 'scores', s.id)).catch((err) => {
        handleFirestoreError(err, OperationType.DELETE, `scores/${s.id}`);
      });
    });

    cachedScores = cachedScores.filter(
      (s) =>
        s.teamId !== teamId &&
        s.teamName.trim().toLowerCase() !== teamToDelete.name.trim().toLowerCase()
    );
    localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(cachedScores));
  }

  // If this team was logged in, log them out
  const activeTeam = getTeamSession();
  if (activeTeam && activeTeam.id === teamId) {
    setTeamSession(null);
  }

  window.dispatchEvent(new Event('badeendlympics_data_change'));
}

export function saveOrUpdateScore(
  teamName: string,
  spelId: SpelId,
  points: number
): ScoreEntry {
  const matchingTeam = cachedTeams.find(
    (t) => t.name.trim().toLowerCase() === teamName.trim().toLowerCase()
  );

  const spel = SPELEN.find((s) => s.id === spelId);
  const spelName = spel ? spel.name : spelId;

  // Check if score exists for this team & game
  const existingIndex = cachedScores.findIndex(
    (s) =>
      (s.teamName.trim().toLowerCase() === teamName.trim().toLowerCase() ||
        (matchingTeam && s.teamId === matchingTeam.id)) &&
      s.spelId === spelId
  );

  let resultEntry: ScoreEntry;

  if (existingIndex >= 0) {
    const existing = cachedScores[existingIndex];
    resultEntry = {
      ...existing,
      teamId: matchingTeam ? matchingTeam.id : existing.teamId,
      teamName: teamName.trim(),
      points,
      updatedAt: new Date().toISOString(),
    };
    cachedScores[existingIndex] = resultEntry;
  } else {
    resultEntry = {
      id: `score-${Date.now()}`,
      teamId: matchingTeam ? matchingTeam.id : undefined,
      teamName: teamName.trim(),
      spelId,
      spelName,
      points,
      updatedAt: new Date().toISOString(),
    };
    cachedScores = [resultEntry, ...cachedScores];
  }

  localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(cachedScores));

  // Persist to Firestore
  try {
    const cleanScore = sanitizeForFirestore(resultEntry);
    setDoc(doc(db, 'scores', resultEntry.id), cleanScore).catch((error) => {
      handleFirestoreError(error, OperationType.WRITE, `scores/${resultEntry.id}`);
    });
  } catch (err) {
    console.error('Error saving score to Firestore:', err);
  }

  window.dispatchEvent(new Event('badeendlympics_data_change'));
  return resultEntry;
}

export function deleteScore(scoreId: string): void {
  cachedScores = cachedScores.filter((s) => s.id !== scoreId);
  localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(cachedScores));

  // Delete from Firestore
  deleteDoc(doc(db, 'scores', scoreId)).catch((error) => {
    handleFirestoreError(error, OperationType.DELETE, `scores/${scoreId}`);
  });

  window.dispatchEvent(new Event('badeendlympics_data_change'));
}

export function resetAllData(): void {
  cachedTeams.forEach((team) => {
    deleteDoc(doc(db, 'teams', team.id)).catch(() => {});
  });
  cachedScores.forEach((score) => {
    deleteDoc(doc(db, 'scores', score.id)).catch(() => {});
  });

  cachedTeams = [];
  cachedScores = [];
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify([]));
  localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify([]));

  window.dispatchEvent(new Event('badeendlympics_data_change'));
}

// --- MINIGAME SCORES ---

export async function saveMinigameScore(
  scoreData: Omit<MinigameScore, 'id' | 'createdAt'>
): Promise<MinigameScore> {
  const newId = `mini-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const fullEntry: MinigameScore = {
    ...scoreData,
    id: newId,
    createdAt: new Date().toISOString(),
  };

  // Optimistic local update
  cachedMinigameScores = [fullEntry, ...cachedMinigameScores].sort((a, b) => b.score - a.score);
  localStorage.setItem(MINIGAME_STORAGE_KEY, JSON.stringify(cachedMinigameScores));
  window.dispatchEvent(new Event('badeendlympics_minigame_change'));

  // Persist to Firestore
  try {
    const cleanEntry = sanitizeForFirestore(fullEntry);
    await setDoc(doc(db, 'minigame_scores', newId), cleanEntry);
  } catch (err) {
    console.error('Error saving minigame score to Firestore:', err);
    handleFirestoreError(err, OperationType.CREATE, `minigame_scores/${newId}`);
  }

  return fullEntry;
}

// --- AUTH SESSIONS ---

export function getAdminSession(): boolean {
  try {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    const dataRaw = localStorage.getItem(ADMIN_SESSION_DATA_KEY);
    if (!token || !dataRaw) {
      return false;
    }
    const sessionData: AdminSession = JSON.parse(dataRaw);
    if (Date.now() > sessionData.expiresAt) {
      clearAdminSession();
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function getAdminSessionData(): AdminSession | null {
  try {
    const dataRaw = localStorage.getItem(ADMIN_SESSION_DATA_KEY);
    if (!dataRaw) return null;
    const sessionData: AdminSession = JSON.parse(dataRaw);
    if (Date.now() > sessionData.expiresAt) {
      clearAdminSession();
      return null;
    }
    return sessionData;
  } catch {
    return null;
  }
}

export function clearAdminSession(): void {
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_SESSION_DATA_KEY);
  } catch (e) {
    console.error('Error clearing admin session:', e);
  }
}

export function setAdminSession(
  loggedIn: boolean,
  sessionData?: { token: string; email: string; expiresAt: number }
): void {
  try {
    if (loggedIn && sessionData) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
      localStorage.setItem(ADMIN_TOKEN_KEY, sessionData.token);
      localStorage.setItem(ADMIN_SESSION_DATA_KEY, JSON.stringify(sessionData));
    } else {
      clearAdminSession();
    }
    window.dispatchEvent(new Event('badeendlympics_auth_change'));
  } catch (e) {
    console.error('Error setting admin session:', e);
  }
}

export async function verifyAdminSession(): Promise<boolean> {
  try {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      clearAdminSession();
      return false;
    }

    const res = await fetch('/api/auth/admin/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ token }),
    });

    if (res.ok) {
      const data = await res.json();
      return data.valid === true;
    } else {
      clearAdminSession();
      window.dispatchEvent(new Event('badeendlympics_auth_change'));
      return false;
    }
  } catch {
    // If offline or network issue, fallback to checking expiration
    return getAdminSession();
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) {
      await fetch('/api/auth/admin/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      }).catch(() => {});
    }
  } finally {
    clearAdminSession();
    window.dispatchEvent(new Event('badeendlympics_auth_change'));
  }
}

export function getTeamSession(): Team | null {
  try {
    const raw = localStorage.getItem(TEAM_SESSION_KEY);
    if (!raw) return null;
    const sessionTeam: Team = JSON.parse(raw);
    const fresh = cachedTeams.find((t) => t.id === sessionTeam.id);
    return fresh || sessionTeam;
  } catch {
    return null;
  }
}

export function setTeamSession(team: Team | null): void {
  try {
    if (team) {
      localStorage.setItem(TEAM_SESSION_KEY, JSON.stringify(team));
    } else {
      localStorage.removeItem(TEAM_SESSION_KEY);
    }
    window.dispatchEvent(new Event('badeendlympics_auth_change'));
  } catch (e) {
    console.error(e);
  }
}

export function logoutAll(): void {
  setAdminSession(false);
  setTeamSession(null);
  setJurySession(null);
}

export function getJurySession(): JuryMember | null {
  try {
    const raw = localStorage.getItem(JURY_SESSION_KEY);
    if (!raw) return null;
    const sessionJury: JuryMember = JSON.parse(raw);
    const fresh = cachedJury.find((j) => j.id === sessionJury.id);
    return fresh || sessionJury;
  } catch {
    return null;
  }
}

export function setJurySession(jury: JuryMember | null): void {
  try {
    if (jury) {
      localStorage.setItem(JURY_SESSION_KEY, JSON.stringify(jury));
    } else {
      localStorage.removeItem(JURY_SESSION_KEY);
    }
    window.dispatchEvent(new Event('badeendlympics_auth_change'));
  } catch (e) {
    console.error(e);
  }
}

// --- JURY OPERATIONS ---

export async function saveJuryMember(
  juryData: Omit<JuryMember, 'id' | 'registeredAt'>
): Promise<JuryMember> {
  const newJuryId = `jury-${Date.now()}`;
  const rawPassword = juryData.password || 'JuryBadeend2027';
  const hashedPassword = isSha256Hash(rawPassword)
    ? rawPassword
    : await hashPassword(rawPassword);

  const newJury: JuryMember = {
    id: newJuryId,
    name: juryData.name.trim(),
    email: juryData.email.trim().toLowerCase(),
    password: hashedPassword,
    isHeadJury: Boolean(juryData.isHeadJury),
    isOrganizer: Boolean(juryData.isOrganizer),
    bioQuote: juryData.bioQuote ? juryData.bioQuote.trim() : 'Klaar voor de Badeendlympics 2027!',
    scoutingAffiliation: juryData.scoutingAffiliation ? juryData.scoutingAffiliation.trim() : 'Scouting',
    avatarType: juryData.avatarType || 'preset',
    avatarPresetId: juryData.avatarType === 'preset' ? (juryData.avatarPresetId || 'duck-referee') : undefined,
    photoUrl: juryData.avatarType === 'custom' && juryData.photoUrl ? juryData.photoUrl : undefined,
    status: juryData.status || 'active',
    registeredAt: new Date().toISOString(),
    favoriteSpel: juryData.favoriteSpel || 'all',
  };

  // 1. Update local cache immediately
  cachedJury = [newJury, ...cachedJury.filter((j) => j.id !== newJuryId)];
  localStorage.setItem(JURY_STORAGE_KEY, JSON.stringify(cachedJury));
  window.dispatchEvent(new Event('badeendlympics_data_change'));

  // 2. Persist to Firestore (safely strip undefined fields)
  try {
    const cleanJury = sanitizeForFirestore(newJury);
    await setDoc(doc(db, 'jury_members', newJuryId), cleanJury);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `jury_members/${newJuryId}`);
  }

  return newJury;
}

export async function updateJuryMember(
  juryId: string,
  updatedData: Partial<Omit<JuryMember, 'id' | 'registeredAt'>>
): Promise<JuryMember | null> {
  const index = cachedJury.findIndex((j) => j.id === juryId);
  if (index === -1) return null;

  const oldJury = cachedJury[index];

  let newPasswordHash = oldJury.password;
  if (updatedData.password) {
    newPasswordHash = isSha256Hash(updatedData.password)
      ? updatedData.password
      : await hashPassword(updatedData.password);
  }

  const updatedJury: JuryMember = {
    ...oldJury,
    name: updatedData.name ? updatedData.name.trim() : oldJury.name,
    email: updatedData.email ? updatedData.email.trim().toLowerCase() : oldJury.email,
    isHeadJury: updatedData.isHeadJury !== undefined ? updatedData.isHeadJury : oldJury.isHeadJury,
    isOrganizer: updatedData.isOrganizer !== undefined ? updatedData.isOrganizer : oldJury.isOrganizer,
    bioQuote: updatedData.bioQuote !== undefined ? updatedData.bioQuote.trim() : oldJury.bioQuote,
    scoutingAffiliation:
      updatedData.scoutingAffiliation !== undefined
        ? updatedData.scoutingAffiliation.trim()
        : oldJury.scoutingAffiliation,
    avatarType: updatedData.avatarType || oldJury.avatarType,
    avatarPresetId: updatedData.avatarPresetId !== undefined ? updatedData.avatarPresetId : oldJury.avatarPresetId,
    photoUrl: updatedData.photoUrl !== undefined ? updatedData.photoUrl : oldJury.photoUrl,
    status: updatedData.status || oldJury.status,
    favoriteSpel: updatedData.favoriteSpel !== undefined ? updatedData.favoriteSpel : oldJury.favoriteSpel,
    password: newPasswordHash,
  };

  cachedJury[index] = updatedJury;
  localStorage.setItem(JURY_STORAGE_KEY, JSON.stringify(cachedJury));

  // Persist to Firestore (safely strip undefined fields)
  try {
    const cleanJury = sanitizeForFirestore(updatedJury);
    await setDoc(doc(db, 'jury_members', juryId), cleanJury, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `jury_members/${juryId}`);
  }

  // If this jury member is currently logged in, update session
  const activeJury = getJurySession();
  if (activeJury && activeJury.id === juryId) {
    setJurySession(updatedJury);
  }

  window.dispatchEvent(new Event('badeendlympics_data_change'));
  return updatedJury;
}

export function deleteJuryMember(juryId: string): void {
  cachedJury = cachedJury.filter((j) => j.id !== juryId);
  localStorage.setItem(JURY_STORAGE_KEY, JSON.stringify(cachedJury));

  // Delete from Firestore
  deleteDoc(doc(db, 'jury_members', juryId)).catch((error) => {
    handleFirestoreError(error, OperationType.DELETE, `jury_members/${juryId}`);
  });

  // If logged in, logout
  const activeJury = getJurySession();
  if (activeJury && activeJury.id === juryId) {
    setJurySession(null);
  }

  window.dispatchEvent(new Event('badeendlympics_data_change'));
}

// --- FAQS STORAGE & SYNC ---

export async function saveFaq(
  faqData: Omit<FaqItem, 'id' | 'updatedAt'>
): Promise<FaqItem> {
  const newFaqId = `faq-${Date.now()}`;
  const maxOrder = cachedFaqs.reduce((max, f) => Math.max(max, f.order ?? 0), 0);
  const newFaq: FaqItem = {
    id: newFaqId,
    question: faqData.question.trim(),
    answer: faqData.answer.trim(),
    order: faqData.order !== undefined ? faqData.order : maxOrder + 1,
    category: faqData.category ? faqData.category.trim() : 'Algemeen',
    updatedAt: new Date().toISOString(),
  };

  cachedFaqs = [...cachedFaqs, newFaq].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  localStorage.setItem(FAQS_STORAGE_KEY, JSON.stringify(cachedFaqs));
  window.dispatchEvent(new Event('badeendlympics_data_change'));

  try {
    const cleanData = sanitizeForFirestore(newFaq);
    await setDoc(doc(db, 'faqs', newFaqId), cleanData);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `faqs/${newFaqId}`);
  }

  return newFaq;
}

export async function updateFaq(
  faqId: string,
  updatedData: Partial<Omit<FaqItem, 'id'>>
): Promise<FaqItem | null> {
  const index = cachedFaqs.findIndex((f) => f.id === faqId);
  if (index === -1) return null;

  const oldFaq = cachedFaqs[index];
  const updatedFaq: FaqItem = {
    ...oldFaq,
    question: updatedData.question !== undefined ? updatedData.question.trim() : oldFaq.question,
    answer: updatedData.answer !== undefined ? updatedData.answer.trim() : oldFaq.answer,
    order: updatedData.order !== undefined ? updatedData.order : oldFaq.order,
    category: updatedData.category !== undefined ? updatedData.category?.trim() : oldFaq.category,
    updatedAt: new Date().toISOString(),
  };

  cachedFaqs[index] = updatedFaq;
  cachedFaqs.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  localStorage.setItem(FAQS_STORAGE_KEY, JSON.stringify(cachedFaqs));
  window.dispatchEvent(new Event('badeendlympics_data_change'));

  try {
    const cleanData = sanitizeForFirestore(updatedFaq);
    await setDoc(doc(db, 'faqs', faqId), cleanData, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `faqs/${faqId}`);
  }

  return updatedFaq;
}

export function deleteFaq(faqId: string): void {
  cachedFaqs = cachedFaqs.filter((f) => f.id !== faqId);
  localStorage.setItem(FAQS_STORAGE_KEY, JSON.stringify(cachedFaqs));

  deleteDoc(doc(db, 'faqs', faqId)).catch((error) => {
    handleFirestoreError(error, OperationType.DELETE, `faqs/${faqId}`);
  });

  window.dispatchEvent(new Event('badeendlympics_data_change'));
}

export async function reorderFaqs(newOrderedFaqs: FaqItem[]): Promise<void> {
  const updated = newOrderedFaqs.map((f, idx) => ({
    ...f,
    order: idx + 1,
    updatedAt: new Date().toISOString(),
  }));

  cachedFaqs = updated;
  localStorage.setItem(FAQS_STORAGE_KEY, JSON.stringify(cachedFaqs));
  window.dispatchEvent(new Event('badeendlympics_data_change'));

  for (const faq of updated) {
    try {
      const cleanData = sanitizeForFirestore(faq);
      await setDoc(doc(db, 'faqs', faq.id), cleanData, { merge: true });
    } catch {
      // safe
    }
  }
}

export async function resetFaqsToDefault(): Promise<void> {
  for (const faq of cachedFaqs) {
    deleteDoc(doc(db, 'faqs', faq.id)).catch(() => {});
  }

  cachedFaqs = [...DEFAULT_FAQS];
  localStorage.setItem(FAQS_STORAGE_KEY, JSON.stringify(cachedFaqs));
  window.dispatchEvent(new Event('badeendlympics_data_change'));

  for (const defFaq of DEFAULT_FAQS) {
    try {
      const cleanData = sanitizeForFirestore(defFaq);
      await setDoc(doc(db, 'faqs', defFaq.id), cleanData);
    } catch {
      // safe
    }
  }
}

/**
 * Authenticates a jury member using email/name and password.
 */
export async function authenticateJury(
  identifier: string,
  inputPassword: string
): Promise<{ success: boolean; jury?: JuryMember; message?: string }> {
  const trimmedId = identifier.trim().toLowerCase();
  const trimmedPass = inputPassword.trim();
  if (!trimmedId || !trimmedPass) {
    return { success: false, message: 'Vul a.u.b. zowel je e-mailadres/naam als wachtwoord in.' };
  }

  const juryList = getStoredJuryMembers();
  for (const member of juryList) {
    const matchEmail = member.email.trim().toLowerCase() === trimmedId;
    const matchName = member.name.trim().toLowerCase() === trimmedId;
    if (matchEmail || matchName) {
      const storedPass = member.password || 'JuryBadeend2027';
      const isValid = await verifyPassword(trimmedPass, storedPass);
      if (isValid) {
        if (!isSha256Hash(storedPass)) {
          const newHash = await hashPassword(trimmedPass);
          await updateJuryMember(member.id, { password: newHash });
          member.password = newHash;
        }
        return { success: true, jury: member };
      }
    }
  }

  return {
    success: false,
    message: 'Geen jurylid gevonden met deze combinatie van e-mail en wachtwoord.',
  };
}

/**
 * Authenticates a team using identifier (email or team name) and password.
 * Automatically verifies SHA-256 hashes and upgrades legacy plaintext passwords to SHA-256.
 */
export async function authenticateTeam(
  identifier: string,
  inputPassword: string
): Promise<{ success: boolean; team?: Team; message?: string }> {
  const trimmedId = identifier.trim().toLowerCase();
  const trimmedPass = inputPassword.trim();
  if (!trimmedId || !trimmedPass) {
    return { success: false, message: 'Vul a.u.b. zowel team/e-mail als wachtwoord in.' };
  }

  const teams = getStoredTeams();
  for (const team of teams) {
    const matchEmail = team.email.trim().toLowerCase() === trimmedId;
    const matchName = team.name.trim().toLowerCase() === trimmedId;
    if (matchEmail || matchName) {
      const storedPass = team.password || 'Badeend2027';
      const isValid = await verifyPassword(trimmedPass, storedPass);
      if (isValid) {
        // Upgrade legacy plaintext to SHA-256 in database if needed
        if (!isSha256Hash(storedPass)) {
          const newHash = await hashPassword(trimmedPass);
          await updateTeam(team.id, { password: newHash });
          team.password = newHash;
        }
        return { success: true, team };
      }
    }
  }

  return {
    success: false,
    message: 'Geen team gevonden met deze combinatie van e-mail/teamnaam en wachtwoord.',
  };
}

/**
 * Authenticates the admin user via the secure server-side API.
 * Protected against brute force with rate-limiting, timing-safe hashing,
 * and signed HMAC session tokens. No passwords exist in client code.
 */
export async function authenticateAdmin(
  email: string,
  inputPassword: string
): Promise<AdminAuthResponse> {
  try {
    const res = await fetch('/api/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim(),
        password: inputPassword,
      }),
    });

    const data = await res.json();

    if (res.ok && data.success && data.token) {
      setAdminSession(true, {
        token: data.token,
        email: data.user?.email || email.trim().toLowerCase(),
        expiresAt: data.expiresAt || Date.now() + 8 * 60 * 60 * 1000,
      });
      return {
        success: true,
        token: data.token,
        user: data.user,
        expiresAt: data.expiresAt,
        message: data.message,
      };
    }

    return {
      success: false,
      message: data.message || 'Onjuiste inloggegevens voor de organisatie.',
      remainingAttempts: data.remainingAttempts,
      lockedUntil: data.lockedUntil,
    };
  } catch (error) {
    console.error('Admin authentication error:', error);
    return {
      success: false,
      message: 'Kan geen beveiligde verbinding maken met de server. Probeer het opnieuw.',
    };
  }
}

/**
 * Changes the admin password securely on the server with current password verification.
 */
export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) {
      return { success: false, message: 'Geen actieve beheerderssessie. Log opnieuw in.' };
    }

    const res = await fetch('/api/auth/admin/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      if (data.token) {
        const sessionInfo = getAdminSessionData();
        setAdminSession(true, {
          token: data.token,
          email: sessionInfo?.email || 'organisatie',
          expiresAt: data.expiresAt || Date.now() + 8 * 60 * 60 * 1000,
        });
      }
      return { success: true, message: data.message || 'Wachtwoord succesvol gewijzigd.' };
    }

    return { success: false, message: data.message || 'Wachtwoord wijzigen mislukt.' };
  } catch (err) {
    console.error('Change admin password error:', err);
    return { success: false, message: 'Verbindingsfout bij het wijzigen van het wachtwoord.' };
  }
}
