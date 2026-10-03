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
          50:  '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#38a5f8',
          500: '#0071e3', // Apple Blue
          600: '#0058b6',
          700: '#00438c',
          800: '#033a75',
          900: '#083161',
          950: '#041c38',
        },
        apple: {
          black: '#000000',
          base: '#000000',
          dark: '#0a0a0c',
          card: '#161618',
          surface: '#1c1c1e',
          surfaceHover: '#2c2c2e',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.16)',
          text: '#f5f5f7',
          muted: '#86868b',
          secondary: '#a1a1a6',
          blue: '#0071e3',
          neonBlue: '#2997ff',
          purple: '#bf5af2',
          green: '#30d158',
          orange: '#ff9f0a',
          red: '#ff453a',
          teal: '#64d2ff',
        },
        accent: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#5e5ce6', // Apple Purple / Indigo
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        obsidian: {
          950: '#000000',
          900: '#0b0b0e',
          800: '#161618',
          700: '#1c1c1e',
          600: '#2c2c2e',
          500: '#3a3a3c',
        },
        rose: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#ff453a', // Apple System Red
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
      },
      fontFamily: {
        sans:    ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro Display"', '"SF Pro"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'Outfit', 'Inter', 'sans-serif'],
        mono:    ['"SF Mono"', 'JetBrains Mono', 'Fira Code', 'Menlo', 'monospace'],
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
