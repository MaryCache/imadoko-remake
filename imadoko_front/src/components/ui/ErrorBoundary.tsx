"use client";
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from './Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary
 * アプリケーションの予期せぬエラーを捕捉し、フォールバックUIを表示する
 * LocalStorageのリセット機能を提供し、復帰を支援する
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    // LocalStorageをクリアしてリロード
    localStorage.removeItem('match-state-v2');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <div className="bg-red-100 p-4 rounded-full mb-4">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            予期せぬエラーが発生しました
          </h2>
          <p className="text-slate-600 mb-6 max-w-md">
            申し訳ありません。アプリケーションで問題が発生しました。
            下のボタンから試合データをリセットして復帰してください。
          </p>

          {this.state.error && (
            <div className="mb-6 p-4 bg-slate-100 rounded-lg text-left w-full max-w-lg overflow-auto max-h-40 text-xs font-mono text-slate-500">
              {this.state.error.toString()}
            </div>
          )}

          <Button
            onClick={this.handleReset}
            variant="danger"
            className="gap-2"
          >
            <RefreshCw size={18} />
            リセットして復帰
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
