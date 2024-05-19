/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    
    extend: {
      colors: {
        default: "#F6F4E8",
        primary: "#BACEC1",
        secondary: "#E59560",
        important: "#1D3124",
        white: "#ffffff"
      }
    },
  },
  plugins: [],
}

