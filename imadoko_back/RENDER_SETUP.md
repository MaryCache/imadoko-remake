# Render Deployment Guide for Imadoko Backend

このドキュメントは、`imadoko_back` (Spring Boot) を Render の無料枠 (Free Tier) にデプロイするための設定指針と手順書です。

## 1. 前提条件と構成

*   **Runtime**: Docker
*   **Database**: Render Managed PostgreSQL (Free)
*   **Build Context**: プロジェクトルート (`.`)
    *   `openapi.yaml` がルートにあるため、ビルドコンテキストはルートである必要があります。

## 2. PostgreSQL データベースの作成

まず、バックエンドが接続するデータベースを作成します。

1.  Render Dashboard で **[New +]** -> **[PostgreSQL]** を選択。
2.  **Name**: `imadoko-db` (任意)
3.  **Database**: `imadoko`
4.  **User**: `imadoko_user` (任意)
5.  **Region**: `Singapore (Southeast Asia)` (日本から近い推奨リージョン)
6.  **Instance Type**: **Free**
7.  **Create Database** をクリック。

作成完了後、**Internal DB URL** をコピーしておきます（後で環境変数 `DB_URL` として使用）。
※ パスワードも控えておいてください。

## 3. Web Service (Spring Boot) の作成

1.  Render Dashboard で **[New +]** -> **[Web Service]** を選択。
2.  GitHub リポジトリ `imadoko-remake` を連携・選択。
3.  以下の設定を入力します：

| 項目 | 設定値 | 備考 |
| :--- | :--- | :--- |
| **Name** | `imadoko-backend` | 任意 |
| **Region** | `Singapore` | DBと同じリージョンにする |
| **Branch** | `main` | |
| **Root Directory** | (空欄) | デフォルトのルート (`.`) |
| **Runtime** | **Docker** | |
| **Instance Type** | **Free** | |

### ⚠️ 重要な Docker 設定 (Advanced)

画面下の **[Advanced]** セクションを開き、以下を必ず設定してください。

| 項目 | 設定値 | 理由 |
| :--- | :--- | :--- |
| **Dockerfile Path** | `imadoko_back/Dockerfile` | Dockerfileの場所を指定 |
| **Docker Build Context Directory** | `.` | ルートにある `openapi.yaml` を参照するため |
| **Health Check Path** | `/actuator/health` | Spring Boot Actuator のヘルスチェック |
| **Auto-Deploy** | **Yes** | |

## 4. 環境変数の設定 (Environment Variables)

**[Environment]** タブで以下の変数を追加します。

| Key | Value (例) | 説明 |
| :--- | :--- | :--- |
| `DB_URL` | `jdbc:postgresql://hostname:5432/imadoko` | **Internal DB URL** の先頭を `postgres://` から `jdbc:postgresql://` に書き換えて設定してください。 |
| `DB_USERNAME` | `imadoko_user` | DB作成時のユーザー名 |
| `DB_PASSWORD` | (DBパスワード) | DB作成時のパスワード |
| `CORS_ALLOWED_ORIGINS` | `https://imadoko-remake.vercel.app` | フロントエンドの本番URL (カンマ区切りで複数可) |
| `JAVA_TOOL_OPTIONS` | `-XX:MaxRAMPercentage=75.0` | **(重要)** メモリ制限対策。Dockerfileにも追記しましたが、念のため環境変数でも指定推奨。 |

> [!IMPORTANT]
> **DB_URL の注意点**:
> Render の Internal DB URL は `postgres://user:pass@host/db` の形式ですが、Spring Boot (JDBC) は `jdbc:postgresql://host:port/db` の形式を期待します。
> ユーザー名とパスワードは個別の環境変数 (`DB_USERNAME`, `DB_PASSWORD`) で渡す構成にしているため、`DB_URL` には認証情報を含めず、プロトコルを修正して設定してください。
>
> **例**:
> 元: `postgres://imadoko_user:xyz@dpg-xxxx-a:5432/imadoko`
> ↓
> 設定値: `jdbc:postgresql://dpg-xxxx-a:5432/imadoko`

## 5. 無料枠の注意点と対策

### 1. スリープとコールドスタート
*   **現象**: Render Free プランの Web Service は、15分間アクセスがないとスリープします。次のアクセス時に再起動しますが、Spring Boot は起動に 30秒〜1分程度かかる場合があります。
*   **対策**:
    *   **許容する**: 個人開発やポートフォリオなら「最初のアクセスは遅いです」と明記して許容するのが最もコストがかかりません。
    *   **Uptime Robot (非推奨)**: 定期的にアクセスしてスリープを防ぐ方法がありますが、Render の規約や無料枠のリソース消費（CPU時間制限）に抵触する可能性があるため推奨しません。
    *   **有料化**: 月額 $7 の Starter プランにすればスリープしません。

### 2. メモリ制限 (512MB)
*   **現象**: Spring Boot はメモリ消費量が多いため、512MB ギリギリだと OOM Kill (Out of Memory) で強制終了することがあります。
*   **対策**:
    *   `Dockerfile` に `-XX:MaxRAMPercentage=75.0` を追加しました（適用済み）。これにより、コンテナのメモリ上限の75%（約384MB）をヒープ領域として使い、残りを非ヒープ領域に残すことで安定させます。

### 3. ディスクは揮発性
*   **現象**: コンテナ再起動時にファイルシステムへの変更はリセットされます。
*   **対策**:
    *   このアプリは画像アップロード機能などがなく、データは全て DB に保存するため問題ありません。ログも標準出力 (`docker logs`) に出ているため Render のログ画面で見れます。

## 6. トラブルシューティング

*   **起動しない (Health Check 失敗)**:
    *   ログを確認してください。`Connection refused` なら DB 接続設定 (`DB_URL`) が間違っています。
    *   `OOM Killed` ならメモリ不足です。`JAVA_TOOL_OPTIONS` が効いているか確認してください。
*   **CORS エラー**:
    *   ブラウザのコンソールを確認し、`CORS_ALLOWED_ORIGINS` に設定した URL が正しいか（末尾の `/` なし、`https://` あり）確認してください。
