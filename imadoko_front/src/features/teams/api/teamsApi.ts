import { api } from '../../../lib/axios';
import type { Team } from '../../../types';

export const getTeams = async (): Promise<Team[]> => {
  const response = await api.get<Team[]>('/teams');
  return response.data;
};

export const createTeam = async (team: Omit<Team, 'id'>): Promise<Team> => {
  const response = await api.post<Team>('/teams', team);
  return response.data;
};

export const updateTeam = async (id: number, team: Omit<Team, 'id'>): Promise<Team> => {
  const response = await api.put<Team>(`/teams/${id}`, team);
  return response.data;
};

export const deleteTeam = async (id: number): Promise<void> => {
  await api.delete(`/teams/${id}`);
};
