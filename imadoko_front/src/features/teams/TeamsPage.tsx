'use client';

import React, { useState, useCallback } from 'react';
import { useTeams } from './hooks/useTeams';
import { TeamList } from './components/TeamList';
import { TeamForm } from './components/TeamForm';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { TeamCardSkeleton } from '../../components/ui/Skeleton';
import { ErrorMessage } from '../../components/ui/ErrorMessage';
import { Plus, Users } from 'lucide-react';
import type { Team } from '../../types';

export const TeamsPage: React.FC = () => {
    const { teams, isLoading, error, actions } = useTeams();
    const [isCreating, setIsCreating] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team | null>(null);

    const handleCreate = useCallback(async (data: Omit<Team, 'id'>) => {
        await actions.createTeam(data);
        setIsCreating(false);
    }, [actions]);

    const handleUpdate = useCallback(async (data: Omit<Team, 'id'>) => {
        if (editingTeam) {
            await actions.updateTeam(editingTeam.id, data);
            setEditingTeam(null);
        }
    }, [editingTeam, actions]);

    const handleDelete = useCallback(async (id: number) => {
        if (window.confirm('このチームを削除してもよろしいですか？')) {
            await actions.deleteTeam(id);
        }
    }, [actions]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">チーム管理</h1>
                {!isCreating && !editingTeam && (
                    <Button onClick={() => setIsCreating(true)} className="group">
                        <Plus size={18} className="mr-1 transition-transform duration-300 group-hover:rotate-90" />
                        新しいチームを作成
                    </Button>
                )}
            </div>

            {/* ローディング状態 */}
            {isLoading && teams.length === 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <TeamCardSkeleton />
                    <TeamCardSkeleton />
                    <TeamCardSkeleton />
                </div>
            )}

            {/* エラー状態 */}
            {error && !isLoading && (
                <ErrorMessage message={error} onRetry={actions.fetchTeams} />
            )}

            {/* メインコンテンツ */}
            {!isLoading && !error && (
                <>
                    {isCreating ? (
                        <TeamForm
                            onSubmit={handleCreate}
                            onCancel={() => setIsCreating(false)}
                        />
                    ) : editingTeam ? (
                        <TeamForm
                            initialData={editingTeam}
                            onSubmit={handleUpdate}
                            onCancel={() => setEditingTeam(null)}
                        />
                    ) : teams.length === 0 ? (
                        <EmptyState
                            icon={Users}
                            title="チームがまだありません"
                            description="最初のチームを作成して、選手を登録しましょう。チームを作成すると試合でのローテーション管理が可能になります。"
                            action={{
                                label: '+ 新しいチームを作成',
                                onClick: () => setIsCreating(true),
                            }}
                        />
                    ) : (
                        <TeamList
                            teams={teams}
                            onEdit={setEditingTeam}
                            onDelete={handleDelete}
                        />
                    )}
                </>
            )}
        </div>
    );
};
