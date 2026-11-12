/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic surface tokens
        surface: {
          canvas: 'var(--color-bg-canvas)',
          DEFAULT: 'var(--color-bg-surface)',
          elevated: 'var(--color-bg-surface-elevated)',
          muted: 'var(--color-bg-surface-muted)',
        },
        border: {
          subtle: 'var(--color-border-subtle)',
          strong: 'var(--color-border-strong)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        // Primary Brand Scale: Deep Indigo / Ink-Blue (Linear / Notion / Stripe feel)
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca', // Primary Base Action
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Accent Scale: Warm Amber / Saffron (Used sparingly <= 2%, Indian context nod)
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Accent Base
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        // Secondary structure alias mapped to brand for backward-compatibility
        structure: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        // Warm Stone Neutrals (90% of UI: #fafaf9 page background, #ffffff cards)
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        // Semantic Scales
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        warning: {
          50: '#fefce8',
          100: '#fef9c3',
          500: '#eab308', // Distinct yellow-amber
          600: '#ca8a04',
          700: '#a16207',
        },
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        },
        info: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
      },
      fontFamily: {
        sans: ['Inter', '"Plus Jakarta Sans"', '"Noto Sans Devanagari"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      boxShadow: {
        'soft-xs': '0 1px 2px 0 rgba(28, 25, 23, 0.04)',
        'soft-sm': '0 2px 4px 0 rgba(28, 25, 23, 0.05)',
        'soft': '0 4px 12px -2px rgba(28, 25, 23, 0.07), 0 2px 4px -1px rgba(28, 25, 23, 0.04)',
        'soft-md': '0 8px 20px -4px rgba(28, 25, 23, 0.09), 0 3px 6px -2px rgba(28, 25, 23, 0.04)',
        'soft-lg': '0 16px 32px -6px rgba(28, 25, 23, 0.12), 0 6px 12px -3px rgba(28, 25, 23, 0.05)',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
