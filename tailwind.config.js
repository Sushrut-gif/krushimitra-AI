/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        farmer: {
          light: '#ecfdf5',
          DEFAULT: '#059669',
          dark: '#047857',
          deep: '#064e3b',
        },
        merchant: {
          light: '#eef2ff',
          DEFAULT: '#4f46e5',
          dark: '#4338ca',
          deep: '#1e1b4b',
        },
        admin: {
          light: '#f1f5f9',
          DEFAULT: '#475569',
          dark: '#334155',
          deep: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
