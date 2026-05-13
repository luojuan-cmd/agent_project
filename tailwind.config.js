/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        space: {
          bg: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
        },
        nebula: {
          purple: '#8b5cf6',
          indigo: '#6366f1',
        },
        star: {
          white: '#0f172a',
          gray: '#475569',
          dim: '#94a3b8',
        },
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
      },
      fontFamily: {
        display: ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        body: ['"Noto Sans SC"', '"PingFang SC"', 'sans-serif'],
        mono: ['"Orbitron"', '"SF Mono"', '"Fira Code"', 'monospace'],
        sans: ['"Inter"', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
        btn: '10px',
      },
      boxShadow: {
        glow: '0 0 20px rgba(139, 92, 246, 0.08)',
        'glow-lg': '0 0 60px rgba(139, 92, 246, 0.1)',
        'glow-sm': '0 0 8px rgba(139, 92, 246, 0.4)',
        card: '0 4px 24px rgba(139, 92, 246, 0.06)',
        'light': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03)',
        'light-lg': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'light-xl': '0 8px 40px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
