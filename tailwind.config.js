/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#1e293b',
          900: '#0f172a',
        },
        sidebar: {
          bg: '#0f172a',
          hover: '#1e293b',
          active: '#3b82f6',
        },
        status: {
          active: '#22c55e',
          pending: '#f59e0b',
          closed: '#6b7280',
          overdue: '#ef4444',
          paid: '#22c55e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};