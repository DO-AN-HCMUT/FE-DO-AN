import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        white: '#ffffff',
        primary: '#135D66',
        'primary-dark': '#0b363b',
        'primary-bright': '#1b8491',
        disabled: '#63d4e2',
        red: '#db4437',
        green: '#0f9d58',
      },
    },
  },
  plugins: [],
};
export default config;
