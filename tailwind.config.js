/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── LUXXBIO LABS — Luxury Black & Gold ──
        // Black-first palette with metallic gold accents for a premium clinical UI.
        'theme-bg':   '#0A0A0A',
        'theme-text': '#F5E6C8',

        // Gold (primary brand accent — metallic, luxurious)
        // Token name kept as "pink" so existing utility classes still resolve.
        'pink': {
          DEFAULT: '#D4AF37',
          50:  '#FFF9E6',
          100: '#FFF0BF',
          200: '#FFE388',
          300: '#F5D04D',
          400: '#E5BE3A',
          500: '#D4AF37',
          600: '#B8941F',
          700: '#957515',
          800: '#6F560E',
          900: '#4A3908',
        },

        // Backward-compatible aliases (gold).
        'brand': {
          DEFAULT: '#D4AF37',
          50:  '#FFF9E6',
          100: '#FFF0BF',
          200: '#FFE388',
          300: '#F5D04D',
          400: '#E5BE3A',
          500: '#D4AF37',
          600: '#B8941F',
          700: '#957515',
          800: '#6F560E',
          900: '#4A3908',
        },

        // Secondary gold (kept as "mint" token).
        'mint': {
          DEFAULT: '#E5BE3A',
          50:  '#FFF9E6',
          100: '#FFF0BF',
          200: '#FFE388',
          300: '#F5D04D',
          400: '#E5BE3A',
          500: '#D4AF37',
          600: '#B8941F',
          700: '#957515',
          800: '#6F560E',
          900: '#4A3908',
        },

        // Black (text & dark surfaces — matches logo background)
        // Token name kept as "charcoal" so existing references continue working.
        'charcoal': {
          DEFAULT: '#0A0A0A',
          50:  '#F5F5F5',
          100: '#E0E0E0',
          200: '#BDBDBD',
          300: '#9E9E9E',
          400: '#757575',
          500: '#424242',
          600: '#2E2E2E',
          700: '#1F1F1F',
          800: '#121212',
          900: '#0A0A0A',
        },

        'navy': {
          DEFAULT: '#0A0A0A',
          50:  '#F5F5F5',
          100: '#E0E0E0',
          200: '#BDBDBD',
          300: '#9E9E9E',
          400: '#757575',
          500: '#424242',
          600: '#2E2E2E',
          700: '#1F1F1F',
          800: '#121212',
          900: '#0A0A0A',
        },

        // Utility
        'cream':         '#0A0A0A',
        'warm-white':    '#121212',
        'surface':       '#1F1F1F',
        'surface-mint':  '#1F1F1F',
        'gold':          '#D4AF37',
        'maroon':        '#0A0A0A',
        'maroon-light':  '#1F1F1F',
        'baby-pink':     '#FFE388',
        'blush':         '#FFF0BF',
      },

      fontFamily: {
        sans:    ['"DM Sans"', 'sans-serif'],
        heading: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        serif:   ['"Cormorant Garamond"', 'Georgia', 'serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },

      fontSize: {
        'display-xl': ['clamp(3rem, 7vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.2rem, 5vw, 3.8rem)', { lineHeight: '1.08', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.8rem, 3.5vw, 2.8rem)', { lineHeight: '1.12', letterSpacing: '-0.01em' }],
      },

      boxShadow: {
        'xs':      '0 1px 2px rgba(0,0,0,0.40)',
        'sm':      '0 2px 6px rgba(0,0,0,0.45)',
        'DEFAULT': '0 2px 12px rgba(0,0,0,0.50)',
        'md':      '0 4px 20px rgba(0,0,0,0.55)',
        'lg':      '0 8px 36px rgba(0,0,0,0.60)',
        'pink':    '0 6px 24px rgba(212,175,55,0.32)',
        'mint':    '0 6px 24px rgba(212,175,55,0.24)',
        'card':    '0 0 0 1px rgba(212,175,55,0.18), 0 4px 18px rgba(0,0,0,0.45)',
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
