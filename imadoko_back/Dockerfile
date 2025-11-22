# Spring Boot Dockerfile（マルチステージビルド）

# ========================================
# Stage 1: Build
# ========================================
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Mavenラッパーとpom.xmlをコピー
COPY tools ./tools
COPY pom.xml ./
COPY src ./src

# 依存関係のダウンロードとビルド
RUN chmod +x ./tools/apache-maven-3.9.6/bin/mvn && \
    ./tools/apache-maven-3.9.6/bin/mvn clean package -DskipTests

# ========================================
# Stage 2: Runtime
# ========================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# ビルド成果物をコピー
COPY --from=builder /app/target/*.jar app.jar

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
