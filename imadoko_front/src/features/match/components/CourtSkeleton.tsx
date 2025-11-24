import React from 'react';

export const CourtSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 h-20" />

      <div className="p-6 space-y-6">
        {/* ScoreBoard */}
        <div className="h-24 bg-slate-100 rounded-lg" />

        <div className="space-y-4">
          {/* CourtBoard */}
          <div className="h-[320px] bg-slate-100 rounded-xl" />

          {/* Bench */}
          <div className="h-16 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
