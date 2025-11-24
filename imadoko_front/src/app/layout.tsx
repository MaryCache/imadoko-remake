import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { ToastProvider } from '@/components/ui/Toast';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap', // フォント読み込み最適化
  preload: true, // フォントをプリロード
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false, // モノスペースフォントは必要に応じて読み込み
});

export const metadata: Metadata = {
  title: 'イマドコ・ローテ (Imadoko Rotate)',
  description: 'バレーボールのローテーションとポジションを簡単に管理・シミュレーションできるアプリ',
  keywords: ['バレーボール', 'ローテーション', 'ポジション管理', 'チーム管理', 'スポーツ'],
  authors: [{ name: 'Imadoko Team' }],
};

// Next.js 16: viewport設定は分離
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5, // アクセシビリティ向上
  themeColor: '#1e40af', // Mikasa Blue
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: 'rgb(247, 251, 255)' }}
      >
        <ErrorBoundary>
          <ToastProvider>
            <div className="min-h-screen flex flex-col text-slate-900 font-sans">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">{children}</main>
            </div>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
