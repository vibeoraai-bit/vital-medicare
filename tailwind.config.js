import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0F14',
        card: '#141C24',
        surface: '#0D1526',
        primary: '#2d9cdb',
        'primary-dark': '#1a7ab8',
        accent: '#06D6A0',
        gold: '#F4A261',
        danger: '#EF233C',
        vmtext: '#E0E6ED',
        muted: '#8896A7',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}

export default config