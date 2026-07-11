/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      colors: {
        brand: {
          DEFAULT: '#0a2540',
          deep: '#062d3d',
          mid: '#0d3a4f',
          teal: '#0e7490',
          accent: '#0891b2',
          soft: '#ecfeff'
        },
        surface: {
          DEFAULT: '#0a2540',
          raised: '#0d3a4f',
          overlay: '#134e63',
          card: '#ffffff'
        },
        accent: {
          DEFAULT: '#0891b2',
          dim: '#0e7490',
          soft: 'rgba(8, 145, 178, 0.12)'
        }
      },
      boxShadow: {
        card: '0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)',
        soft: '0 4px 24px rgba(6, 45, 61, 0.12)',
        panel: '0 8px 40px rgba(6, 45, 61, 0.18)',
        glow: '0 0 24px rgba(8, 145, 178, 0.25)'
      }
    }
  },
  plugins: []
};
