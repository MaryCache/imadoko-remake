import React, { useCallback, memo } from 'react';
import type { Team } from '../../../types';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Users, Edit2, Trash2 } from 'lucide-react';

interface TeamListProps {
    teams: Team[];
    onEdit: (team: Team) => void;
    onDelete: (id: number) => void;
}

/**
 * TeamList - チーム一覧表示コンポーネント（メモ化）
 * 
 * @param teams - 表示するチームの配列
 * @param onEdit - 編集ボタンクリック時のコールバック
 * @param onDelete - 削除ボタンクリック時のコールバック
 */
export const TeamList: React.FC<TeamListProps> = memo(({ teams, onEdit, onDelete }) => {
    if (teams.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300" role="status">
                <Users className="mx-auto h-12 w-12 text-slate-400" aria-hidden="true" />
                <h3 className="mt-2 text-sm font-semibold text-slate-900">チームがありません</h3>
                <p className="mt-1 text-sm text-slate-500">新しいチームを作成して始めましょう。</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="チーム一覧">
            {teams.map((team) => (
                <Card key={team.id} title={team.teamName} className="hover:shadow-md transition-shadow">
                    <div className="space-y-4" role="listitem">
                        <div className="flex items-center text-slate-600">
                            <Users size={18} className="mr-2" aria-hidden="true" />
                            <span aria-label={`${team.players.length}人の選手`}>{team.players.length} 選手</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button 
                                size="sm" 
                                variant="secondary" 
                                onClick={() => onEdit(team)} 
                                className="flex-1 gap-2"
                                aria-label={`${team.teamName}を編集`}
                            >
                                <Edit2 size={14} aria-hidden="true" />
                                編集
                            </Button>
                            <Button 
                                size="sm" 
                                variant="danger" 
                                onClick={() => onDelete(team.id)} 
                                className="flex-1 gap-2"
                                aria-label={`${team.teamName}を削除`}
                            >
                                <Trash2 size={14} aria-hidden="true" />
                                削除
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
});
