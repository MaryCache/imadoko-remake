/**
 * logger.ts - 本番環境対応のロギングユーティリティ
 * 開発環境: console出力
 * 本番環境: エラーのみ出力、将来的に外部サービス連携可能
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;
    // 本番環境ではerrorとwarnのみ
    return level === 'error' || level === 'warn';
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog('debug')) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  error(message: string, error?: unknown): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, error);
      // 将来的にSentryなどの外部サービスに送信
      // if (typeof window !== 'undefined' && window.Sentry) {
      //     window.Sentry.captureException(error);
      // }
    }
  }
}

export const logger = new Logger();
