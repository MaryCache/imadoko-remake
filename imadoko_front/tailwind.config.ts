import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        mikasa: {
          blue: {
            DEFAULT: '#003882',
            deep: '#02042B',
            light: '#E6F0FA',
          },
          yellow: {
            DEFAULT: '#FFC600',
            dark: '#E0A800',
            light: '#FFF9E6',
          },
        },
        pos: {
          ws: '#0055A4', // Mikasa Vivid Blue (主軸)
          mb: '#047857', // Deep Forest Green (壁)
          s: '#FFC600', // Mikasa Golden Yellow (司令塔)
          op: '#BE123C', // Deep Crimson (攻撃の要)
          li: '#EA580C', // Deep Orange (守護神・異色)
        },
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans JP"', 'sans-serif'],
      },
      // カスタムアニメーション定義
      animation: {
        'click-pulse': 'clickPulse 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.4s ease-out',
        'rotate-smooth': 'rotateSmooth 0.6s ease-in-out',
        // ローテーションアニメーション（退場）
        'slide-out-left': 'slideOutLeft 0.4s ease-in forwards',
        'slide-out-right': 'slideOutRight 0.4s ease-in forwards',
        'slide-out-top': 'slideOutTop 0.4s ease-in forwards',
        'slide-out-bottom': 'slideOutBottom 0.4s ease-in forwards',
        // ローテーションアニメーション（登場）
        'slide-in-left': 'slideInLeft 0.4s ease-out forwards',
        'slide-in-right': 'slideInRight 0.4s ease-out forwards',
        'slide-in-top': 'slideInTop 0.4s ease-out forwards',
        'slide-in-bottom': 'slideInBottom 0.4s ease-out forwards',
      },
      // キーフレーム定義
      keyframes: {
        clickPulse: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        rotateSmooth: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        // ローテーション退場アニメーション
        slideOutLeft: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        slideOutTop: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(-100%)', opacity: '0' },
        },
        slideOutBottom: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        // ローテーション登場アニメーション
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInTop: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInBottom: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
