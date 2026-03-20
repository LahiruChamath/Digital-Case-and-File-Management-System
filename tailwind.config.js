/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff3eb',
          100: '#ffdfc2',
          200: '#ffc18f',
          300: '#fea055',
          400: '#fd8325',
          500: '#fb6500', // Apple-esque vibrant orange
          600: '#ec4e00',
          700: '#c53902',
          800: '#9c2e0a',
          900: '#7d280c',
        },
        sidebar: {
          bg: '#fbfbfd', // Apple off-white
          hover: '#f5f5f7',
          active: '#fb6500',
        },
        status: {
          active: '#34c759', // Apple Green
          pending: '#ff9500', // Apple Orange
          closed: '#8e8e93', // Apple Gray
          overdue: '#ff3b30', // Apple Red
          paid: '#34c759',
        },
        apple: {
          bg: '#fbfbfd',
          surface: '#ffffff',
          text: '#1d1d1f',
          textMuted: '#86868b',
          border: '#d2d2d7',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
      boxShadow: {
        'apple': '0 4px 24px rgba(0, 0, 0, 0.04)',
        'apple-hover': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'apple-sm': '0 2px 12px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
};