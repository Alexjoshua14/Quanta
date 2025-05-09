/** @type {import('tailwindcss').Config} */
export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        commissioner: ["Commissioner"],
      },
      colors: {
        viridian: "#093228",
        background: {
          light: "#F6F1E9",
          dark: "#1A1B1E",
        },
        text: {
          light: "#3F3D34",
          dark: "#F6F1E9",
        },
        textSecondary: {
          light: "#9BA1A6",
          dark: "#3F3D34",
        },
        canvas: {
          light: "#F6F1E9",
          dark: "#1A1B1E",
        },
        card: {
          light: "#FFFDFC",
          dark: "#272724",
        },
        brand: {
          // primary rustic-brown scale
          500: "#8B5E34",
          600: "#C6A27A", // lighter for dark mode
        },
        accent: {
          light: "#6D8A5B",
          dark: "#7FA16E",
        },
      },
    },
  },
  presets: [require("nativewind/preset")],
  plugins: [],
};
