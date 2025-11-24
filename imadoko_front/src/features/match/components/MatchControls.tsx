import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';

interface MatchControlsProps {
  onSwapSides: () => void;
  onResetAll: () => void;
}

/**
 * MatchControls - 試合コントロールボタン
 * サイド入れ替えと試合リセット機能を提供
 */
export const MatchControls: React.FC<MatchControlsProps> = ({ onSwapSides, onResetAll }) => {
  const [spin, setSpin] = useState(false);
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h1 className="text-2xl font-bold text-slate-900">試合シミュレーション</h1>
      <div className="flex items-center gap-3">
        <Button variant="secondary" onClick={onSwapSides} className="gap-2">
          <ArrowLeftRight size={16} />
          サイド入れ替え
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            setSpin(true);
            onResetAll();
            setTimeout(() => setSpin(false), 600);
          }}
          className="gap-2"
        >
          <RefreshCw size={16} />
          試合リセット
        </Button>
      </div>
    </div>
  );
};
