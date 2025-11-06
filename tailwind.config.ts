import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#f1f1f3',
        surface: '#ffffff',
        primary: '#101828',
        accent: '#6366f1'
      },
      boxShadow: {
        soft: '0 10px 40px rgba(15, 23, 42, 0.08)'
      },
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'slide-out': {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' }
        }
      },
      animation: {
        'slide-in': 'slide-in 0.28s ease-out',
        'slide-out': 'slide-out 0.22s ease-in'
      }
    }
  },
  plugins: []
};

export default config;
