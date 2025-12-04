/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: '#FF6B35',
        }
      },
      fontFamily: {
  logo: ['Montserrat', 'sans-serif'],
}
    },
  },
  plugins: [],
}