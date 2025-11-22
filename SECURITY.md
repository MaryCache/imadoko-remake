# セキュリティ対策実装ガイド

このドキュメントでは、イマドコ・ローテプロジェクトに実装されたセキュリティ対策について説明します。

## 実装済みのセキュリティ対策

### ✅ 1. XSS（クロスサイトスクリプティング）対策

#### フロントエンド
**ファイル**: 
- `imadoko_next/src/lib/sanitize.ts` - サニタイゼーション関数
- `imadoko_next/src/lib/xssHelpers.tsx` - XSS検証ヘルパー
- `imadoko_next/src/components/ui/Input.tsx` - リアルタイムバリデーション

**実装内容**:
- **入力サニタイゼーション**: HTMLタグと危険な文字をエスケープ
- **バリデーション関数**:
  - `sanitizeTeamName()` - 最大50文字、危険な文字をエスケープ
  - `sanitizePlayerName()` - 最大30文字、危険な文字をエスケープ
  - `sanitizePosition()` - 許可されたポジション（S, WS, MB, OP, L）のみ受け付け
  - `sanitizeNumber()` - 数値範囲チェック
  - `validateArrayLength()` - 配列の長さ制限（大量データ送信防止）
- **開発環境でのXSS検証**: 危険なパターン（`<script>`, `javascript:`, `onerror=`等）を検出してコンソール警告
- **Inputコンポーネント**: 入力時にリアルタイムでXSSパターンをチェック（開発環境のみ）

**適用箇所**: 
- `TeamForm.tsx` - チーム/選手情報送信時に自動サニタイゼーション、maxLength制限
- 全てのInputコンポーネント - 自動的にXSS検証が有効

#### バックエンド
**ファイル**: 
- `Team.java` - Jakarta Validationアノテーション
- `Player.java` - Jakarta Validationアノテーション
- `TeamRequest.java` - DTOバリデーション
- `PlayerRequest.java` - DTOバリデーション
- `TeamController.java` - `@Valid`アノテーションとエラーハンドリング

**制約**:
- チーム名: 必須、最大50文字
- 選手名（姓/名）: 必須、最大30文字
- ポジション: 必須、正規表現パターン `^(S|WS|MB|OP|L)$`
- 選手数: 最大14人

---

### ✅ 2. レート制限（Rate Limiting）

**ファイル**: `imadoko_next/src/lib/axios.ts`

**実装内容**:
- `RateLimiter`クラスによるリクエスト制限
- 制限: **1秒あたり最大10リクエスト**
- キュー管理による順次処理
- axiosインターセプターで自動適用

**目的**: API過負荷防止、DoS攻撃対策

---

### ✅ 3. CORS（クロスオリジンリソース共有）設定

**ファイル**: 
- `imadoko_back/src/main/java/com/c/imadoko/imadoko_back/config/WebConfig.java`
- `application.properties`

**設定内容**:
```properties
app.cors.allowed-origins=http://localhost:5173,http://localhost:4173,http://localhost:3000
```

- 許可メソッド: GET, POST, PUT, DELETE, OPTIONS
- 認証情報: 許可 (`allowCredentials: true`)
- プリフライトキャッシュ: 3600秒

**本番環境**: 環境変数 `APP_CORS_ALLOWED_ORIGINS` で本番ドメインを設定

---

### ✅ 4. 環境変数管理

**ファイル**: 
- `imadoko_next/.env.local.example` - テンプレート
- `imadoko_next/.gitignore` - `.env*` を除外

**設定方法**:
1. `.env.local.example`を`.env.local`にコピー
2. 環境固有の値を設定
3. `.env.local`はGitにコミットしない

**例**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

---

### ✅ 5. エラーハンドリング強化

**ファイル**: 
- `imadoko_next/src/lib/axios.ts` - axiosインターセプター
- `imadoko_next/src/features/teams/hooks/useTeams.ts` - Toast通知統合
- `imadoko_next/src/features/teams/TeamsPage.tsx` - LoadingSpinner/ErrorMessage
- `imadoko_next/src/features/match/MatchPage.tsx` - LoadingSpinner/ErrorMessage
- `imadoko_next/src/features/teams/components/TeamForm.tsx` - フォームエラー表示

