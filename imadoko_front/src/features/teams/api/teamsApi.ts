import { apiClient } from '../../../lib/apiClient';
import type { Team } from '../../../types';

export const getTeams = async (): Promise<Team[]> => {
  return apiClient.get<Team[]>('/teams');
};

export const createTeam = async (team: Omit<Team, 'id'>): Promise<Team> => {
  return apiClient.post<Team>('/teams', team);
};

export const updateTeam = async (id: number, team: Omit<Team, 'id'>): Promise<Team> => {
  return apiClient.put<Team>(`/teams/${id}`, team);
};

export const deleteTeam = async (id: number): Promise<void> => {
  return apiClient.delete<void>(`/teams/${id}`);
};
