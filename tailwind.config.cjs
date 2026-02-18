// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F5F7F4',
          100: '#E8EDE6',
          200: '#D1DACD',
          300: '#B3C1B4',
          400: '#95A89B',
          500: '#677D6A',      // Primary soft - accents
          600: '#40534C',       // Primary medium - buttons
          700: '#2A3A36',
          800: '#1A3636',       // Primary dark - headers
          900: '#0F2424',
        },
        accent: {
          100: '#FCF9F2',
          200: '#F9F0E0',
          300: '#F0E2CC',
          400: '#E3D0B2',
          500: '#D6BD98',       // Accent warm - highlights
          600: '#C0A47C',
          700: '#A58560',
          800: '#8A6644',
          900: '#6F4728',
        },
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      fontFamily: {
        sans: ['Century Gothic', 'CenturyGothic', 'AppleGothic', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },

  
  plugins: [],
}