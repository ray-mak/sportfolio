/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      'sans': ["Roboto", "sans-serif"]
    },
    extend: {
      colors: {
        "darkGray": "#2B2B2B",
        "gray": "#5D5D5D",
        "lightGray": "#E7E4E4",
        "almostWhite": "#F7F7F7",
        "brightRed": "#FF5A35",
        "darkGreen": "#279E00"
      },
    },
  },
  plugins: [],
}