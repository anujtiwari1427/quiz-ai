/**
 * EduPulse AI Design System Tokens
 * Calm, trustworthy "education + craft" palette:
 * - Brand (Primary): Deep Indigo / Ink-Blue (#4338ca)
 * - Accent (Warm): Saffron / Warm Amber (#f59e0b) - <= 2% usage
 * - Neutrals: Warm Stone / Slate (#fafaf9 canvas, #ffffff card surface)
 * - Semantic: Success, Warning, Danger, Info
 */

export const COLOR_TOKENS = {
  brand: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca', // Primary Base
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Saffron Base
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },
  neutral: {
    50: '#fafaf9', // Canvas bg light
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917', // Surface dark
    950: '#0c0a09', // Canvas bg dark
  },
  semantic: {
    success: {
      light: '#f0fdf4',
      base: '#16a34a',
      dark: '#15803d',
    },
    warning: {
      light: '#fefce8',
      base: '#ca8a04',
      dark: '#a16207',
    },
    danger: {
      light: '#fef2f2',
      base: '#dc2626',
      dark: '#b91c1c',
    },
    info: {
      light: '#f0f9ff',
      base: '#0284c7',
      dark: '#0369a1',
    },
  },
} as const;

export const CONTRAST_RATIOS = [
  {
    element: 'Primary Button Text (White on Brand 700 #4338ca)',
    ratio: '8.1:1',
    wcagRating: 'AAA',
    usage: 'Primary CTAs, exam generate button, export actions',
  },
  {
    element: 'Body Text (Neutral 900 #1c1917 on Neutral 50 #fafaf9)',
    ratio: '15.5:1',
    wcagRating: 'AAA',
    usage: 'Main headings, body copy, question text',
  },
  {
    element: 'Secondary Text (Neutral 600 #57534e on Neutral 50 #fafaf9)',
    ratio: '7.0:1',
    wcagRating: 'AAA',
    usage: 'Metadata labels, instructions, secondary captions',
  },
  {
    element: 'Muted Text (Neutral 500 #78716c on Neutral 50 #fafaf9)',
    ratio: '4.6:1',
    wcagRating: 'AA',
    usage: 'Timestamps, shortcuts hints, placeholder text',
  },
  {
    element: 'Focus Ring (Brand 700 on Canvas)',
    ratio: '7.8:1',
    wcagRating: 'Pass (>= 3:1)',
    usage: 'Interactive focus-visible state on all inputs and buttons',
  },
  {
    element: 'Dark Mode Text (Neutral 50 #fafaf9 on Dark Canvas #0c0a09)',
    ratio: '18.3:1',
    wcagRating: 'AAA',
    usage: 'Headings and text in dark theme',
  },
  {
    element: 'Dark Mode Primary Button (White on Brand 600 #4f46e5)',
    ratio: '5.4:1',
    wcagRating: 'AA',
    usage: 'Dark mode primary buttons',
  },
];
