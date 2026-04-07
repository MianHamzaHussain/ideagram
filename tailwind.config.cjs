/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E6F0FF',
          75: '#96C0FF',
          100: '#6BA8FF',
          200: '#2B7FFF',
          300: '#0065FF',
          400: '#0047AF',
          500: '#00349C',
        },
        neutral: {
          50: '#DFE1E6',
          100: '#C1C7D0',
          200: '#B3BAC5',
          300: '#97A0AF',
          400: '#7A869A',
          500: '#5E6C84',
          600: '#42526E',
          700: '#253858',
          800: '#172B4D',
          900: '#091E42',
        }
      },
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
      }
    },
  },
  plugins: [],
}
