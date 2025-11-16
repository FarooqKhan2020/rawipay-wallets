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
        'dark-bg': '#0d0d0d',
        'dark-surface': '#1a1a1a',
        'dark-card': '#242424',
        'dark-border': '#2d2d2d',
        'light-bg': '#ffffff',
        'light-surface': '#f5f5f5',
        'light-card': '#ffffff',
        'light-border': '#e5e5e5',
        'primary': '#037dd6',
        'primary-hover': '#0260a4',
        'accent-indigo': '#6366f1',
        'accent-pink': '#ec4899',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

