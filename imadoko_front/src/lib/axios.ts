import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { logger } from './logger';

// サーバー側(SSR)とクライアント側で異なるbaseURLを使う
// - サーバー側: 直接バックエンド(localhost:8080)に接続
// - クライアント側: プロキシ(/api)経由でバックエンドに接続 (ngrok対応)
const baseURL = typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'
    : process.env.NEXT_PUBLIC_API_URL || '/api';

// API URLのログ出力
if (typeof window !== 'undefined') {
    logger.info('API baseURL (client):', baseURL);
} else {
    logger.info('API baseURL (server):', baseURL);
}

export const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10秒のタイムアウト
});

// レート制限用のキュー管理
class RateLimiter {
    private queue: Array<() => void> = [];
    private requestCount = 0;
    private readonly maxRequests = 10; // 1秒あたり最大10リクエスト
    private readonly interval = 1000; // 1秒

    constructor() {
        setInterval(() => {
            this.requestCount = 0;
            this.processQueue();
        }, this.interval);
    }

    async throttle(): Promise<void> {
        if (this.requestCount < this.maxRequests) {
            this.requestCount++;
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            this.queue.push(() => {
                this.requestCount++;
                resolve();
            });
        });
    }

    private processQueue(): void {
        while (this.queue.length > 0 && this.requestCount < this.maxRequests) {
            const next = this.queue.shift();
            if (next) next();
        }
    }
}

const rateLimiter = new RateLimiter();

// リクエストインターセプター: レート制限適用
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        await rateLimiter.throttle();
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// レスポンスインターセプター: エラーハンドリング
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            // サーバーエラー (4xx, 5xx)
            logger.error(`API Error: ${error.response.status}`, error.response.data);
        } else if (error.request) {
            // ネットワークエラー
            logger.error('Network Error', error);
        } else {
            // その他のエラー
            logger.error('Request Error', error);
        }
        return Promise.reject(error);
    }
);
