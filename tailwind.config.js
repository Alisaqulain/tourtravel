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
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          50: '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: 'var(--primary)',
          600: '#CA8A04',
          700: '#A16207',
          800: '#854D0E',
          900: '#713F12',
        },
        ring: 'var(--ring)',
        dark: {
          DEFAULT: '#1e3a5f',
          50: '#E8EEF4',
          100: '#C5D4E4',
          200: '#9FB8D1',
          300: '#789CBE',
          400: '#5A87B0',
          500: '#3C72A2',
          600: '#1e3a5f',
          700: '#162d4d',
          800: '#0f2038',
          900: '#091428',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 50%, #EAB308 100%)',
        'gradient-hero': 'linear-gradient(135deg, rgba(251,191,36,0.2) 0%, rgba(15,23,42,0.9) 50%, rgba(15,23,42,0.95) 100%)',
        'gradient-card': 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)',
        'gradient-border': 'linear-gradient(135deg, #FBBF24, #F59E0B, #EAB308)',
      },
      boxShadow: {
        'premium': '0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(251,191,36,0.08)',
        'glass': '0 8px 32px 0 rgba(251, 191, 36, 0.12)',
        'card-hover': '0 20px 40px -15px rgba(234, 179, 8, 0.25), 0 0 0 1px rgba(234,179,8,0.1)',
        'glow': '0 0 40px -10px rgba(251, 191, 36, 0.4)',
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
