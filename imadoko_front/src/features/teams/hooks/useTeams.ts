import { useState, useEffect, useCallback } from 'react';
import type { Team, ApiError } from '../../../types';
import * as teamsApi from '../api/teamsApi';
import { useToast } from '../../../components/ui/Toast';
import { logger } from '../../../lib/logger';

export const useTeams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchTeams = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      logger.debug('Fetching teams from:', process.env.NEXT_PUBLIC_API_URL);
      const data = await teamsApi.getTeams();
      logger.info('Teams fetched successfully', { count: data.length });
      setTeams(data);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMsg =
        apiError?.response?.status === 404
          ? 'チームが見つかりませんでした'
          : (apiError?.response?.status ?? 0) >= 500
            ? 'サーバーエラーが発生しました'
            : 'チームの取得に失敗しました';
      setError(errorMsg);
      showToast('error', errorMsg);
      logger.error('Error fetching teams', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTeam = async (team: Omit<Team, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      await teamsApi.createTeam(team);
      await fetchTeams();
      showToast('success', `チーム「${team.teamName}」を作成しました`);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMsg = apiError?.response?.data?.message || 'チームの作成に失敗しました';
      setError(errorMsg);
      showToast('error', errorMsg);
      logger.error('Error creating team', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTeam = async (id: number, team: Omit<Team, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      await teamsApi.updateTeam(id, team);
      await fetchTeams();
      showToast('success', `チーム「${team.teamName}」を更新しました`);
    } catch (err) {
      const apiError = err as ApiError;
      const errorMsg = apiError?.response?.data?.message || 'チームの更新に失敗しました';
      setError(errorMsg);
      showToast('error', errorMsg);
      logger.error('Error updating team', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTeam = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      await teamsApi.deleteTeam(id);
      await fetchTeams();
      showToast('success', 'チームを削除しました');
    } catch (err) {
      const apiError = err as ApiError;
      const errorMsg = apiError?.response?.data?.message || 'チームの削除に失敗しました';
      setError(errorMsg);
      showToast('error', errorMsg);
      logger.error('Error deleting team', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    teams,
    isLoading,
    error,
    actions: {
      fetchTeams,
      createTeam,
      updateTeam,
      deleteTeam,
    },
  };
};
