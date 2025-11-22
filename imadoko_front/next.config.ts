import type { NextConfig } from "next";
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // パフォーマンス最適化
  compress: true, // Gzip圧縮を有効化
  poweredByHeader: false, // X-Powered-Byヘッダーを削除（セキュリティ向上）

  // 画像最適化
  images: {
    formats: ['image/webp', 'image/avif'], // 次世代画像フォーマット
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // レスポンシブ画像サイズ
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // アイコンサイズ
  },

  // 実験的機能（パフォーマンス向上）
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react', 'framer-motion'], // パッケージインポート最適化
  },

  // API プロキシ設定 (ngrok経由のモバイルテスト用)
  // スマホからの /api/* リクエストを localhost:8080 のバックエンドに転送
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
