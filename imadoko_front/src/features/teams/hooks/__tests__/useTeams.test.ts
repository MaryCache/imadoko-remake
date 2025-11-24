import { renderHook, waitFor } from '@testing-library/react';
import { useTeams } from '../useTeams';
import * as teamsApi from '../../api/teamsApi';
import { useToast } from '../../../../components/ui/Toast';
import type { Team } from '../../../../types';

// モック設定
jest.mock('../../api/teamsApi');
jest.mock('../../../../components/ui/Toast');
jest.mock('../../../../lib/logger');

const mockTeamsApi = teamsApi as jest.Mocked<typeof teamsApi>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;

describe('useTeams', () => {
  const mockShowToast = jest.fn();

  const mockTeams: Team[] = [
    {
      id: 1,
      teamName: 'Team A',
      players: [
        { id: 1, firstName: 'Taro', lastName: 'Yamada', position: 'WS' },
        { id: 2, firstName: 'Jiro', lastName: 'Sato', position: 'MB' },
      ],
    },
    {
      id: 2,
      teamName: 'Team B',
      players: [{ id: 3, firstName: 'Hanako', lastName: 'Tanaka', position: 'S' }],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseToast.mockReturnValue({ showToast: mockShowToast });
  });

  describe('fetchTeams', () => {
    it('チームを正常に取得できる', async () => {
      mockTeamsApi.getTeams.mockResolvedValue(mockTeams);

      const { result } = renderHook(() => useTeams());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.teams).toEqual(mockTeams);
      expect(result.current.error).toBeNull();
      expect(mockTeamsApi.getTeams).toHaveBeenCalledTimes(1);
    });

    it('取得エラー時に適切なエラーメッセージを表示', async () => {
      const error = {
        response: { status: 500 },
      };
      mockTeamsApi.getTeams.mockRejectedValue(error);

      const { result } = renderHook(() => useTeams());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('サーバーエラーが発生しました');
      expect(mockShowToast).toHaveBeenCalledWith('error', 'サーバーエラーが発生しました');
    });

    it('404エラー時に専用のエラーメッセージを表示', async () => {
      const error = {
        response: { status: 404 },
      };
      mockTeamsApi.getTeams.mockRejectedValue(error);

      const { result } = renderHook(() => useTeams());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBe('チームが見つかりませんでした');
      expect(mockShowToast).toHaveBeenCalledWith('error', 'チームが見つかりませんでした');
    });
  });

  describe('createTeam', () => {
    it('チームを正常に作成できる', async () => {
      const newTeam = {
        teamName: 'New Team',
        players: [{ id: 4, firstName: 'Test', lastName: 'User', position: 'OP' as const }],
      };

      mockTeamsApi.createTeam.mockResolvedValue(undefined);
      mockTeamsApi.getTeams.mockResolvedValue([...mockTeams, { ...newTeam, id: 3 }]);

      const { result } = renderHook(() => useTeams());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.actions.createTeam(newTeam);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockTeamsApi.createTeam).toHaveBeenCalledWith(newTeam);
      expect(mockShowToast).toHaveBeenCalledWith('success', 'チーム「New Team」を作成しました');
    });

    it('作成エラー時にエラーメッセージを表示しエラーをスロー', async () => {
      const newTeam = {
        teamName: 'New Team',
        players: [],
      };
      const error = {
        response: { data: { message: 'バリデーションエラー' } },
      };

      mockTeamsApi.createTeam.mockRejectedValue(error);

      const { result } = renderHook(() => useTeams());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await expect(result.current.actions.createTeam(newTeam)).rejects.toEqual(error);

      await waitFor(() => {
        expect(result.current.error).toBe('バリデーションエラー');
      });

      expect(mockShowToast).toHaveBeenCalledWith('error', 'バリデーションエラー');
    });
  });

  describe('updateTeam', () => {
    it('チームを正常に更新できる', async () => {
      const updatedTeam = {
        teamName: 'Updated Team',
        players: mockTeams[0].players,
      };

      mockTeamsApi.updateTeam.mockResolvedValue(undefined);
      mockTeamsApi.getTeams.mockResolvedValue([{ ...updatedTeam, id: 1 }, mockTeams[1]]);

      const { result } = renderHook(() => useTeams());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.actions.updateTeam(1, updatedTeam);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockTeamsApi.updateTeam).toHaveBeenCalledWith(1, updatedTeam);
      expect(mockShowToast).toHaveBeenCalledWith('success', 'チーム「Updated Team」を更新しました');
    });
  });

  describe('deleteTeam', () => {
    it('チームを正常に削除できる', async () => {
      mockTeamsApi.deleteTeam.mockResolvedValue(undefined);
      mockTeamsApi.getTeams.mockResolvedValue([mockTeams[1]]);

      const { result } = renderHook(() => useTeams());

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      await result.current.actions.deleteTeam(1);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockTeamsApi.deleteTeam).toHaveBeenCalledWith(1);
      expect(mockShowToast).toHaveBeenCalledWith('success', 'チームを削除しました');
    });
  });
});
