/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./en/**/*.html",
    "./components/**/*.html",
    "./js/**/*.js",
    // Na clean URL migratie ook deze paden:
    "./schilderwerk/**/*.html",
    "./vloeren/**/*.html",
    "./timmerwerk/**/*.html",
    "./bestrating/**/*.html",
    "./vve/**/*.html",
    "./renovatie/**/*.html",
    "./privacy/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#111111',
          gray: '#1A1A1A',
          orange: '#FF5722',
          light: '#F8F9FA'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        header: ['Oswald', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { boxShadow: '0 10px 40px rgba(255, 87, 34, 0.3)' },
          '50%': { boxShadow: '0 10px 50px rgba(255, 87, 34, 0.5)' },
        }
      }
    }
  },
  plugins: []
}
