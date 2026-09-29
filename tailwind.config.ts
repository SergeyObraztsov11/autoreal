/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        yellow: {
          DEFAULT: '#fce700',
          deep: '#e6d100',
        },
        ink: {
          DEFAULT: '#0a0a0a',
          2: '#1c1c1c',
        },
        muted: '#4d4d4d',
        canvas: '#f4f4f2',
        line: '#e2e2df',
      },
      fontFamily: {
        display: ['Onest', 'system-ui', 'sans-serif'],
        body: ['Golos Text', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        hard: '5px 5px 0 #0a0a0a',
        'hard-sm': '5px 5px 0 #0a0a0a',
        'hard-md': '5px 5px 0 #0a0a0a',
        'hard-yellow': '5px 5px 0 #fce700',
        'hard-yellow-sm': '5px 5px 0 #fce700',
        'hard-yellow-md': '5px 5px 0 #fce700',
      },
    },
  },
}
