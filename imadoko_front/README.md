# イマドコ・ローテ (Imadoko Rotate) - Next.js版

バレーボールのローテーションとポジションを簡単に管理・シミュレーションできるアプリ。

React + Vite プロジェクト (`imadoko_front`) から Next.js (App Router) への移行版です。

## 技術スタック

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Headless UI, Lucide React
- **HTTP Client**: Axios
- **State Management**: React Hooks (useState, useEffect)

## 移行完了項目

✅ Tailwind CSS設定（Mikasaカラー、カスタムアニメーション）  
✅ 共通コンポーネント（Button, Input, Card, Header）  
✅ Features（match, teams）  
✅ ルーティング（App Router対応）  
✅ React Router → Next.js Navigation  
✅ 環境変数対応（VITE → NEXT_PUBLIC）  

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成（既に存在します）:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションが起動します。

## ページ構成

- `/` - 試合ページ（MatchPage）
- `/teams` - チーム管理ページ（TeamsPage）

## 使い方

### 試合シミュレーション

#### チーム選択
1. 左側（チームA）と右側（チームB）それぞれでチームを選択
2. 選手一覧が表示されます（最大14名）

#### 選手配置
**ベンチ → コート**
- 選手カードをドラッグ＆ドロップでコートの枠（1〜6番）に配置
- 空き枠：選手を配置
- 埋まっている枠：選手同士を入れ替え（入れ替えた選手は元のベンチ位置に戻る）

**コート → ベンチ**
- コートの選手カードをベンチの枠にドロップ
- 空き枠：選手を戻す
- 埋まっている枠：ベンチの選手と入れ替え（ベンチの選手がコートへ）

**ベンチ内の並び替え**
- ベンチ内で選手カードをドラッグ＆ドロップで位置を入れ替え可能

#### スコア管理
- **SO（サイドアウト）**: サーブを受けた側が得点
- **BR（ブレイク）**: サーブを打った側が得点
- サイドアウト回数に応じて自動的にローテーションが発生

#### リセット機能
- **🔄 リセット**（コート上）: コートの選手をベンチに戻す
- **🔄 リセット**（選手一覧）: ベンチ内の並び順を初期状態に戻す（コートには影響なし）
- **🔄 全リセット**（上部）: 試合全体をリセット
- **⇆ サイド入れ替え**（上部）: チームA/Bの位置を入れ替え

#### 注意事項
- 同じチームを両サイドに選択すると警告が表示されます
- コートに配置された選手はベンチ一覧から除外されます（固定14枠表示）
- チームを跨ぐ選手の移動はできません

### チーム管理

#### チームの作成
1. 「新規チーム作成」ボタンをクリック
2. チーム名、選手情報（名前、ポジション）を入力
3. 「保存」ボタンでチームを登録

#### チームの編集・削除
- 各チームカードの「編集」ボタンで選手情報を変更
- 「削除」ボタンでチームを削除（確認ダイアログあり）

## バックエンド連携

バックエンドAPI（Spring Boot）が `http://localhost:8080` で起動している必要があります。

```bash
cd ../imadoko_back
# Mavenでバックエンドを起動
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
