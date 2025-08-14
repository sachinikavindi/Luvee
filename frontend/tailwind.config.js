/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#042b13',
        'primary-dull': '#daba74',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        prata: ['Prata', 'serif'],
      },
      spacing: {
        '25': '-25px',
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' }
        }
      },
      animation: {
        'slide-in': 'slide-in 0.3s ease-out'
      }
    },
  },
  plugins: [],
}
