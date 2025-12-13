/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4A90A4",
          dark: "#3A7A8E",
          light: "#5AA0B4",
        },
        background: {
          DEFAULT: "#0D1B2A",
          card: "#1B2838",
          elevated: "#243447",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#A0AEC0",
          muted: "#718096",
        },
        accent: {
          green: "#4CAF50",
          red: "#F44336",
          gold: "#FFD700",
          blue: "#2196F3",
        },
        border: "#2D3748",
      },
    },
  },
  plugins: [],
};
