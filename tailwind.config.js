/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'nova-bg': '#F8F7F5',
        'nova-bg-secondary': '#EFEDE9',
        'nova-bg-dark': '#1C1C1C',
        'nova-bg-dark-secondary': '#252525',
        'nova-fg': '#1C1C1C',
        'nova-fg-muted': '#5A5A5A',
        'nova-fg-subtle': '#8A8A8A',
        'nova-primary': '#2563EB',
        'nova-primary-hover': '#1D4ED8',
        'nova-primary-light': '#EFF6FF',
        'nova-border': '#DDD9D3',
        'nova-border-dark': '#333333',
        'nova-charcoal': '#2C2C2C',
        'nova-ash': '#E8E5DF',
        'nova-smoke': '#F2F0EC',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Fraunces', 'serif'],
      },
      fontSize: {
        '10': '10px',
        '11': '11px',
      },
      letterSpacing: {
        tightest: '-0.06em',
        editorial: '-0.04em',
        widest2: '0.4em',
        widest3: '0.5em',
      },
      lineHeight: {
        editorial: '0.88',
        tight2: '0.9',
      },
      borderRadius: {
        none: '0px',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
        '1200': '1200ms',
      },
      boxShadow: {
        'nova-sm': '0 2px 12px rgba(0,0,0,0.05)',
        'nova-md': '0 8px 32px rgba(0,0,0,0.08)',
        'nova-lg': '0 24px 64px rgba(0,0,0,0.10)',
        'nova-xl': '0 40px 100px rgba(0,0,0,0.13)',
        'nova-glow': '0 0 60px rgba(37,99,235,0.12)',
        'nova-glow-lg': '0 0 120px rgba(37,99,235,0.15)',
      },
      backgroundImage: {
        'nova-gradient-hero': 'linear-gradient(135deg, #F8F7F5 0%, #EFEDE9 50%, #F8F7F5 100%)',
        'nova-gradient-dark': 'linear-gradient(135deg, #1C1C1C 0%, #2C2C2C 100%)',
        'nova-gradient-promo': 'linear-gradient(120deg, #1C1C1C 0%, #2C2C2C 40%, #1C1C1C 100%)',
      },
      animation: {
        'float': 'float-badge 4s ease-in-out infinite',
        'ping-slow': 'ping-slow 2.5s ease-in-out infinite',
        'scan': 'scan-line 10s linear infinite',
      },
      keyframes: {
        'float-badge': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'ping-slow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.5' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(600px)', opacity: '0' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}