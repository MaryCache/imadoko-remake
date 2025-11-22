# Frontend: TypeScript型定義の自動生成

## 📦 インストール

```bash
cd imadoko_front
npm install --save-dev openapi-typescript
```

## 🔧 package.jsonにスクリプト追加

```json
{
  "scripts": {
    "generate:types": "openapi-typescript ../openapi.yaml -o src/types/api.generated.ts"
  }
}
```

## ▶️ 実行

```bash
npm run generate:types
```

## 📝 使用例（自動生成後）

```typescript
// src/types/api.generated.ts が自動生成される
import type { components } from '@/types/api.generated';

// 型定義が自動的にOpenAPIと同期される
type Team = components['schemas']['Team'];
type TeamRequest = components['schemas']['TeamRequest'];
type Player = components['schemas']['Player'];

// 定数も自動抽出可能
const MAX_PLAYERS = 14; // openapi.yaml の maxItems から抽出
const MIN_PLAYERS = 1;  // openapi.yaml の minItems から抽出
```

## 🎯 メリット

1. **Single Source of Truth**: openapi.yaml のみ修正すれば両端に反映
2. **型安全性**: TypeScriptが自動的にバリデーション
3. **自動補完**: IDEで補完が効く
4. **ドキュメント**: Swagger UIで自動生成