**実装内容**:
- **axiosレスポンスインターセプター**: サーバーエラー（4xx, 5xx）のロギング、ネットワークエラー検出
- **Toast通知**: 成功・エラー時に自動的にユーザーフィードバック表示
  - チーム作成成功: 「チーム〇〇を作成しました」
  - チーム更新成功: 「チーム〇〇を更新しました」
  - チーム削除成功: 「チームを削除しました」
  - エラー時: サーバーからのエラーメッセージまたはフォールバックメッセージ
- **LoadingSpinner**: データ取得中の視覚的フィードバック
- **ErrorMessage**: エラー時の再試行ボタン付きエラー表示
- **フォームバリデーション**: 
  - チーム名必須チェック
  - 選手最小人数チェック（1人以上）
  - エラーメッセージの明示的表示
- **タイムアウト設定**: 10秒

**ユーザー体験の改善**:
- ローディング中はスピナー表示でユーザーに進行状況を通知
- エラー時は具体的なメッセージと再試行ボタンで復旧を支援
- 成功時はToastで即座にフィードバック（3秒後自動消去）

---

## ⚠️ 実装していないセキュリティ対策

### ❌ CSRF（クロスサイトリクエストフォージェリ）対策

**理由**: 
- Spring Securityが未導入
- `spring-boot-starter-security`依存関係が`pom.xml`に含まれていない

**将来的な実装時の対応**:
1. Spring Security依存関係の追加
2. SecurityConfigクラスの作成
3. CSRFトークン生成・検証ロジックの実装
4. フロントエンドでのトークン送信処理

**現状の対応**:
- SameSite Cookie属性による軽減（部分的）
- レート制限による大量リクエスト防止

---

## 🔒 セキュリティチェックリスト

### 開発環境
- [x] XSS対策（入力サニタイゼーション）
- [x] レート制限（API過負荷防止）
- [x] CORS設定（localhost許可）
- [x] 環境変数管理（.env.local）
- [x] バリデーション（フロント・バック）
- [ ] CSRF対策（Spring Security未導入のためスキップ）

### 本番デプロイ前
- [ ] CORS設定の本番ドメイン追加
- [ ] HTTPS強制
- [ ] データベースパスワードの環境変数化
- [ ] ログ監視設定
- [ ] セキュリティヘッダー設定（CSP, X-Frame-Options等）
- [ ] 依存関係の脆弱性スキャン（npm audit, OWASP Dependency-Check）

---

## 📝 使用例

### フロントエンド - 入力サニタイゼーション

```typescript
import { sanitizeTeamName, sanitizePlayerName } from '@/lib/sanitize';

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const sanitizedTeamName = sanitizeTeamName(teamName);
    const sanitizedPlayers = players.map(p => ({
        ...p,
        firstName: sanitizePlayerName(p.firstName),
        lastName: sanitizePlayerName(p.lastName),
    }));

    await onSubmit({
        teamName: sanitizedTeamName,
        players: sanitizedPlayers,
    });
};
```

### バックエンド - バリデーションエラーレスポンス

```json
{
  "message": "入力値にエラーがあります",
  "errors": {
    "teamName": "チーム名は必須です",
    "players[0].position": "ポジションはS, WS, MB, OP, Lのいずれかを指定してください"
  }
}
```

---

## 🚀 次のステップ

### 優先度: 高
1. **エラーハンドリング統合** - ErrorMessage, Toast統合
2. **ローディング状態統合** - LoadingSpinner適用
3. **HTTPS対応** - 本番デプロイ時

### 優先度: 中
1. **テスト整備** - セキュリティ関連のユニット/統合テスト
2. **アクセシビリティ改善** - ARIA属性、キーボードナビゲーション
3. **パフォーマンス最適化** - React.memo、コード分割

### 優先度: 低（将来的な拡張）
1. **Spring Security導入** - CSRF対策、認証/認可
2. **データ暗号化** - 機密情報の暗号化保存
3. **監査ログ** - セキュリティイベントのロギング

---

## 📚 参考資料

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Jakarta Bean Validation](https://beanvalidation.org/)
