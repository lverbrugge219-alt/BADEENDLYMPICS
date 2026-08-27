import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Team, ScoreEntry, SpelId } from '../types';
import { SPELEN } from '../data/mockData';

const TEAMS_STORAGE_KEY = 'badeendlympics_teams_v5';
const SCORES_STORAGE_KEY = 'badeendlympics_scores_v5';
const ADMIN_SESSION_KEY = 'badeendlympics_admin_session';
const TEAM_SESSION_KEY = 'badeendlympics_team_session';

// In-memory cache for fast synchronous access
let cachedTeams: Team[] = [];
let cachedScores: ScoreEntry[] = [];
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

  return () => {
    unsubscribeTeams();
    unsubscribeScores();
  };
}

export function saveTeam(
  teamData: Omit<Team, 'id' | 'registeredAt' | 'scores' | 'totaal'>
): Team {
  const newTeamId = `team-${Date.now()}`;
  const newTeam: Team = {
    id: newTeamId,
    name: teamData.name.trim(),
    aanvoerder: teamData.aanvoerder.trim(),
    email: teamData.email.trim().toLowerCase(),
    password: teamData.password || 'Badeend2027',
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
  setDoc(doc(db, 'teams', newTeamId), newTeam).catch((error) => {
    handleFirestoreError(error, OperationType.CREATE, `teams/${newTeamId}`);
  });

  return newTeam;
}

export function updateTeam(
  teamId: string,
  updatedData: Partial<Omit<Team, 'id' | 'registeredAt' | 'scores' | 'totaal'>>
): Team | null {
  const index = cachedTeams.findIndex((t) => t.id === teamId);
  if (index === -1) return null;

  const oldTeam = cachedTeams[index];
  const oldName = oldTeam.name;

  const updatedTeam: Team = {
    ...oldTeam,
    name: updatedData.name ? updatedData.name.trim() : oldTeam.name,
    aanvoerder: updatedData.aanvoerder ? updatedData.aanvoerder.trim() : oldTeam.aanvoerder,
    email: updatedData.email ? updatedData.email.trim().toLowerCase() : oldTeam.email,
    password: updatedData.password ? updatedData.password : oldTeam.password,
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
        setDoc(doc(db, 'scores', s.id), updatedScore, { merge: true }).catch((err) => {
          handleFirestoreError(err, OperationType.UPDATE, `scores/${s.id}`);
        });
        return updatedScore;
      }
      return s;
    });
    localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(cachedScores));
  }

  // Persist to Firestore
  setDoc(doc(db, 'teams', teamId), updatedTeam, { merge: true }).catch((error) => {
    handleFirestoreError(error, OperationType.UPDATE, `teams/${teamId}`);
  });

  // Also update active session if this team is logged in
  const activeTeam = getTeamSession();
  if (activeTeam && activeTeam.id === teamId) {
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
  setDoc(doc(db, 'scores', resultEntry.id), resultEntry).catch((error) => {
    handleFirestoreError(error, OperationType.WRITE, `scores/${resultEntry.id}`);
  });

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

// --- AUTH SESSIONS ---

export function getAdminSession(): boolean {
  try {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAdminSession(loggedIn: boolean): void {
  try {
    if (loggedIn) {
      localStorage.setItem(ADMIN_SESSION_KEY, 'true');
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
    window.dispatchEvent(new Event('badeendlympics_auth_change'));
  } catch (e) {
    console.error(e);
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
}
