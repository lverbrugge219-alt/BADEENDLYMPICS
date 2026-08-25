import { Team, ScoreEntry, SpelId } from '../types';
import { INITIAL_TEAMS, INITIAL_SCORES, SPELEN, ADMIN_CREDENTIALS } from '../data/mockData';

const TEAMS_STORAGE_KEY = 'badeendlympics_teams_v4';
const SCORES_STORAGE_KEY = 'badeendlympics_scores_v4';
const ADMIN_SESSION_KEY = 'badeendlympics_admin_session';
const TEAM_SESSION_KEY = 'badeendlympics_team_session';

export function getStoredTeams(): Team[] {
  try {
    const raw = localStorage.getItem(TEAMS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(INITIAL_TEAMS));
      return INITIAL_TEAMS;
    }
    const parsed: Team[] = JSON.parse(raw);
    // Ensure all teams have valid data
    return parsed.map((t) => ({
      ...t,
      password: t.password || 'Badeend2027',
    }));
  } catch {
    return INITIAL_TEAMS;
  }
}

export function getStoredScores(): ScoreEntry[] {
  try {
    const raw = localStorage.getItem(SCORES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(INITIAL_SCORES));
      return INITIAL_SCORES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SCORES;
  }
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

export function saveTeam(teamData: Omit<Team, 'id' | 'registeredAt' | 'scores' | 'totaal'>): Team {
  const currentTeams = getStoredTeams();

  const newTeam: Team = {
    id: `team-${Date.now()}`,
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

  const updatedTeams = [newTeam, ...currentTeams];
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(updatedTeams));
  window.dispatchEvent(new Event('badeendlympics_data_change'));
  return newTeam;
}

export function updateTeam(
  teamId: string,
  updatedData: Partial<Omit<Team, 'id' | 'registeredAt' | 'scores' | 'totaal'>>
): Team | null {
  const currentTeams = getStoredTeams();
  const index = currentTeams.findIndex((t) => t.id === teamId);
  if (index === -1) return null;

  const oldTeam = currentTeams[index];
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

  currentTeams[index] = updatedTeam;
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(currentTeams));

  // If team name changed, update the name in scores
  if (updatedData.name && updatedData.name.trim().toLowerCase() !== oldName.trim().toLowerCase()) {
    const currentScores = getStoredScores();
    const newName = updatedData.name.trim();
    const updatedScores = currentScores.map((s) => {
      if (s.teamId === teamId || s.teamName.trim().toLowerCase() === oldName.trim().toLowerCase()) {
        return {
          ...s,
          teamId,
          teamName: newName,
        };
      }
      return s;
    });
    localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(updatedScores));
  }

  // Also update active session if this team is logged in
  const activeTeam = getTeamSession();
  if (activeTeam && activeTeam.id === teamId) {
    setTeamSession(updatedTeam);
  }

  window.dispatchEvent(new Event('badeendlympics_data_change'));
  return updatedTeam;
}

export function deleteTeam(teamId: string): void {
  const currentTeams = getStoredTeams();
  const teamToDelete = currentTeams.find((t) => t.id === teamId);
  const updatedTeams = currentTeams.filter((t) => t.id !== teamId);
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(updatedTeams));

  // Also remove scores for this team
  if (teamToDelete) {
    const currentScores = getStoredScores();
    const updatedScores = currentScores.filter(
      (s) =>
        s.teamId !== teamId &&
        s.teamName.trim().toLowerCase() !== teamToDelete.name.trim().toLowerCase()
    );
    localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(updatedScores));
  }

  // If this team was logged in, log them out
  const activeTeam = getTeamSession();
  if (activeTeam && activeTeam.id === teamId) {
    setTeamSession(null);
  }

  window.dispatchEvent(new Event('badeendlympics_data_change'));
}

export function saveOrUpdateScore(teamName: string, spelId: SpelId, points: number): ScoreEntry {
  const currentScores = getStoredScores();
  const currentTeams = getStoredTeams();
  const matchingTeam = currentTeams.find(
    (t) => t.name.trim().toLowerCase() === teamName.trim().toLowerCase()
  );

  const spel = SPELEN.find((s) => s.id === spelId);
  const spelName = spel ? spel.name : spelId;

  // Check if score exists for this team & game
  const existingIndex = currentScores.findIndex(
    (s) =>
      (s.teamName.trim().toLowerCase() === teamName.trim().toLowerCase() ||
        (matchingTeam && s.teamId === matchingTeam.id)) &&
      s.spelId === spelId
  );

  let resultEntry: ScoreEntry;

  if (existingIndex >= 0) {
    const updated = [...currentScores];
    updated[existingIndex] = {
      ...updated[existingIndex],
      teamId: matchingTeam ? matchingTeam.id : updated[existingIndex].teamId,
      teamName: teamName.trim(),
      points,
      updatedAt: new Date().toISOString(),
    };
    resultEntry = updated[existingIndex];
    localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(updated));
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
    const updated = [resultEntry, ...currentScores];
    localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(updated));
  }

  window.dispatchEvent(new Event('badeendlympics_data_change'));
  return resultEntry;
}

export function deleteScore(scoreId: string): void {
  const currentScores = getStoredScores();
  const updated = currentScores.filter((s) => s.id !== scoreId);
  localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('badeendlympics_data_change'));
}

export function resetAllData(): void {
  localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(INITIAL_TEAMS));
  localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(INITIAL_SCORES));
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
    // Refresh latest team data from storage
    const all = getStoredTeams();
    const fresh = all.find((t) => t.id === sessionTeam.id);
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
