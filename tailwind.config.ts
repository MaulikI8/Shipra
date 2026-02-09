import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        'surface-1': 'rgb(var(--surface-1) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        text: 'rgb(var(--text) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        border: 'rgb(var(--border))',
      },
      borderRadius: {
        lg: '16px',
        xl: '22px',
        '2xl': '28px',
      },
      backdropBlur: {
        '30': '30px',
      },
      fontFamily: {
        sans: ['"SF Pro"', '-apple-system', 'system-ui', 'Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '24px',
          lg: '32px',
        },
      },
    },
  },
  plugins: [],
} satisfies Config

