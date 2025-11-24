import { useState, useEffect, useCallback } from 'react';
import type { Team } from '../../../types';
import { ApiError } from '../../../types/api';
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
      if (err instanceof ApiError) {
        const errorMsg = err.message || 'チームの取得に失敗しました';
        setError(errorMsg);
        showToast('error', errorMsg);
        logger.error('Error fetching teams', err);
      } else {
        const errorMsg = 'ネットワークエラーが発生しました';
        setError(errorMsg);
        showToast('error', errorMsg);
        logger.error('Network error fetching teams', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const createTeam = async (team: Omit<Team, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      await teamsApi.createTeam(team);
      await fetchTeams();
      showToast('success', `チーム「${team.teamName}」を作成しました`);
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.code) {
          case 'E102':
            setError('チーム名が重複しています');
            showToast('error', 'チーム名が重複しています');
            break;
          case 'E400':
            setError('入力内容を確認してください');
            showToast('error', '入力内容を確認してください');
            if (err.details.length > 0) {
              logger.warn('Validation errors:', err.details);
            }
            break;
          default:
            setError(err.message || '予期せぬエラーが発生しました');
            showToast('error', err.message || '予期せぬエラーが発生しました');
        }
        logger.error('Error creating team', err);
      } else {
        setError('ネットワークエラーが発生しました');
        showToast('error', 'ネットワークエラーが発生しました');
        logger.error('Network error creating team', err);
      }
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
      if (err instanceof ApiError) {
        switch (err.code) {
          case 'E102':
            setError('チーム名が重複しています');
            showToast('error', 'チーム名が重複しています');
            break;
          case 'E101':
            setError('指定されたチームが見つかりません');
            showToast('error', '指定されたチームが見つかりません');
            break;
          case 'E400':
            setError('入力内容を確認してください');
            showToast('error', '入力内容を確認してください');
            if (err.details.length > 0) {
              logger.warn('Validation errors:', err.details);
            }
            break;
          default:
            setError(err.message || '予期せぬエラーが発生しました');
            showToast('error', err.message || '予期せぬエラーが発生しました');
        }
        logger.error('Error updating team', err);
      } else {
        setError('ネットワークエラーが発生しました');
        showToast('error', 'ネットワークエラーが発生しました');
        logger.error('Network error updating team', err);
      }
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
      if (err instanceof ApiError) {
        switch (err.code) {
          case 'E101':
            setError('指定されたチームが見つかりません');
            showToast('error', '指定されたチームが見つかりません');
            break;
          default:
            setError(err.message || '予期せぬエラーが発生しました');
            showToast('error', err.message || '予期せぬエラーが発生しました');
        }
        logger.error('Error deleting team', err);
      } else {
        setError('ネットワークエラーが発生しました');
        showToast('error', 'ネットワークエラーが発生しました');
        logger.error('Network error deleting team', err);
      }
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
