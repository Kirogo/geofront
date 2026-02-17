/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Custom Font
      fontFamily: {
        sans: ['Century Gothic', 'CenturyGothic', 'AppleGothic', 'sans-serif'],
      },
      colors: {
        // Construction/Earth Theme
        primary: {
          50: '#EBF4DD',
          100: '#DCE8CC',
          200: '#C6DAB5',
          300: '#AAC19A',
          400: '#90AB8B',
          500: '#7A937D',
          600: '#5A7863',
          700: '#4A5F51',
          800: '#3B4953',
          900: '#2C353D',
        },
        secondary: {
          50: '#F8FAF5',
          100: '#F0F4EB',
          200: '#E1E8D7',
          300: '#D2DCC3',
          400: '#C3D0AF',
          500: '#B4C49B',
          600: '#A5B887',
          700: '#90A573',
          800: '#7B925F',
          900: '#667F4B',
        },
        success: '#5A7863',
        warning: '#D4A373',
        error: '#D14545',
        info: '#90AB8B',
      },
    },
  },
  plugins: [],
}