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
        brand: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        accent: {
          50:  '#eef2ff',
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
        obsidian: {
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
        rose: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-pattern': `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
      },
      backgroundSize: {
        'grid': '60px 60px',
      },
      animation: {
        'pulse-subtle':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':          'float 6s ease-in-out infinite',
        'fade-in-up':     'fade-in-up 0.5s cubic-bezier(0.4, 0, 0.2, 1) both',
        'fade-in-down':   'fade-in-down 0.4s cubic-bezier(0.4, 0, 0.2, 1) both',
        'scale-in':       'scale-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'spin-slow':      'spin 8s linear infinite',
        'glow-pulse':     'glow-pulse 2.5s ease-in-out infinite',
        'soft-bounce':    'soft-bounce 1.8s ease-in-out infinite',
        'ping-ripple':    'ping-ripple 1.5s ease-out infinite',
        'shimmer':        'skeleton-shimmer 1.5s infinite',
        'gradient-shift': 'gradient-shift 4s linear infinite',
        'bar-fill':       'bar-fill 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'blink':          'blink 1s step-end infinite',
        'fadeIn':         'fade-in-up 0.5s ease both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(16,185,129,0.3)' },
          '50%':      { boxShadow: '0 0 24px rgba(16,185,129,0.6)' },
        },
        'soft-bounce': {
          '0%, 100%': { transform: 'translateY(0)',    animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%':      { transform: 'translateY(-6px)', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        },
        'ping-ripple': {
          '0%':   { transform: 'scale(1)',  opacity: '0.8' },
          '100%': { transform: 'scale(2)',  opacity: '0' },
        },
        'skeleton-shimmer': {
          from: { backgroundPosition: '200% 0' },
          to:   { backgroundPosition: '-200% 0' },
        },
        'gradient-shift': {
          '0%':   { backgroundPosition: '0% center' },
          '50%':  { backgroundPosition: '100% center' },
          '100%': { backgroundPosition: '0% center' },
        },
        'bar-fill': {
          from: { transform: 'scaleX(0)' },
          to:   { transform: 'scaleX(1)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
      },
      boxShadow: {
        'glow-sm':  '0 0 10px rgba(16,185,129,0.2)',
        'glow':     '0 0 20px rgba(16,185,129,0.3)',
        'glow-lg':  '0 0 40px rgba(16,185,129,0.4)',
        'glow-indigo': '0 0 20px rgba(99,102,241,0.3)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
