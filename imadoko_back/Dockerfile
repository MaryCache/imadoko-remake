# ========================================
# Stage 1: Build
# ========================================
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# 1. 共有ファイル（OpenAPI定義）を先にコピー
# これで /app/openapi.yaml に配置される
COPY openapi.yaml .

# 2. バックエンドの作業ディレクトリを作成
WORKDIR /app/imadoko_back

# 3. pom.xml をコピー（コンテキストがルートになったのでパス付きで指定）
COPY imadoko_back/pom.xml .

# 4. 依存関係のダウンロード
RUN mvn dependency:go-offline

# 5. ソースコードをコピーしてビルド
COPY imadoko_back/src ./src
RUN mvn clean package -DskipTests

# ========================================
# Stage 2: Runtime
# ========================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# ビルド成果物をコピー
# builderステージの /app/imadoko_back/target/ から持ってくる
COPY --from=builder /app/imadoko_back/target/*.jar app.jar

# ヘルスチェック用にcurlをインストール
RUN apk add --no-cache curl

# 非rootユーザーで実行
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# ポート公開
EXPOSE 8080

# 起動コマンド
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1