/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#142B61',
          800: '#1c397d',
          700: '#25499a',
        },
        primary: {
          DEFAULT: '#4B55F5',
          hover: '#3D46DC',
          indigo: '#5145E5',
          light: '#EAF1FF',
          lavender: '#EDEBFF',
        },
        surface: {
          bg: '#F5F7FC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          borderLight: '#EDF2F7',
        },
        brand: {
          50: '#EDEBFF',
          100: '#EAF1FF',
          200: '#C7D7FE',
          300: '#93B0FC',
          400: '#6884FA',
          500: '#4B55F5',
          600: '#5145E5',
          700: '#3D46DC',
          800: '#142B61',
          900: '#0C1B3E',
        },
        coral: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px -4px rgba(20, 43, 97, 0.08), 0 4px 6px -2px rgba(20, 43, 97, 0.03)',
        'glow-primary': '0 4px 14px 0 rgba(75, 85, 245, 0.25)',
        'soft': '0 2px 12px -2px rgba(20, 43, 97, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.02)',
        'soft-lg': '0 10px 25px -3px rgba(20, 43, 97, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
}
