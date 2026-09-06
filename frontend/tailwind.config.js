/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          base: '#FBF0E1',
          surface: '#FFFFFF',
          card: '#FFFFFF',
          hover: '#F5E6D3',
          border: '#EED9C4',
        },
        indigo: {
          brand: '#4338CA', // exact primary accent
          hover: '#3730A3',
          light: '#EEF2FF',
          border: '#C7D2FE',
        },
        gold: {
          brand: '#D4A017', // exact secondary accent
          hover: '#B8860B',
          light: '#FEF9C3',
          border: '#FDE047',
        },
        charcoal: {
          dark: '#1E1B1A', // exact dark surface
          muted: '#2D2928',
          border: '#3F3B3A',
        },
        slate: {
          subtle: '#6B7280',
        }
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',    // 12px for icon badges
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px for large cards
        'full': '9999px',   // pill buttons
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(30, 27, 26, 0.05)',
        'card': '0 10px 30px -4px rgba(67, 56, 202, 0.04), 0 4px 12px -2px rgba(30, 27, 26, 0.03)',
        'card-hover': '0 18px 40px -4px rgba(67, 56, 202, 0.08), 0 8px 16px -2px rgba(30, 27, 26, 0.04)',
      }
    },
  },
  plugins: [],
}
