/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // Nonaktifkan mode gelap otomatis
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeRight: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(50px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out',
        scaleIn: 'scaleIn 0.25s ease-out',
        fadeRight: 'fadeRight 0.4s ease-in forwards',
      },
    },
  },
  plugins: [],
}
