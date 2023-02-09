/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        work: ["Work Sans", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      lightTheme: {
        "primary": "#2d9cdb",
        "secondary": "#9ae6b4",
        "accent": "#feb2b2",
        "neutral": "#a0aec0",
        "base-100": "#f7fafc",
        "info": "#2d9cdb",
        "success": "#9ae6b4",
        "warning": "#ffedb3",
        "error": "#feb2b2"
      }
    },
    {
      darkTheme: {
        "primary": "#2d9cdb",
        "secondary": "#2f855a",
        "accent": "#feb2b2",
        "neutral": "#a0aec0",
        "base-100": "#1a202c",
        "info": "#2d9cdb",
        "success": "#9ae6b4",
        "warning": "#ffedb3",
        "error": "#feb2b2",
      }
    }
    ],
  },
};
