'use client';

import React from 'react';
import Image from 'next/image';
import {
  Activity,
  Users,
  RotateCw,
  AlertCircle,
  CheckCircle,
  MousePointerClick,
} from 'lucide-react';
import { POSITIONS } from '@/lib/constants';
import { PositionBadge } from '@/components/ui/PositionBadge';
import type { Position } from '@/types';

export default function GuidePage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Image
            src="/rogo_color.png"
            alt="イマドコ・ローテ ロゴ"
            width={700}
            height={200}
            priority
            className="h-auto"
          />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">使い方ガイド</h1>
        <p className="text-slate-600">イマドコ・ローテの使用方法を説明します</p>
      </div>

      {/* チーム管理セクション */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Users size={24} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">1. チーム管理</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              チームの作成
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-6">
              <li>ヘッダーの「チーム」タブをクリック</li>
              <li>「新しいチームを作成」ボタンをクリック</li>
              <li>チーム名を入力</li>
              <li>
                選手情報を入力（姓、名、ポジション）
                <div className="flex flex-col gap-1 ml-6 mt-2">
                  {POSITIONS.map((pos) => (
                    <div key={pos.value} className="flex items-center gap-2">
                      <PositionBadge position={pos.value as Position} />
                      <span className="text-sm text-slate-700">
                        {pos.value === 'WS'
                          ? 'ウイングスパイカー'
                          : pos.value === 'MB'
                            ? 'ミドルブロッカー'
                            : pos.value === 'S'
                              ? 'セッター'
                              : pos.value === 'OP'
                                ? 'オポジット（セッター対角線）'
                                : pos.value === 'Li'
                                  ? 'リベロ'
                                  : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </li>
              <li>「選手を追加」で必要な人数分追加（最大6人推奨）</li>
              <li>「保存」ボタンをクリック</li>
            </ol>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              チームの編集・削除
            </h3>
            <ul className="list-disc list-inside space-y-2 text-slate-700 ml-6">
              <li>チーム一覧から対象チームを選択</li>
              <li>「編集」ボタンで選手情報の変更が可能</li>
              <li>「削除」ボタンでチームを削除（確認あり）</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 試合シミュレーションセクション */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Activity size={24} className="text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">2. 試合シミュレーション</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              基本的な使い方
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-6">
              <li>ヘッダーの「試合」タブをクリック</li>
              <li>チームAとチームBをドロップダウンから選択</li>
              <li>各チームの選手をコートに配置（ドラッグ＆ドロップ）</li>
              <li>スコアボードでサイドアウト数・ブレイク数を入力</li>
            </ol>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <MousePointerClick size={18} className="text-indigo-600" />
              選手の配置・移動
            </h3>
            <div className="space-y-3 text-slate-700 ml-6">
              <p className="text-sm">
                <strong>ドラッグ＆ドロップ</strong>でコート/ベンチ間を自由に配置・移動できます。
              </p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>
                  <strong>移動先が空き状態のとき</strong>：選手を配置
                </li>
                <li>
                  <strong>移動先に選手がいるとき</strong>：選手を入れ替え
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
              <AlertCircle size={18} className="text-amber-600" />
              サーブ権の表示
            </h3>
            <div className="text-slate-700 ml-6 space-y-2">
              <p>
                サイドアウト数の差分でサーブ権が自動判定されます。サーブ権のあるチームの①ポジションが
                <span className="font-bold text-yellow-600">黄色</span>で光ります。
              </p>
              <p className="text-sm bg-white/70 rounded px-3 py-2 border-l-4 border-amber-400">
                <strong className="text-amber-900">📌 重要:</strong>{' '}
                <strong>チームAが最初のサーブ権チーム</strong>
                です。試合開始時はチームA側の①ポジションが光ります。
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <RotateCw size={18} className="text-blue-600" />
              初期ローテ変更機能
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-6">
              <li>「セッターローテーション」パネルを展開</li>
              <li>基準とするセッター選手を選択</li>
              <li>目標位置（S1〜S6）を選択</li>
              <li>「適用」ボタンでローテーション実行</li>
            </ol>
          </div>

          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <RotateCw size={18} className="text-red-600" />
              リセット機能
            </h3>
            <div className="space-y-2 text-slate-700 ml-6">
              <div className="flex items-start gap-2">
                <span className="font-mono text-sm bg-slate-200 px-2 py-0.5 rounded mt-0.5">
                  🔄
                </span>
                <div>
                  <strong>全リセット</strong>（上部）
                  <p className="text-sm text-slate-600">試合全体をリセット</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-sm bg-slate-200 px-2 py-0.5 rounded mt-0.5">⇆</span>
                <div>
                  <strong>サイド入替</strong>（上部）
                  <p className="text-sm text-slate-600">
                    チームA/Bの位置を入れ替え＝初期サーブ権の譲渡
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-sm bg-red-200 px-2 py-0.5 rounded mt-0.5">🔄</span>
                <div>
                  <strong>コートのリセット</strong>（コート上）
                  <p className="text-sm text-slate-600">
                    現在コートにいる選手をベンチの空き枠に戻す
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-sm bg-red-200 px-2 py-0.5 rounded mt-0.5">🔄</span>
                <div>
                  <strong>選手一覧のリセット</strong>（選手一覧上）
                  <p className="text-sm text-slate-600">
                    現在選手一覧内にいる選手の並び順を初期状態に戻す
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ヒント・コツセクション */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm border border-blue-200 p-6 space-y-4">
        <div className="flex items-center gap-3 border-b border-blue-200 pb-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <AlertCircle size={24} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">ヒント・コツ</h2>
        </div>

        <div className="space-y-3">
          <div className="bg-white/70 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2">💡 コート内番号について</h3>
            <p className="text-slate-700">
              ①〜⑥の番号はサーブ権の回って来る順番を示します。サイドアウトが発生すると、時計回りに1つずつローテーションします。
            </p>
            <p className="text-slate-700">
              基準となるセッターの存在する番号によって、S1～S6とローテ状態を呼称することが出来ます。
            </p>
          </div>

          <div className="bg-white/70 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2">💡 スコアの入力方法</h3>
            <p className="text-slate-700">
              <strong>SO（サイドアウト）</strong>: サーブを受けた側が得点
              <br />
              <strong>BR（ブレイク）</strong>: サーブを打った側が得点
              <br />
              スコアを入力すると、サーブ権が自動的に切り替わります。
            </p>
          </div>

          <div className="bg-white/70 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2">⚠️ 注意事項</h3>
            <ul className="list-disc list-inside text-slate-700 space-y-1">
              <li>
                同じチームを両サイドに選択すると警告が表示されます（シミュレーションは可能です）
              </li>
              <li>チームを跨ぐ選手の移動はできません</li>
            </ul>
          </div>
        </div>
      </section>

      {/* フッター */}
      <div className="text-center text-slate-500 text-sm pb-8">
        <p>困ったことがあれば、このページを参考にしてください。</p>
      </div>
    </div>
  );
}
