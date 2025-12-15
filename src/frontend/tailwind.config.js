/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-green': '#1B4D3E',
        'brand-black': '#000000',
        'brand-white': '#FFFFFF',
      },
    },
  },
  plugins: [],
}