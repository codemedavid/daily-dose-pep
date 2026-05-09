/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Daily Dose Pep — Navy + Cyan + Purple ──
        'theme-bg':   '#FFFFFF',
        'theme-text': '#0A1A2E',

        // Primary brand accent — purple (token name kept as "pink" for compat)
        'pink': {
          DEFAULT: '#8B5CF6',
          50:  '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },

        'brand': {
          DEFAULT: '#8B5CF6',
          50:  '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },

        // Secondary accent — cyan/teal (kept as "mint")
        'mint': {
          DEFAULT: '#4FC9CE',
          50:  '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#4FC9CE',
          500: '#22B5BA',
          600: '#0E9298',
          700: '#0E7C81',
          800: '#155E63',
          900: '#164E52',
        },

        // Dark surfaces — deep navy (kept tokens "charcoal" + "navy")
        'charcoal': {
          DEFAULT: '#0A1A2E',
          50:  '#F5F7FB',
          100: '#E1E7F2',
          200: '#C2CCDF',
          300: '#9AA8C6',
          400: '#6E7FA6',
          500: '#475A85',
          600: '#2E406A',
          700: '#1B2C4F',
          800: '#142442',
          900: '#0A1A2E',
        },

        'navy': {
          DEFAULT: '#0A1A2E',
          50:  '#F5F7FB',
          100: '#E1E7F2',
          200: '#C2CCDF',
          300: '#9AA8C6',
          400: '#6E7FA6',
          500: '#475A85',
          600: '#2E406A',
          700: '#1B2C4F',
          800: '#142442',
          900: '#0A1A2E',
        },

        // Utility
        'cream':         '#FFFFFF',
        'warm-white':    '#FAFBFD',
        'cool-gray':     '#F5F7FB',
        'surface':       '#FFFFFF',
        'surface-mint':  '#ECFEFF',
        'gold':          '#8B5CF6',
        'maroon':        '#0A1A2E',
        'maroon-light':  '#142442',
        'baby-pink':     '#DDD6FE',
        'blush':         '#EDE9FE',
        'cyan-glow':     '#4FC9CE',
      },

      fontFamily: {
        sans:    ['"Inter"', '"DM Sans"', 'sans-serif'],
        heading: ['"Inter"', 'sans-serif'],
        serif:   ['"Inter"', 'sans-serif'],
        display: ['"Inter"', 'sans-serif'],
        inter:   ['"Inter"', 'sans-serif'],
      },

      fontSize: {
        'display-xl': ['clamp(3rem, 7vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.2rem, 5vw, 3.8rem)', { lineHeight: '1.08', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.8rem, 3.5vw, 2.8rem)', { lineHeight: '1.12', letterSpacing: '-0.01em' }],
      },

      boxShadow: {
        'xs':       '0 1px 2px rgba(10,26,46,0.04)',
        'sm':       '0 2px 6px rgba(10,26,46,0.06)',
        'DEFAULT':  '0 2px 12px rgba(10,26,46,0.08)',
        'md':       '0 4px 20px rgba(10,26,46,0.10)',
        'lg':       '0 8px 36px rgba(10,26,46,0.14)',
        'pink':     '0 6px 24px rgba(139,92,246,0.30)',
        'mint':     '0 6px 24px rgba(79,201,206,0.28)',
        'card':     '0 0 0 1px rgba(10,26,46,0.06), 0 4px 18px rgba(10,26,46,0.06)',
        'clinical': '0 1px 3px rgba(10,26,46,0.05), 0 8px 24px rgba(10,26,46,0.08)',
        'glow':     '0 0 40px rgba(79,201,206,0.45)',
      },

      borderRadius: {
        'none':  '0',
        'sm':    '0.375rem',
        DEFAULT: '0.625rem',
        'md':    '0.875rem',
        'lg':    '1.125rem',
        'xl':    '1.5rem',
        '2xl':   '2rem',
        '3xl':   '2.75rem',
        'full':  '9999px',
      },

      animation: {
        'fadeIn':    'fadeIn 0.8s ease-out',
        'slideUp':   'slideUp 0.7s ease-out',
        'float':     'float 8s ease-in-out infinite',
        'pulse-slow':'pulse 5s cubic-bezier(0.4,0,0.6,1) infinite',
        'shimmer':   'shimmer 6s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-14px)' },
        },
        shimmer: {
          '0%,100%': { backgroundPosition: '0% 50%' },
          '50%':     { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
