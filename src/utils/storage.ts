import { Team, ScoreEntry, SpelId } from '../types';
import { INITIAL_TEAMS, INITIAL_SCORES, SPELEN } from '../data/mockData';

const TEAMS_STORAGE_KEY = 'badeendlympics_teams_v3';
const SCORES_STORAGE_KEY = 'badeendlympics_scores_v3';

export function getStoredTeams(): Team[] {
  try {
    const raw = localStorage.getItem(TEAMS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TEAMS_STORAGE_KEY, JSON.stringify(INITIAL_TEAMS));
      return INITIAL_TEAMS;
    }
    return JSON.parse(raw);
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
    email: teamData.email.trim(),
    members: teamData.members.filter((m) => m.trim().length > 0),
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

  window.dispatchEvent(new Event('badeendlympics_data_change'));
}

export function saveOrUpdateScore(teamName: string, spelId: SpelId, points: number): ScoreEntry {
  const currentScores = getStoredScores();
  const spel = SPELEN.find((s) => s.id === spelId);
  const spelName = spel ? spel.name : spelId;

  // Check if score exists for this team & game
  const existingIndex = currentScores.findIndex(
    (s) =>
      s.teamName.trim().toLowerCase() === teamName.trim().toLowerCase() &&
      s.spelId === spelId
  );

  let resultEntry: ScoreEntry;

  if (existingIndex >= 0) {
    const updated = [...currentScores];
    updated[existingIndex] = {
      ...updated[existingIndex],
      points,
      updatedAt: new Date().toISOString(),
    };
    resultEntry = updated[existingIndex];
    localStorage.setItem(SCORES_STORAGE_KEY, JSON.stringify(updated));
  } else {
    resultEntry = {
      id: `score-${Date.now()}`,
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
