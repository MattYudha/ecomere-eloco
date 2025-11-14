import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Added for dark mode functionality
  theme: {
    extend: {
      colors: {
        'custom-yellow':'#FED700',
        'eerie-black-1': '#1A1A1A',
        'eerie-black-2': '#121212',
        'grilli-gold': '#DCCA87',
        'grilli-dark-3': '#292929',
        'grilli-white': '#FFFFFF',
        'grilli-text': '#AAAAAA',
        'grilli-gray': '#808080',
        'cream': '#F5F5DC',
        'smoky-black-grilli': '#0F0E0D',
      },
      fontFamily: {
        forum: ['var(--font-forum)'],
        'dm-sans': ['var(--font-dm-sans)'],
      }
    },
  },  
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms"), require("daisyui")],
};
export default config;
