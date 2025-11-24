// ============================================================
// 対象ファイル: imadoko_front/src/lib/apiClient.ts
// 役割: 統一APIクライアント（エラーハンドリング + リトライ機構付き）
// ============================================================

import { ApiError, ApiErrorResponse } from '../types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // 1秒

type RequestOptions = RequestInit & {
    params?: Record<string, string>;
};

/**
 * 遅延を作成するユーティリティ関数
 */
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * エラーがリトライ可能かどうかを判定
 */
function shouldRetry(error: unknown): boolean {
    if (error instanceof ApiError) {
        // E999（サーバー内部エラー）のみリトライ対象
        // 4xx系エラー（E400, E101, E102等）はリトライしない
        return error.code === 'E999';
    }
    // ネットワークエラー（fetch失敗等）はリトライ対象
    return true;
}

/**
 * 基本的なfetch処理（リトライなし）
 */
async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options;

    let url = `${API_BASE_URL}${endpoint}`;
    if (params) {
        const searchParams = new URLSearchParams(params);
        url += `?${searchParams.toString()}`;
    }

    const headers = {
        'Content-Type': 'application/json',
        ...init.headers,
    };

    try {
        const res = await fetch(url, { ...init, headers });

        if (!res.ok) {
            let errorJson: ApiErrorResponse;
            try {
                errorJson = await res.json();
            } catch {
                // JSONパース失敗時や、バックエンドがエラーJSONを返さない場合のフォールバック
                throw new ApiError({
                    code: 'E999',
                    message: `サーバーエラーが発生しました (${res.status})`,
                    details: [],
                    timestamp: new Date().toISOString(),
                });
            }
            throw new ApiError(errorJson);
        }

        // 204 No Content の場合は null を返す
        if (res.status === 204) {
            return null as T;
        }

        return res.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        // ネットワークエラーなどをラップ
        throw new ApiError({
            code: 'E999',
            message: error instanceof Error ? error.message : 'ネットワークエラーが発生しました',
            details: [],
            timestamp: new Date().toISOString(),
        });
    }
}

/**
 * リトライ機構付きfetch処理
 * Exponential backoff戦略を使用
 */
async function apiFetchWithRetry<T>(
    endpoint: string,
    options: RequestOptions = {},
    retries = MAX_RETRIES
): Promise<T> {
    try {
        return await apiFetch<T>(endpoint, options);
    } catch (error) {
        // リトライ可能なエラーで、かつリトライ回数が残っている場合
        if (retries > 0 && shouldRetry(error)) {
            // Exponential backoff: 1秒 → 2秒 → 3秒
            const delayMs = RETRY_DELAY_BASE * (MAX_RETRIES - retries + 1);

            // デバッグログ（本番環境では削除可能）
            console.warn(`API request failed, retrying in ${delayMs}ms... (${retries} retries left)`);

            await delay(delayMs);
            return apiFetchWithRetry(endpoint, options, retries - 1);
        }

        // リトライ不可、またはリトライ回数切れ
        throw error;
    }
}

/**
 * 公開APIクライアント
 */
export const apiClient = {
    get: <T>(endpoint: string, params?: Record<string, string>) =>
        apiFetchWithRetry<T>(endpoint, { method: 'GET', params }),

    post: <T>(endpoint: string, body: unknown) =>
        apiFetchWithRetry<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),

    put: <T>(endpoint: string, body: unknown) =>
        apiFetchWithRetry<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),

    delete: <T>(endpoint: string) =>
        apiFetchWithRetry<T>(endpoint, { method: 'DELETE' }),
};
