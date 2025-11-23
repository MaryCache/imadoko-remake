# ========================================
# Stage 1: Dependencies
# ========================================
FROM node:20-alpine AS deps
WORKDIR /app

# パスが変わったので、フォルダ構造に合わせてコピー
COPY imadoko_front/package.json imadoko_front/package-lock.json ./imadoko_front/

WORKDIR /app/imadoko_front
RUN npm ci --only=production && npm cache clean --force

# ========================================
# Stage 2: Builder
# ========================================
FROM node:20-alpine AS builder
WORKDIR /app

# 1. 設計図（openapi.yaml）をルートに配置
COPY openapi.yaml .

# 2. フロントエンドの依存関係を準備
WORKDIR /app/imadoko_front
COPY imadoko_front/package.json imadoko_front/package-lock.json ./
RUN npm ci

# 3. ソースコードをコピー
COPY imadoko_front .

# 4. 型定義を生成（これで ../openapi.yaml が見つかる！）
RUN npm run generate:types

# 5. ビルド実行
RUN npm run build

# ========================================
# Stage 3: Runner
# ========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# ビルド成果物をコピー（パスが変わったので調整）
# builderステージの /app/imadoko_front/.next/ から持ってくる
COPY --from=builder /app/imadoko_front/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/imadoko_front/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/imadoko_front/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]