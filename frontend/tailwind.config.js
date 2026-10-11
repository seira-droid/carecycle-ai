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
        lavender: {
          50: '#f9f6fd',
          100: '#f3ecfb',
          200: '#e7d8f7',
          300: '#d5b9f1',
          400: '#b98ee5',
          500: '#9e64d7',
          600: '#8346c1',
          700: '#6d35a3',
          800: '#5a2d85',
          900: '#4c266e',
        },
        sage: {
          50: '#f4f7f5',
          100: '#e5ebe6',
          200: '#ccd7cf',
          300: '#a7bdae',
          400: '#7c9e87',
          500: '#5e8369',
          600: '#486851',
        },
        phase: {
          menstrual: '#e11d48',
          follicular: '#0d9488',
          ovulation: '#8b5cf6',
          luteal: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        dyslexic: ['OpenDyslexic', 'Comic Sans MS', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        'card': '0 4px 20px -2px rgba(139, 92, 246, 0.08)',
        'glow': '0 0 25px -5px rgba(124, 58, 237, 0.25)',
      }
    },
  },
  plugins: [],
}
