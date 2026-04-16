/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // include your JS/TS files
  ],
  theme: {
  extend: {
    fontFamily: {
      mono: ["'Courier New'", "Courier", "monospace"],
    },
    backgroundImage: {
      
      'food': "url(project3.png)",
    },
  },
},
plugins: [],
}