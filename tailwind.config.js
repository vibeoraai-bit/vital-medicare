/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2d9cdb',
          light: '#1a7ab8',
          bright: '#2d9cdb',
        },
        gold: {
          DEFAULT: '#2d9cdb',
          light: '#2d9cdb',
        },
        mint: 'rgba(45,156,219,0.1)',
        dark: '#0A0F14',
        muted: '#8896A7',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config