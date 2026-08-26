/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        surface2: 'var(--color-surface-2)',
        border: 'var(--color-border)',
        accent: '#6366f1',
        accentHover: '#818cf8',
        muted: 'var(--color-muted)',
        fg: 'var(--color-fg)',
        fg2: 'var(--color-fg-2)',
        danger: 'var(--color-danger)',
        rating: 'var(--color-rating)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(99,102,241,0.4), 0 0 24px rgba(99,102,241,0.15)',
      },
    },
  },
  plugins: [],
};
