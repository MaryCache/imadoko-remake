import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TeamForm } from '../TeamForm';
import type { Team } from '../../../../types';
import { API_CONSTRAINTS } from '../../../../types/apiConstants';

// モック設定（実際の実装に近づける）
jest.mock('../../../../lib/sanitize', () => ({
  sanitizeTeamName: (name: string) => {
    const trimmed = name.trim().slice(0, 50);
    // HTMLエスケープの簡易版
    return trimmed.replace(/[&<>"'\/]/g, (char) => {
      const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
      };
      return map[char];
    });
  },
  sanitizePlayerName: (name: string) => {
    const trimmed = name.trim().slice(0, 30);
    return trimmed.replace(/[&<>"'\/]/g, (char) => {
      const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
      };
      return map[char];
    });
  },
  validateArrayLength: <T,>(arr: T[], maxLength: number) => arr.slice(0, maxLength),
}));

describe('TeamForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('新規作成モード', () => {
    it('空のフォームが表示される', () => {
      render(<TeamForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByLabelText('チーム名')).toHaveValue('');
      expect(
        screen.getByText(`選手 (6/${API_CONSTRAINTS.MAX_PLAYERS_PER_TEAM})`)
      ).toBeInTheDocument();
    });

    it('チーム名と選手情報を入力して送信できる', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      render(<TeamForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      // チーム名を入力
      const teamNameInput = screen.getByLabelText('チーム名');
      await user.clear(teamNameInput);
      await user.type(teamNameInput, 'Test Team');

      // 余分な選手を削除（初期6人 → 1人に減らす）
      const deleteButtons = screen.getAllByTitle('選手を削除');
      for (let i = 0; i < 5; i++) {
        await user.click(deleteButtons[i]);
      }

      // 残った1人の選手情報を入力
      const playerInputs = screen.getAllByPlaceholderText('姓');
      await user.clear(playerInputs[0]);
      await user.type(playerInputs[0], 'Yamada');

      const firstNameInputs = screen.getAllByPlaceholderText('名');
      await user.clear(firstNameInputs[0]);
      await user.type(firstNameInputs[0], 'Taro');

      // フォーム送信
      await user.click(screen.getByRole('button', { name: /チームを保存/ }));

      // onSubmitが呼ばれることを確認
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });

      // 1人だけ入力したので、validPlayersは1人のみ
      const submittedData = mockOnSubmit.mock.calls[0][0];
      expect(submittedData.teamName).toBe('Test Team');
      expect(submittedData.players).toHaveLength(1);
      expect(submittedData.players[0]).toMatchObject({
        lastName: 'Yamada',
        firstName: 'Taro',
        position: 'WS',
      });
    });

    it('チーム名が空の場合エラーメッセージを表示', async () => {
      const user = userEvent.setup();

      render(<TeamForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      // 余分な選手を削除（初期6人 → 1人に減らす）
      const deleteButtons = screen.getAllByTitle('選手を削除');
      for (let i = 0; i < 5; i++) {
        await user.click(deleteButtons[i]);
      }

      // 1人目の選手だけ入力してチーム名は空のまま
      const playerInputs = screen.getAllByPlaceholderText('姓');
      await user.clear(playerInputs[0]);
      await user.type(playerInputs[0], 'Yamada');

      const firstNameInputs = screen.getAllByPlaceholderText('名');
      await user.clear(firstNameInputs[0]);
      await user.type(firstNameInputs[0], 'Taro');

      // チーム名入力フィールドを明示的に空にする
      const teamNameInput = screen.getByLabelText('チーム名');
      await user.clear(teamNameInput);

      const submitButton = screen.getByRole('button', { name: /チームを保存/ });
      await user.click(submitButton);

      // エラーメッセージが表示されるまで待つ
      await waitFor(() => {
        expect(screen.getByText('チーム名を入力してください')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('選手が1人も登録されていない場合エラーメッセージを表示', async () => {
      const user = userEvent.setup();

      render(<TeamForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const teamNameInput = screen.getByLabelText('チーム名');
      await user.clear(teamNameInput);
      await user.type(teamNameInput, 'Test Team');

      // 全選手を削除（初期6人 → 0人）
      // 削除ボタンが1つずつ減るので、毎回最初のボタンをクリック
      for (let i = 0; i < 6; i++) {
        const deleteButtons = screen.queryAllByTitle('選手を削除');
        if (deleteButtons.length > 1) {
          await user.click(deleteButtons[0]);
        }
      }

      // 選手が0人の状態で送信
      const submitButton = screen.getByRole('button', { name: /チームを保存/ });
      await user.click(submitButton);

      // エラーメッセージが表示されるまで待つ
      await waitFor(() => {
        expect(screen.getByText('少なくとも1人の選手を登録してください')).toBeInTheDocument();
      });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('編集モード', () => {
    const mockTeam: Team = {
      id: 1,
      teamName: 'Existing Team',
      players: [
        { id: 1, firstName: 'Taro', lastName: 'Yamada', position: 'WS' },
        { id: 2, firstName: 'Jiro', lastName: 'Sato', position: 'MB' },
      ],
    };

    it('既存データがフォームに表示される', () => {
      render(<TeamForm initialData={mockTeam} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByLabelText('チーム名')).toHaveValue('Existing Team');
      expect(screen.getByDisplayValue('Yamada')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Taro')).toBeInTheDocument();
      expect(
        screen.getByText(`選手 (2/${API_CONSTRAINTS.MAX_PLAYERS_PER_TEAM})`)
      ).toBeInTheDocument();
    });

    it('データを編集して送信できる', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);

      render(<TeamForm initialData={mockTeam} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const teamNameInput = screen.getByLabelText('チーム名');
      await user.clear(teamNameInput);
      await user.type(teamNameInput, 'Updated Team');

      const submitButton = screen.getByRole('button', { name: /チームを保存/ });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalled();
      });

      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          teamName: 'Updated Team',
          players: expect.arrayContaining([
            expect.objectContaining({
              lastName: 'Yamada',
              firstName: 'Taro',
              position: 'WS',
            }),
            expect.objectContaining({
              lastName: 'Sato',
              firstName: 'Jiro',
              position: 'MB',
            }),
          ]),
        })
      );
    });
  });

  describe('選手の追加・削除', () => {
    it('選手を追加できる', async () => {
      const user = userEvent.setup();

      render(<TeamForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(
        screen.getByText(`選手 (6/${API_CONSTRAINTS.MAX_PLAYERS_PER_TEAM})`)
      ).toBeInTheDocument();

      const addButton = screen.getByText('選手を追加');
      await user.click(addButton);

      expect(
        screen.getByText(`選手 (7/${API_CONSTRAINTS.MAX_PLAYERS_PER_TEAM})`)
      ).toBeInTheDocument();
    });

    it('選手を削除できる', async () => {
      const user = userEvent.setup();

      render(<TeamForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(
        screen.getByText(`選手 (6/${API_CONSTRAINTS.MAX_PLAYERS_PER_TEAM})`)
      ).toBeInTheDocument();

      const deleteButtons = screen.getAllByTitle('選手を削除');
      await user.click(deleteButtons[0]);

      expect(
        screen.getByText(`選手 (5/${API_CONSTRAINTS.MAX_PLAYERS_PER_TEAM})`)
      ).toBeInTheDocument();
    });

    it('14人に達すると追加ボタンが非表示になる', async () => {
      const user = userEvent.setup();

      render(<TeamForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const addButton = screen.getByText('選手を追加');

      // 8回クリックして合計14人にする（初期6人 + 8人）
      for (let i = 0; i < 8; i++) {
        await user.click(addButton);
      }

      expect(
        screen.getByText(
          `選手 (${API_CONSTRAINTS.MAX_PLAYERS_PER_TEAM}/${API_CONSTRAINTS.MAX_PLAYERS_PER_TEAM})`
        )
      ).toBeInTheDocument();
      expect(screen.queryByText('選手を追加')).not.toBeInTheDocument();
    });
  });

  describe('キャンセル処理', () => {
    it('キャンセルボタンをクリックするとonCancelが呼ばれる', async () => {
      const user = userEvent.setup();

      render(<TeamForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const cancelButton = screen.getByText('キャンセル');
      await user.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('エラーハンドリング', () => {
    it('送信エラー時にエラーメッセージを表示', async () => {
      const user = userEvent.setup();
      const error = {
        response: {
          data: { message: 'サーバーエラー' },
        },
      };
      mockOnSubmit.mockRejectedValue(error);

      render(<TeamForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const teamNameInput = screen.getByLabelText('チーム名');
      await user.clear(teamNameInput);
      await user.type(teamNameInput, 'Test Team');

      // 余分な選手を削除（初期6人 → 1人に減らす）
      const deleteButtons = screen.getAllByTitle('選手を削除');
      for (let i = 0; i < 5; i++) {
        await user.click(deleteButtons[i]);
      }

      // 残った1人の選手情報を入力
      const playerInputs = screen.getAllByPlaceholderText('姓');
      await user.clear(playerInputs[0]);
      await user.type(playerInputs[0], 'Yamada');

      const firstNameInputs = screen.getAllByPlaceholderText('名');
      await user.clear(firstNameInputs[0]);
      await user.type(firstNameInputs[0], 'Taro');

      const submitButton = screen.getByRole('button', { name: /チームを保存/ });
      await user.click(submitButton);

      // エラーメッセージが表示されるまで待つ
      await waitFor(() => {
        expect(screen.getByText('サーバーエラー')).toBeInTheDocument();
      });
    });
  });
});
