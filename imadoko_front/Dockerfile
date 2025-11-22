# Next.js Dockerfile（マルチステージビルド）

# ========================================
# Stage 1: Dependencies
# ========================================
FROM node:20-alpine AS deps

WORKDIR /app

# 依存関係のインストール
COPY package.json package-lock.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# ========================================
# Stage 2: Builder
# ========================================
FROM node:20-alpine AS builder

WORKDIR /app

# 依存関係をコピー
COPY package.json package-lock.json ./
RUN npm ci

# ソースコードをコピー
COPY . .

# OpenAPI型定義の生成（オプション）
# RUN npm run generate:types

# Next.jsビルド
RUN npm run build

# ========================================
# Stage 3: Runner
# ========================================
FROM node:20-alpine AS runner

WORKDIR /app

# 本番用の環境変数
ENV NODE_ENV=production

# 非rootユーザーで実行
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# 必要なファイルのみコピー
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# ポート公開
EXPOSE 3000

# 環境変数
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 起動コマンド
CMD ["node", "server.js"]
