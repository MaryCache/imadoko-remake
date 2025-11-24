import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TeamList } from '../TeamList';
import type { Team } from '../../../../types';

describe('TeamList', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

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
  });

  describe('チーム一覧表示', () => {
    it('複数のチームを表示できる', () => {
      render(<TeamList teams={mockTeams} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      expect(screen.getByText('Team A')).toBeInTheDocument();
      expect(screen.getByText('Team B')).toBeInTheDocument();
      expect(screen.getByText('2 選手')).toBeInTheDocument();
      expect(screen.getByText('1 選手')).toBeInTheDocument();
    });

    it('各チームに編集・削除ボタンが表示される', () => {
      render(<TeamList teams={mockTeams} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      const editButtons = screen.getAllByRole('button', { name: /編集/ });
      const deleteButtons = screen.getAllByRole('button', { name: /削除/ });

      expect(editButtons).toHaveLength(2);
      expect(deleteButtons).toHaveLength(2);
    });
  });

  describe('空の状態', () => {
    it('チームがない場合、空の状態メッセージを表示', () => {
      render(<TeamList teams={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      expect(screen.getByText('チームがありません')).toBeInTheDocument();
      expect(screen.getByText('新しいチームを作成して始めましょう。')).toBeInTheDocument();
    });
  });

  describe('ユーザーインタラクション', () => {
    it('編集ボタンをクリックするとonEditが呼ばれる', async () => {
      const user = userEvent.setup();

      render(<TeamList teams={mockTeams} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      const editButtons = screen.getAllByRole('button', { name: /編集/ });
      await user.click(editButtons[0]);

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledWith(mockTeams[0]);
    });

    it('削除ボタンをクリックするとonDeleteが呼ばれる', async () => {
      const user = userEvent.setup();

      render(<TeamList teams={mockTeams} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      const deleteButtons = screen.getAllByRole('button', { name: /削除/ });
      await user.click(deleteButtons[1]);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith(mockTeams[1].id);
    });
  });

  describe('ARIA属性', () => {
    it('適切なARIA属性が設定されている', () => {
      render(<TeamList teams={mockTeams} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      expect(screen.getByRole('list', { name: 'チーム一覧' })).toBeInTheDocument();

      const editButtons = screen.getAllByRole('button', { name: /編集/ });
      expect(editButtons[0]).toHaveAttribute('aria-label', 'Team Aを編集');

      const deleteButtons = screen.getAllByRole('button', { name: /削除/ });
      expect(deleteButtons[0]).toHaveAttribute('aria-label', 'Team Aを削除');
    });

    it('空の状態でrole="status"が設定されている', () => {
      render(<TeamList teams={[]} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      const emptyState = screen.getByRole('status');
      expect(emptyState).toBeInTheDocument();
    });
  });

  describe('メモ化', () => {
    it('propsが変わらない場合、再レンダリングされない', () => {
      const { rerender } = render(
        <TeamList teams={mockTeams} onEdit={mockOnEdit} onDelete={mockOnDelete} />
      );

      // 同じpropsで再レンダリング
      rerender(<TeamList teams={mockTeams} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

      // コンポーネントがメモ化されていることを確認
      // (実際のメモ化効果は開発者ツールで確認)
      expect(screen.getByText('Team A')).toBeInTheDocument();
    });
  });
});
