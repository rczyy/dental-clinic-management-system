/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        work: ['Work Sans', 'sans-serif']
      }
    },
  },
  plugins: [require("daisyui")],
}
