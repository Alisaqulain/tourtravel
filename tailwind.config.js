/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: { DEFAULT: 'var(--card)', foreground: 'var(--card-foreground)' },
        muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
        primary: {
          DEFAULT: '#E50914',
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#E50914',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
        },
        dark: {
          DEFAULT: '#0B1F3A',
          50: '#E8EEF4',
          100: '#C5D4E4',
          200: '#9FB8D1',
          300: '#789CBE',
          400: '#5A87B0',
          500: '#3C72A2',
          600: '#0B1F3A',
          700: '#091932',
          800: '#07132A',
          900: '#050E22',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #E50914 0%, #0B1F3A 100%)',
        'gradient-hero': 'linear-gradient(135deg, rgba(229,9,20,0.15) 0%, rgba(11,31,58,0.9) 50%, rgba(11,31,58,0.95) 100%)',
        'gradient-card': 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)',
        'gradient-border': 'linear-gradient(135deg, #E50914, #0B1F3A)',
      },
      boxShadow: {
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'card-hover': '0 20px 40px -15px rgba(229, 9, 20, 0.2)',
        'glow': '0 0 40px -10px rgba(229, 9, 20, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 8s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
